const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const expressLru = require('express-lru');
const Sentry = require('@sentry/node');
const Map = require('./models/Map');
const Tree = require("./models/Tree");
const helper = require("./routeUtils");

Sentry.init({ dsn: null });
const cache = expressLru({
  max: 1000,
  ttl: 60000 * 240,
  skip: function (req) {
    // Don't run if bounds passed in, possibly other cases as well
    return !!req.user || !!req.query.bounds;
  }
});
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

if (process.env.NODE_ENV == 'dev') {
  console.log('disable cors');
  app.use(allowCrossDomain);
}

//app.get(/(\/api\/web)?\/trees/, function (req, res) {
app.get("/trees", cache, helper.handlerWrapper(async function (req, res) {
  const map = new Map();
  const beginTime = Date.now();
  await map.init(req.query);
  const response = {};
  response.data = await map.getPoints();
  response.zoomTargets = await map.getZoomTargets();
  console.log("/trees took time:%d ms", Date.now() - beginTime);
  res.status(200).json(response);
}));

app.use(Sentry.Handlers.errorHandler());

//entities API
const entity = require("./api/entity");
//app.use(/(\/api\/web)?\/entities/, entity);
app.use("/entities", entity);

//nearest API
const nearest = require("./api/nearest");
app.use("/nearest", nearest);

app.get("/tree", async function (req, res) {
  try {
    console.log('get tree')
    const tree = new Tree();
    const treeId = req.query.tree_id;
    const uuid = req.query.uuid;
    const token = req.query.token;
    const treeName = req.query.tree_name;
    let treeDetail = {};
    if (treeId) {
      treeDetail = await tree.getTreeById(treeId);
    } else if (uuid) {
      treeDetail = await tree.getTreeByUUID(uuid);
    } else if (treeName) {
      treeDetail = await tree.getTreeByName(treeName);
    } else if (token) {
      treeDetail = await tree.getTreeByToken(token);
    } else {
      console.warn("tree_id did not match any record", treeId);
      res.status(400).json({ message: "tree_id did not match any record" });
    }
    delete treeDetail.planter_identifier;

    res.status(200).json(treeDetail);

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "something wrong:" + error });
  }
});

/*const version = require('../package.json').version
app.get('*',function (req, res) {
  res.status(200).send(version)
});*/

// Global error handler
app.use(helper.errorHandler);

module.exports = app;
