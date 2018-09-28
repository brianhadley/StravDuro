var mongoose = require("mongoose");
var user = require("../models/user.js");

var athleteRepo = {
  getAllAthletesWithActiveDuros: function(done) {
    
      user
        .find()
        .populate("duros")
        .exec((err, result) => {
          var haveDuro = result.filter(x => x.duros.length > 0);
          var results = [];
          haveDuro.forEach(element => {
            if (this.assessHasActiveDuros(element.duros)) results.push(element);
          });
          console.log('returning', results);
          done(results);
        });
    
  },

  assessHasActiveDuros: function(duros) {
    var result = false;
    duros.forEach(element => {      
      if (
        Date.parse(element.startdate) <= Date.now() &&
        Date.parse(element.enddate) >= Date.now()
      ) {
        console.log("returning true");
        result = true;
      }
    });
    return result;
  }
};

module.exports = athleteRepo;
