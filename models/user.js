var mongoose = require("mongoose");
var duro = require("./duro");

var UserSchema = new mongoose.Schema({
  login: { type: String, unique: true},
  stravaToken: String,
  firstName: String,
  lastName: String,
  stravaAthleteInfo: {
    userName: String,
    stravaUserId: String
  },
  duros: [{type: mongoose.Schema.Types.ObjectId,  ref: 'duro'}],
  lastProcessed: Date
});

module.exports = mongoose.model("user", UserSchema);
