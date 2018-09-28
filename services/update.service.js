//1. get all athletes
//2. foreach:1 - get athlete new activities (since last run, per athlete)
//3. determine whether segments from new activities are part of a duro
//4. evaluate each qualified segment from step 3 vs. prior segment times
//5. mark athlete evaluated datetime
//6. make sure everything is updated
var athleteRepo = require("../repository/athlete.repo");
var activityRepo = require("../repository/activity.repo");

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
  console.log("user duros", user.duros[0].bestEfforts);

  const segresultjoin = equijoin(
    results,
    segs,
    "segmentId",
    "id",
    ({ activityId, segmentEffortId, segmentDuration }, { id, name }) => {
      return {
        _segmentUserComposite: user._id + "_" + id,
        _userId: user._id,
        _segmentId: id,
        _segmentName: name,
        _activityId: activityId,
        _segmentEffortId: segmentEffortId,
        _segmentDuration: segmentDuration
      };
    }
  );
  //todo: need to reduce this to best per segmentId
  console.log("matches", segresultjoin);

  var testDuro = [ { segmentUserComposite: '5ba902f7889a2153386654c9_629052',
  userId: "5ba902f7889a2153386654c9",
  segmentId: 629052,
  segmentName: 'Upper lot up 8 to lookout',
  activityId: 1865600243,
  segmentEffortId: 46809301386,
  segmentDuration: 715 },
{ segmentUserComposite: '5ba902f7889a2153386654c9_628544',
  userId: "5ba902f7889a2153386654c9",
  segmentId: 628544,
  segmentName: 'Cave Descent',
  activityId: 1858645220,
  segmentEffortId: 46605746040,
  segmentDuration: 366 } ];

  var newResults = equijoin(
    testDuro,
    segresultjoin,
    "segmentUserComposite",
    "_segmentUserComposite",
    (        
      {
        segmentUserComposite,
        userId,
        segmentId,
        segmentName,
        activityId,
        segmentEffortId,
        segmentDuration
      },
      {
        _segmentUserComposite,
        _userId,
        _segmentId,
        _segmentName,
        _activityId,
        _segmentEffortId,
        _segmentDuration
      }      
    ) => {
      var useNew = _segmentUserComposite===segmentUserComposite && _segmentDuration < (segmentDuration?segmentDuration:9999999999);
      console.log('useNew?',useNew);
      return {
        segmentUserComposite: useNew?_segmentUserComposite:segmentUserComposite,
        userId: useNew?_userId:userId,
        segmentId: useNew?_segmentId:segmentId,
        segmentName: useNew?_segmentName:segmentName,
        activityId: useNew ? _activityId : activityId,
        segmentEffortId: useNew ? _segmentEffortId : segmentEffortId,
        segmentDuration: useNew ? _segmentDuration : segmentDuration
      };
    }
  );

  console.log('new results',newResults);
};

module.exports = updateService;
