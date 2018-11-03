var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("express-jwt");
var jwtAuthz = require("express-jwt-authz");
var jwksRsa = require("jwks-rsa");
var checkJwt = require("../core/jwtValidation.js");
var duro = require("../models/duro.js");
var from = require("rxjs").from;
var of = require("rxjs").of;
var map = require("rxjs").map;
var forkJoin = require("rxjs").forkJoin;
var concatMap = require("rxjs/operators").concatMap;
var mergeMap = require("rxjs/operators").mergeMap;
var strava = require("strava-v3");
var user = require("../models/user.js");

//router.use(checkJwt);

router.get("/", function(req, res, next) {
  console.log("received requests", req.user);
  let userId = "google-oauth2|104517979683877860028";
  //let userId = req.user.sub;
  
  

  user$(userId)
    .pipe(
      mergeMap(user =>{        
        return duros$().pipe(mergeMap(duros =>{          
          var result = duros.map(duro=>{duro.isUserSubscribed = duro.users.indexOf(user._id) > -1; return duro;});
          console.log('result',result);
          return of(result);
        })
        );
        }
      )
    )
    .subscribe(duros => res.json(duros));
});

duros$ = function() {
  return from(duro.find().exec());
};

user$ = function(login) {
  console.log('creating obs');
  return from(user.findOne({ login: login }).exec());
};

router.get("/:id", function(req, res, next) {
  duro.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post("/", function(req, res, next) {
  //let userId = req.user.sub;
  let userId = "google-oauth2|104517979683877860028";
  console.log("entered post method", req.body);
  

  let newDuro$ = router.resolveSegmentsData$(req.body, userId);

  console.log("newDuro$", newDuro$);
  //need to test this one
  newDuro$
    .pipe(
      mergeMap(resolvedSegs => {
        //console.log('resolved me some segs', resolvedSegs);
        req.body.segments = resolvedSegs;
        return duroSave$(req.body);
      })
    )
    .subscribe(saveResult => res.json(saveResult));
});

router.put("/:id", function(req, res, next) {
  duro.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete("/:id", function(req, res, next) {
  duro.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.resolveSegmentsData$ = function(duro, login) {
  let segment$ = of(duro.segments);
  console.log("created segment$", segment$);
  return getUserData$(login).pipe(
    mergeMap(user => {
      console.log("got a user", user);
      return segment$.pipe(
        mergeMap(seg =>
          forkJoin(
            ...seg.map(item => fetchSegmentData$(item, user.stravaToken))
          )
        )
      );
    })
  );
};
//guy on podcast said "I'm a perfectionist"
duroSave$ = function(content) {
  console.log("ok ill bite");

  return from(
    new Promise((resolve, reject) => {
      duro.create(content, (err, post) => {
        if (err) {
          reject(err);
        }
        resolve(post);
      });
    })
  );
};

fetchSegmentData$ = function(segmentId, userStravaToken) {
  console.log("creating observable", {
    segmentId: segmentId,
    userStravaToken: userStravaToken
  });

  console.log("strava.segments is", strava.segments);

  return from(
    new Promise((resolve, reject) => {
      strava.segments.get(
        {
          access_token: userStravaToken,
          id: segmentId
        },
        (err, result) => resolve(result)
      );
    })
  );
};

getUserData$ = function(login) {
  return from(user.findOne({ login: login }).exec());
};

module.exports = router;
