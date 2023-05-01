"use strict";

const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");

const app = express();

app.use("/public", express.static(`${__dirname}/public`));
app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

app.use(function (err, req, res, next) {
  res.status(200).type("text").send(err.message);
});

module.exports = app; //for unit/functional testing
