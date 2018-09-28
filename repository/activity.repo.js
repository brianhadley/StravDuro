var strava = require("strava-v3");
var of = require("rxjs").of;
var forkJoin = require("rxjs").forkJoin;
var mergeMap = require("rxjs/operators").mergeMap;

var activityRepo = {};

activityRepo.getActivitySegmentDetailForUser = function(user, done) {
  var after = user.lastProcessed? user.lastProcessed : new Date() / 1000 - 86400 * 5;
  var before = new Date() / 1000;

  strava.activities.getSummary(
    { access_token: user.stravaToken, before: before, after: after },
    (err, result) => {
      console.log('error',err);
      user.lastProcessed = before;
      //todo: save user
      this.getActivitySegmentInfo(user, result.map(result => result.id), done);
    }
  );
};

activityRepo.getActivitySegmentInfo = function(user, activities, done) {
  var activities$ = of(activities);

  var fetchDetail = activity =>
    new Promise((resolve, reject) => {
      //activities.forEach(element => {
      strava.activities.get(
        {
          access_token: user.stravaToken,
          id: activity,
          include_all_efforts: true
        },
        (err, result) => {
          var mappedEfforts = result.segment_efforts.map(item => {
            return {
              activityId: activity,
              segmentEffortId: item.id,
              segmentId: item.segment.id,
              segmentDuration: item.elapsed_time
            };
          });
          resolve(mappedEfforts);
        }
      );
    });

  activities$
    .pipe(mergeMap(items => forkJoin(...items.map(item => fetchDetail(item)))))
    .subscribe(result => {
      result = [].concat(...result);
      done(user, result);
    });  
};

module.exports = activityRepo;
