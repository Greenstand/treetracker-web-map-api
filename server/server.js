var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var pg = require('pg');
const { Pool, Client } = require('pg');
var path = require('path');
var app = express();
var port = process.env.NODE_PORT || 3000;
var config = require('./config/config');
const Sentry = require('@sentry/node');

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

app.get('/trees', function (req, res) {
  //console.log(req);

  let token = req.query['token'];
  let organization = req.query['organization'];
  let flavor = req.query['flavor'];
  let treeid = req.query['treeid'];
  let userid = req.query['userid'];
  let wallet = req.query['wallet'];

  let select = '';
  let join = '';
  let joinCriteria = '';
  let filter = '';
  let subset = false;
  if (token) {
    join = "INNER JOIN certificates ON trees.certificate_id = certificates.id AND certificates.token = '" + token + "'";
    subset = true;
  } else if(organization) {
    join = `JOIN certificates ON trees.certificate_id = certificates.id
             JOIN donors ON certificates.donor_id = donors.id
             JOIN organizations ON donors.organization_id = organizations.id`;
    joinCriteria = "AND organizations.id = " + organization;
    subset = true;
  } else if (flavor) {
    join = "INNER JOIN tree_attributes ON tree_attributes.tree_id = trees.id";
    joinCriteria = "AND tree_attributes.key = 'app_flavor' AND tree_attributes.value = '" + flavor + "'";
    subset = true;
  } else if(treeid) {
    filter = 'AND trees.id = ' + treeid + ' '
    subset = true;
  } else if(userid) {
    filter = 'AND trees.planter_id = ' + userid + ' '
    subset = true;
  } else if(wallet) {
    select = ', token.uuid AS token_uuid '
    join = 'INNER JOIN token ON token.tree_id = trees.id'
    join += ' INNER JOIN entity ON entity.id = token.entity_id'
    filter = "AND entity.wallet = '" + wallet + "'"
    subset = true
  }

  let bounds = req.query['bounds'];
  let boundingBoxQuery = '';
  let clusterBoundingBoxQuery = '';
  if (bounds) {
    boundingBoxQuery = 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + bounds + ', 4326) ';
    clusterBoundingBoxQuery = 'AND location && ST_MakeEnvelope(' + bounds + ', 4326) ';
    console.log(bounds);
  }

  let clusterRadius = parseFloat(req.query['clusterRadius']);
  console.log(clusterRadius);
  var sql, query
  const zoomLevel = req.query['zoom_level'];
  if (parseInt(zoomLevel) > 15 || treeid != null ) {

    sql = `SELECT DISTINCT ON(trees.id)
    'point' AS type,
     trees.*, planter.first_name as first_name, planter.last_name as last_name,
    planter.image_url as user_image_url `
    + select + `
    FROM trees `
    + join + `
    INNER JOIN planter
    ON planter.id = trees.planter_id
    LEFT JOIN note_trees
    ON note_trees.tree_id = trees.id
    LEFT JOIN notes
    ON notes.id = note_trees.note_id
    WHERE active = true ` + boundingBoxQuery + filter + joinCriteria;
    console.log(sql);

    query = {
      text: sql
    };
  } else if (subset) {

    console.log('Calculating clusters directly');
    sql = `SELECT 'cluster'                                           AS type,
       St_asgeojson(St_centroid(clustered_locations))                 centroid,
       St_numgeometries(clustered_locations)                          count
      FROM   (
       SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
       FROM   trees ` + join + `
       WHERE  active = true ` + boundingBoxQuery + filter + joinCriteria + ` ) clusters`;
    query = {
      text: sql,
      values: [clusterRadius]
    };

  } else if (config.defaultClusterCacheZoomLevels.includes(zoomLevel)) {

    console.log('Using cluster cache from zoom level 14  for zoom level ' + zoomLevel);
    sql = `SELECT 'cluster' as type,
           St_asgeojson(location) centroid, count
           FROM clusters
           WHERE zoom_level = 14 ${clusterBoundingBoxQuery}`
    query = {
      text: sql
    }
    console.log(query);

  } else {

    // check if query is in the cached zone
    var boundingBox;
    if(bounds) {
      boundingBox = bounds.split(',');
      console.log(boundingBox);
    }

    var regionBoundingBoxQuery = "";

    console.log(zoomLevel);
    if(zoomLevel >= 10) {
      console.log('greater eq 10');

      if( bounds ) {
        regionBoundingBoxQuery = ' AND geom && ST_MakeEnvelope(' + bounds + ', 4326) ';
      }

      query = {
        text: `SELECT 'cluster' AS type,
			  region.id, ST_ASGeoJson(region.centroid) centroid,
                 region.type_id as region_type,
                 count(tree_region.id)
                 FROM tree_region
                 JOIN trees
                 ON trees.id = tree_region.tree_id
                 AND trees.active = TRUE
                 JOIN region
                 ON region.id = region_id
                 WHERE zoom_level = $1
                 ${regionBoundingBoxQuery}
                 GROUP BY region.id`,
        values: [req.query['zoom_level']]
      };

    } else {

      query = {
        text: `SELECT 'cluster' AS type,
             region_id id, ST_ASGeoJson(centroid) centroid,
             type_id as region_type,
             count(id)
             FROM active_tree_region tree_region
             WHERE zoom_level = $1
             GROUP BY region_id, centroid, type_id`,
        values: [req.query['zoom_level']]
      };

    }

  }

  console.log(query);
  pool.query(query)
    .then(function (data) {
      console.log('query ok');
      console.log(data.rows)
      res.status(200).json({
        data: data.rows
      })
    })
    .catch(function(error) {
      console.log('query not ok');
      console.log(error);
      throw(error);
    });

});

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log('listening on port ' + port);
});
