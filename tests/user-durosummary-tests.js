var testContainer = {};
var testHarness = {};
var userDuroSummary = require('../routes/user-durosummary');
var duro = require('../routes/duro');


testHarness.runTests = function() {
    Object.keys(testContainer).forEach(key=>{
        console.log('result from test ' + key + '. test result: ' + testContainer[key]());
    });
};


testContainer.testDuroSummary = function() {
    userDuroSummary.getUserDuroRanks('5ba98168339d5c3190f9ffde','5ba902f7889a2153386654c9');
    return 'failed';
};


testContainer.testDuroSegmentFill = function() {
    duro.resolveSegmentsData$({segments:[1697093,7604122]},'google-oauth2|104517979683877860028').subscribe(i=>{
        console.log('fill result',i);
    });
};

module.exports = testHarness;