var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var duro = require("../models/duro.js");

router.get(
  "/",    
  function(req, res, next) {
    console.log("received request", req.user);
    duro.find(function(err, products) {
      if (err) return next(err);
      res.json(products);
    });
  }
);

router.get("/:id", function(req, res, next) {  
  duro.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post("/", function(req, res, next) {
  duro.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
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

module.exports = router;
