//1. get all athletes
//2. foreach:1 - get athlete new activities (since last run, per athlete)
//3. determine whether segments from new activities are part of a duro
//4. evaluate each qualified segment from step 3 vs. prior segment times
//5. mark athlete evaluated datetime
//6. make sure everything is updated
var athleteRepo = require("../repository/athlete.repo");
var activityRepo = require("../repository/activity.repo");
var duroRepo = require("../repository/duro.repo");

//cleverness from stackoverflow
//https://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i/17500836
const equijoin = (xs, ys, primary, foreign, sel) => {
  const ix = xs.reduce(
    (
      ix,
      row // loop through m items
    ) => ix.set(row[primary], row), // populate index for primary table
    new Map()
  ); // create an index for primary table

  return ys.map((
    row // loop through n items
  ) =>
    sel(
      ix.has(row[foreign]) ? ix.get(row[foreign]) : {}, // get corresponding row from primary (modified for "left join")
      row
    )
  ); // select only the columns you need
};

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

  console.log("segments", segs);
  console.log("results", results);
//  console.log("user duros", user.duros[0].bestEfforts);

  var reducedResults = results.reduce((p,c)=>{if (p[c.segmentId]){if (p[c.segmentId].segmentDuration>c.segmentDuration) p[c.segmentId] = c;} else {p[c.segmentId] = c;} return p; },{});

  //todo: need to reduce this to best per segmentId
  
  segs.forEach(s=> console.log(s.name + " matches", reducedResults[s.id]));

  
  //console.log('new results',newResults);
};

module.exports = updateService;
