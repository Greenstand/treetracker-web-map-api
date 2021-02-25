const log = require("loglevel");
const { Pool} = require('pg');
const SQLCase2 = require("./sqls/SQLCase2");
const SQLCase2Timeline = require("./sqls/SQLCase2Timeline");
const SQLCase1 = require("./sqls/SQLCase1");
const SQLCase1Timeline = require("./sqls/SQLCase1Timeline");
const SQLCase3Timeline = require("./sqls/SQLCase3Timeline");
const SQLCase3 = require("./sqls/SQLCase3");
const SQLCase4 = require("./sqls/SQLCase4");
const SQLZoomTargetCase1V2 = require("./sqls/SQLZoomTargetCase1V2");


class Map{
  constructor(){
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async init(settings){
    console.debug("init map with settings:", settings);
    this.treeid = settings.treeid;
    this.zoomLevel = parseInt(settings.zoom_level);
    this.userid = settings.userid;
    this.clusterRadius = settings.clusterRadius;
    this.mapName = settings.map_name;
    this.bounds = settings.bounds;
    this.wallet = settings.wallet;
    this.flavor = settings.flavor;
    this.token = settings.token;
    this.treeIds = [];
    this.timeline = settings.timeline;
    if(this.treeid){
      /*
       * Single tree map mode
       */
      this.sql = new SQLCase2();
      this.sql.addTreeFilter(this.treeid);

    }else if(this.capture_id){
      this.sql = new SQLCase2();
      this.sql.addUUIDFilter(this.capture_id);
    }else if(this.userid){
      /*
       * User map mode
       */
      //count the trees amount first
      const result = await this.pool.query({
        text: `select count(*) as count from trees where planter_id = ${this.userid}`,
        values:[]
      });
      const treeCount = result.rows[0].count;
      parseInt(treeCount);
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByUserId(this.userid);
      }else{
        if(treeCount > 2000){
          this.sql = new SQLCase1();
          this.sql.addFilterByUserId(this.userid);
          this.sql.setZoomLevel(this.zoomLevel);
          this.sql.setBounds(this.bounds);
        }else{
          this.sql = new SQLCase3();
          this.sql.setClusterRadius(this.clusterRadius);
          this.sql.addFilterByUserid(this.userid);
          this.sql.setBounds(this.bounds);
        }
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.wallet){
      /*
       * wallet map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByWallet(this.wallet);
      }else{
        this.sql = new SQLCase3();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByWallet(this.wallet);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.flavor){
      /*
       * flavor map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByFlavor(this.flavor);
      }else{
        this.sql = new SQLCase3();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByFlavor(this.flavor);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.token){
      /*
       * Token map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByToken(this.token);
      }else{
        this.sql = new SQLCase3();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByToken(this.token);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.mapName){
      /*
       * org map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.addFilterByMapName(this.mapName);
        this.sql.setBounds(this.bounds);
      } else if ([12, 13, 14, 15].includes(this.zoomLevel) && this.mapName != 'freetown') {
        this.sql = new SQLCase3();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByMapName(this.mapName);
        this.sql.setBounds(this.bounds);
      }else{
        this.sql = new SQLCase1();
        this.sql.addMapNameFilter(this.mapName);
        this.sql.setBounds(this.bounds);
        this.sql.setZoomLevel(this.zoomLevel);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
        this.sqlZoomTarget.addMapNameFilter(this.mapName);
      }

    }else if(this.timeline){
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Timeline();
        this.sql.addTimeline(this.timeline);
        this.sql.setBounds(this.bounds);
      } else if ([12, 13, 14, 15].includes(this.zoomLevel) ) {
        this.sql = new SQLCase3Timeline();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.setBounds(this.bounds);
        this.sql.addTimeline(this.timeline);
      }else{
        this.sql = new SQLCase1Timeline();
        this.sql.addTimeline(this.timeline);
        this.sql.setBounds(this.bounds);
        this.sql.setZoomLevel(this.zoomLevel);
      }
    }else{
      /*
       * Normal map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.setBounds(this.bounds);
      } else if ([12, 13, 14, 15].includes(this.zoomLevel)) {
        this.sql = new SQLCase4();
        this.sql.setBounds(this.bounds)
      }else{
        this.sql = new SQLCase1();
        this.sql.setBounds(this.bounds)
        this.sql.setZoomLevel(this.zoomLevel);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }
    }
    return;
  }

  async getQuery(){
    return this.sql.getQuery();
  }

  async getZoomTargetQuery(){
    if(this.sqlZoomTarget){
      return this.sqlZoomTarget.getQuery();
    }else{
      return undefined;
    }
  }

  async getPoints(){
    const query = await this.getQuery();
    console.log(query);
    const beginTime = Date.now();
    const data = await this.pool.query(query);
    console.log("get points took time:%d ms", Date.now() - beginTime);
    log.warn("get point:", data.rows.length);
    console.log(data.rows.slice(0,2))
    return data.rows;
  }

  async getZoomTargets(){
    const zoomTargetsQuery = await this.getZoomTargetQuery();
    let zoomTargets;
    if(zoomTargetsQuery){
      const beginTime = Date.now();
      const result = await this.pool.query(zoomTargetsQuery);
      console.log("get zoom target took time:%d ms", Date.now() - beginTime);
      console.log('got zoom targets data');
      zoomTargets = result.rows;
    }
    return zoomTargets;
  }
  
}

module.exports = Map;
