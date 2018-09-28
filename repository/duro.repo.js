var mongoose = require("mongoose");
var duro = require("../models/duro.js");

var duroRepo = duro;

duroRepo.getById = function(id) {
        duro.findById(id, function(err, post) {
            if (err) return null;
            return post;
          });
    }



module.exports = duroRepo;