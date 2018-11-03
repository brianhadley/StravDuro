var createError = require("http-errors");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");

var duroRouter = require("./routes/duro");
var userRouter = require("./routes/user");
var userDuroSummaryRouter = require("./routes/user-durosummary");
var retrieveService = require("./services/update.service");
var userDuroSummaryTests = require('./tests/user-durosummary-tests');

var interval = require("rxjs").interval;

userDuroSummaryTests.runTests();
//var rx = require('rxjs');
//sollee: auth0|5ba6ac94dcd6892160019ca0
//brian: google-oauth2|104517979683877860028

var app = express();

var mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb://localhost/StravDuroTests",
    { promiseLibrary: require("bluebird") }
  )
  .then(() => console.log("connection successful"))
  .catch(err => console.error(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist/StravDuroTests")));

app.use("/api/duro", duroRouter);
app.use("/api/user", userRouter);
app.use("/api/userDuroSummary", userDuroSummaryRouter);
app.use("/*", express.static(path.join(__dirname, "dist/StravDuroTests")));

app.use(function(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

/* uncommment to enable stats update service */

//const athleteUpdate = interval(5000);
//athleteUpdate.subscribe(()=>retrieveService.start());
//retrieveService.start();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
