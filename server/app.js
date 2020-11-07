var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var pg = require('pg');
const { Pool, Client } = require('pg');
var path = require('path');
var app = express();
var config = require('./config/config');
const Sentry = require('@sentry/node');
const Map = require('./models/Map');

const pool = new Pool({ connectionString: config.connectionString });
Sentry.init({ dsn: config.sentryDSN });

app.use(Sentry.Handlers.requestHandler());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.set('view engine', 'html');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

if(process.env.NODE_ENV == 'dev'){
  app.use(allowCrossDomain);
}

//app.get(/(\/api\/web)?\/trees/, function (req, res) {
app.get("/trees", async function (req, res) {
  try{
    const map = new Map();
    await map.init(req.query);
    const query = await map.getQuery();


    console.log(query);
    const response = {};
    const data = await pool.query(query);
    console.log('query ok');
    console.log(data.rows.slice(0,2))
    response.data = data;
    const zoomTargetsQuery = await map.getZoomTargetQuery();
    if(zoomTargetsQuery){
      const zoomTargetData = await pool.query(zoomTargetsQuery);
      console.log('got zoom targets data');
      response.zoomTargets = zoomTargetData.rows;
    }
    res.status(200).json(response);
  }catch(e){
    console.error(e);
  }
});

app.use(Sentry.Handlers.errorHandler());

//entities API
const entity = require("./api/entity");
//app.use(/(\/api\/web)?\/entities/, entity);
app.use("/entities", entity);

//nearest API
const nearest = require("./api/nearest");
app.use("/nearest", nearest);

////add static files, HTML pages
//app.use(express.static(path.join(__dirname, "../client")));
//app.get("/", (req, res) => {
//  res.sendFile(path.join(__dirname, "../client", "index.html"));
//});

//app.listen(port, () => {
//  console.log('listening on port ' + port);
//});
module.exports = app;
