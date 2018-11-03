var mongoose = require("mongoose");
var user = require("./user");

var DuroSchema = new mongoose.Schema({
  isUserSubscribed: Boolean,
  duroname: String,
  startdate: Date,
  enddate: Date,
  description: String,
  location: {
    lat: Number,
    long: Number
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  segments: [
    {
      id: Number,
      resource_state: Number,
      name: String,
      activity_type: String,
      distance: Number,
      start_latitude: Number,
      start_longitude: Number,
      end_latitude: Number,
      end_longitude: Number,
      climb_category: Number,
      city: String,
      state: String,
      country: String,
      created_at: Date,
      updated_at: Date,
      total_elevation_gain: Number,
      map: {
        id: String,
        polyline: String,
        resource_state: Number
      },
      effort_count: Number,
      athlete_count: Number,
      star_count: Number
    }
  ],
  bestEfforts: [
    {
      _id: false,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      userName: String,
      segmentId: Number,
      segmentName: String,
      activityId: Number,
      segmentEffortId: Number,
      segmentDuration: Number
    }
  ]
});

module.exports = mongoose.model("duro", DuroSchema);
