const log = require("loglevel");
const { Pool} = require('pg');
const SQLCase2 = require("./sqls/SQLCase2");
const SQLCase1 = require("./sqls/SQLCase1");
const SQLCase3 = require("./sqls/SQLCase3");
const SQLCase4 = require("./sqls/SQLCase4");
const SQLZoomTargetCase1V2 = require("./sqls/SQLZoomTargetCase1V2");


class Map{
  constructor(){
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async init(settings){
    log.debug("init map with settings:", settings);
    this.settings = settings
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
    log.log(query);
    const beginTime = Date.now();
    const data = await this.pool.query(query);
    const timeConsuming = Date.now() - beginTime;
    log.log("get points took time:%d ms, settings: %o", timeConsuming, this.settings);
    log.log("json-log:", JSON.stringify({
      name: "getPoints",
      settings: this.settings,
      query,
      timeConsuming,
    }));
    log.log(data.rows.slice(0,2))
    return data.rows;
  }

  async getZoomTargets(){
    const zoomTargetsQuery = await this.getZoomTargetQuery();
    let zoomTargets;
    if(zoomTargetsQuery){
      const beginTime = Date.now();
      const result = await this.pool.query(zoomTargetsQuery);
      const timeConsuming = Date.now() - beginTime;
      log.log("get zoom target took time:%d ms, settings: %o", timeConsuming, this.settings);
      log.log("json-log:", JSON.stringify({
        name: "getZoomTargets",
        query: zoomTargetsQuery,
        settings: this.settings,
        timeConsuming,
      }));
      zoomTargets = result.rows;
    }
    return zoomTargets;
  }
  
}

module.exports = Map;
