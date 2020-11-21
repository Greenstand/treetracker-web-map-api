const Map = require("./Map");
const SQLCase2Capture = require("./sqls/SQLCase2Capture");
const SQLCase1Capture = require("./sqls/SQLCase1Capture");
const SQLCase3Capture = require("./sqls/SQLCase3Capture");
const SQLCase4Capture = require("./sqls/SQLCase4Capture");
const SQLZoomTargetCase1V2Capture = require("./sqls/SQLZoomTargetCase1V2Capture");

class MapCapture extends Map{

  async init(settings){
    console.debug("init capture map with settings:", settings);
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
      this.sql = new SQLCase2Capture();
      this.sql.addTreeFilter(this.treeid);

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
        this.sql = new SQLCase2Capture();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByUserId(this.userid);
      }else{
        if(treeCount > 2000){
          this.sql = new SQLCase1Capture();
          this.sql.addFilterByUserId(this.userid);
          this.sql.setZoomLevel(this.zoomLevel);
          this.sql.setBounds(this.bounds);
        }else{
          this.sql = new SQLCase3Capture();
          this.sql.setClusterRadius(this.clusterRadius);
          this.sql.addFilterByUserid(this.userid);
          this.sql.setBounds(this.bounds);
        }
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.wallet){
      /*
       * wallet map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Capture();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByWallet(this.wallet);
      }else{
        this.sql = new SQLCase3Capture();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByWallet(this.wallet);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.flavor){
      /*
       * flavor map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Capture();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByFlavor(this.flavor);
      }else{
        this.sql = new SQLCase3Capture();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByFlavor(this.flavor);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.token){
      /*
       * Token map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Capture();
        this.sql.setBounds(this.bounds);
        this.sql.addFilterByToken(this.token);
      }else{
        this.sql = new SQLCase3Capture();
        this.sql.setClusterRadius(this.clusterRadius);
        this.sql.addFilterByToken(this.token);
        this.sql.setBounds(this.bounds);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }

    }else if(this.mapName){
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Capture();
        this.sql.addFilterByMapName(this.mapName);
        this.sql.setBounds(this.bounds);
      }else{
        this.sql = new SQLCase1Capture();
        this.sql.addMapNameFilter(this.mapName);
        this.sql.setBounds(this.bounds);
        this.sql.setZoomLevel(this.zoomLevel);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
        this.sqlZoomTarget.addMapNameFilter(this.mapName);
      }

    }else{
      /*
       * Normal map mode
       */
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2Capture();
        this.sql.setBounds(this.bounds);
      } else if ([12, 13, 14, 15].includes(this.zoomLevel)) {
        this.sql = new SQLCase4Capture();
        this.sql.setBounds(this.bounds)
      }else{
        this.sql = new SQLCase1Capture();
        this.sql.setBounds(this.bounds)
        this.sql.setZoomLevel(this.zoomLevel);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLZoomTargetCase1V2Capture();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }
    }
    return;
  }
}

module.exports = MapCapture;
