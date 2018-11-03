var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var duro = require("../models/duro.js");
var user = require("./user");
var jwt = require("express-jwt");
var jwtAuthz = require("express-jwt-authz");
var jwksRsa = require("jwks-rsa");
var checkJwt = require("../core/jwtValidation.js");
var from = require("rxjs").from;

router.use(checkJwt);

//get user summary
//TODO: reuse code
router.get("/:duroid", function(req, res, next) {  
  var userId = req.user.sub;
  console.log('USERID IS: ',userId);
  router.getUserDuroRanks(req.params.duroid).subscribe(duro => {
    //console.log("results from getUserDuroRanks", x);
    var emptyResults = createEmptyResults(duro.users, duro.segments);
    
    var filledResults = fillResultsFromBestEfforts(
      emptyResults,
      duro.bestEfforts,
      userId
    );
    //console.log("filledResults", filledResults);
    res.json({duroId:duro._id, duroName: duro.duroname,duroParticipants:filledResults});
  }, error => next(error));
  
});

router.getUserDuroRanks = function(duroId) {
  //TODO: line directly below will break, and stop node, how to properly handle exceptions?
  //from(duro.findById(duroId+'poo').exec()).subscribe(x=>{

  return from(
    duro
      .findById(duroId)
      .populate({ path: "users", model: "user" })
      .exec()
  );
};

createEmptyResults = function(users, segments) {
  return users.map(user => {
    return {
      userId: user._id,
      login: user.login,
      userName: user.firstName + " " + user.lastName,
      segmentResults: segments
    };
  });
};

fillResultsFromBestEfforts = function(emptyResults, efforts, userId = 0) {
  var result = emptyResults.map(user => {

    var userRecords = filterToUser(efforts, user);
    
    var userBest = getUserBest(userRecords);    
    console.log('userId in efforts is:',user.userId);
    console.log('userId in param is:',userId);
    var allResults = {
      userId: user.userId,
      userName: user.userName,
      isCurrentUser: user.login == userId,
      overallTime: user.segmentResults.reduce(
        (p, c) =>
          (p += userBest[c.id] ? userBest[c.id].segmentDuration : undefined),
        0
      ),
      results: user.segmentResults.map(seg => {
        return {
          segmentName: seg.name,
          activityId: userBest[seg.id]?userBest[seg.id].activityId:undefined,
          segmentEffortId: userBest[seg.id]?userBest[seg.id].segmentEffortId:undefined,
          segmentId: seg.id,
          segmentDuration: userBest[seg.id]?userBest[seg.id].segmentDuration:undefined
        };
      })
    };
    console.log('allResults',allResults);
    return allResults;
  });
  
  return rankResults(result);
  
};

filterToUser= function(efforts, user) {
  return efforts.filter(effort => {
    var isMatch =
      JSON.stringify(effort.userId) == JSON.stringify(user.userId);      
    return isMatch;
  });
};

rankResults = function(filledResults) {
  var sorted = filledResults.sort(
    (a, b) =>
      a.overallTime > b.overallTime ? 1 : b.overallTime > a.overallTime ? -1 : 0
  );  
  
  var ranked = sorted.reduce((accumulator,currentValue,index)=>{
    currentValue.rank = index + 1;
    accumulator.push(currentValue);
    return accumulator;
  },[]);

  return ranked;
};

getUserBest = function(userRecords) {
  return userRecords.reduce((p, c) => {
    if (p[c.segmentId]) {
      if (p[c.segmentId].segmentDuration > c.segmentDuration)
        p[c.segmentId] = c;
    } else {
      p[c.segmentId] = c;
    }
    return p;
  }, {});
};

module.exports = router;
