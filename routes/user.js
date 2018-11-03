var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var user = require("../models/user.js");
var jwt = require("express-jwt");
var jwtAuthz = require("express-jwt-authz");
var jwksRsa = require("jwks-rsa");
var checkJwt = require("../core/jwtValidation.js");
var strava = require("strava-v3");
var from = require('rxjs').from;

router.use(checkJwt);

router.get("/", function(req, res, next) {
  console.log("received request", req.user.sub);
  user.findOne({ login: req.user.sub }, function(err, post) {
    if (err) return next(err);
    console.log("post:", post);
    res.json(post);
  });
});

router.get("/:id", function(req, res, next) {
  user.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post("/", function(req, res, next) {
  req.body.login = req.user.sub;

  user.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put("/", function(req, res, next) {
  //todo: this should be factored down to repo or service
  
  user.findOne({ login: req.user.sub }, function(err, foundUser) {
    if (err) return next(err);
    if (!foundUser)
      res.json(false);
    console.log("put:", foundUser);
    strava.oauth.getToken(req.body.code, function(err, token) {
      if (err) return next(err);
      console.log("redeemed token:", token);
      foundUser.stravaToken = token.access_token;
      foundUser.stravaAthleteInfo.userName = token.athlete.username;
      foundUser.stravaAthleteInfo.stravaUserId = token.athlete.id;
      foundUser.stravaAthleteInfo.profile = token.athlete.profile;
      foundUser.stravaAthleteInfo.email = token.athlete.email;
      user.findByIdAndUpdate(foundUser._id, foundUser, function(err, post) {
        if (err) return next(err);
        res.json(true);
      });    
    });
  });  
});

router.delete("/:id", function(req, res, next) {
  user.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});




module.exports = router;
