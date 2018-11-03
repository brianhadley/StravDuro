//1. get all athletes
//2. foreach:1 - get athlete new activities (since last run, per athlete)
//3. determine whether segments from new activities are part of a duro
//4. evaluate each qualified segment from step 3 vs. prior segment times
//5. mark athlete evaluated datetime
//6. make sure everything is updated
var athleteRepo = require("../repository/athlete.repo");
var activityRepo = require("../repository/activity.repo");
var duroRepo = require("../repository/duro.repo");

var updateService = {};

updateService.start = function() {
  athleteRepo.getAllAthletesWithActiveDuros(this.processUsers);
};

updateService.processUsers = function(users) {
  users.forEach(element => {
    activityRepo.getActivitySegmentDetailForUser(
      element,
      updateService.evaluateSegments
    );
  });
};

updateService.evaluateSegments = function(user, results) {
  var segs = user.duros.map(duro =>
    duro.segments.map(s => {
      return { id: s.id, name: s.name };
    })
  );
  segs = [].concat(...segs);

  console.log("user", user);
  //console.log("results", results);
  //  console.log("user duros", user.duros[0].bestEfforts);

  var reducedResults = results.reduce((p, c) => {
    if (p[c.segmentId]) {
      if (p[c.segmentId].segmentDuration > c.segmentDuration)
        p[c.segmentId] = c;
    } else {
      p[c.segmentId] = c;
    }
    return p;
  }, {});

  var bestNewSegs = segs.map(s => {
    result = reducedResults[s.id];
    return {
      userId: user._id,
      userName: user.firstName + " " + user.lastName,
      segmentName: s.name,
      activityId: result.activityId,
      segmentEffortId: result.segmentEffortId,
      segmentId: result.segmentId,
      segmentDuration: result.segmentDuration
    };
  });

  user.duros.forEach(duro => {
    console.log("duro", duro);
    bestNewSegs = bestNewSegs.map(item => item);
    console.log('best efforts',bestNewSegs);
    
    duroRepo.updateOne(
      {_id: duro._id },
      { $addToSet: { bestEfforts: { $each: [...bestNewSegs] } } }, (err,result) => {console.log('error',err);console.log('result',result);}
    );

    /* erases
    duroRepo.update(
      { _id: duro._id },
      {$pull: {bestEfforts: {$exists: true}}},
      (err,result) => {console.log('error',err);console.log('result',result);}
    );*/
  });

  
  athleteRepo.updateOne({_id:user._id}, {$set: {lastProcessed:user.lastProcessed}},(err,result) => {console.log('error',err);console.log('user result',result);});

};

module.exports = updateService;
