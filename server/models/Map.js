const { Pool} = require('pg');
const config = require('../config/config');
const SQLCase2 = require("./sqls/SQLCase2");
const SQLCase1 = require("./sqls/SQLCase1");
const SQLCase3 = require("./sqls/SQLCase3");
const SQLCase4 = require("./sqls/SQLCase4");
const SQLCase6 = require("./sqls/SQLCase6");


class Map{
  constructor(){
    this.pool = new Pool({ connectionString: config.connectionString });
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
    this.treeIds = [];
    if(this.treeid){
      /*
       * Single tree map mode
       */
      this.sql = new SQLCase2();
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
        this.sqlZoomTarget = new SQLCase6();
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
        this.sqlZoomTarget = new SQLCase6();
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
        this.sqlZoomTarget = new SQLCase6();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
      }
    }else if(this.mapName){
      /*
       * Organization map mode
       */
      this.treeIds = await this.getTreesUnderOrg(this.mapName);
      
      /*
       * If no trees in this org, then build a case that filter out all trees!
       */
      if(this.treeIds.length === 0){
        this.treeIds = [-1]; //this is impossible to match a tree which id is -1
      }
      if(this.zoomLevel > 15){
        this.sql = new SQLCase2();
        this.sql.addTreesFilter(this.treeIds);
        this.sql.setBounds(this.bounds);
      }else{
        this.sql = new SQLCase1();
        this.sql.addTreesFilter(this.treeIds);
        this.sql.setBounds(this.bounds);
        this.sql.setZoomLevel(this.zoomLevel);
      }
      if(this.zoomLevel <= 9){
        this.sqlZoomTarget = new SQLCase6();
        this.sqlZoomTarget.setBounds(this.bounds);
        this.sqlZoomTarget.setZoomLevel(this.zoomLevel);
        this.sqlZoomTarget.setTreeIds(this.treeIds);
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
        this.sqlZoomTarget = new SQLCase6();
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
    const data = await this.pool.query(query);
    console.log(data.rows.slice(0,2))
    return data.rows;
  }

  async getZoomTargets(){
    const zoomTargetsQuery = await this.getZoomTargetQuery();
    let zoomTargets;
    if(zoomTargetsQuery){
      const result = await this.pool.query(zoomTargetsQuery);
      console.log('got zoom targets data');
      zoomTargets = result.rows;
    }
    return zoomTargets;
  }
  
  async getTreesUnderOrg(mapName){
    console.log("try to get the trees in organization");
    const sql = 
      `
        select id from trees where 
        planter_id in (
          select id from planter where organization_id in (select entity_id from getEntityRelationshipChildren(
            (select id from entity where map_name = '${mapName}')
          ))
        )
        or 
        trees.planting_organization_id  in (
        select entity_id from getEntityRelationshipChildren(
            (select id from entity where map_name = '${mapName}')
        )
        )
        `;
    const query = {
      text: sql,
      values: []
    };
    const r = await this.pool.query(query);
    console.log("trees:", r.rows.length);
    let treeIds = [];
    r.rows.forEach(e => treeIds.push(e.id) );
    return treeIds;
  }
}

module.exports = Map;
