/*
 * Case3, to filter and count all stuff via trees table directly, it would be slow if the data set is huge
 */

class SQLCase3{

  constructor(){
    this.isFilteringByUserId = false;
    this.userId = undefined;
  }


  setClusterRadius(clusterRadius){
    this.clusterRadius = clusterRadius;
  }

  getClusterRadius(){
    parseFloat(this.clusterRadius)
    return this.clusterRadius;
  }

  addFilterByUserid(userid){
    this.userid = userid;
  }

  addFilterByWallet(wallet){
    this.wallet = wallet;
  }

  addFilterByFlavor(flavor){
    this.flavor = flavor;
  }

  addFilterByToken(token){
    this.token = token;
  }

  addFilterByMapName(mapName){
    this.mapName = mapName;
  }

  getFilter(){
    let result = "";
    if(this.userid){
      result += 'AND trees.planter_id = ' + this.userid + ' ';
    }
    if(this.wallet) {
      result += "AND wallet.wallet.name = '" + this.wallet + "'"
    }
    if(this.mapName){
      result += `
        AND trees.id IN(
          select distinct * from ( 
            SELECT trees.id as id from trees
              INNER JOIN (
                SELECT id FROM planter
                JOIN (
                  SELECT entity_id FROM getEntityRelationshipChildren(
                    (SELECT id FROM entity WHERE map_name = '${this.mapName}')
                  )
                ) org ON planter.organization_id = org.entity_id
              ) planter_ids
              ON trees.planter_id = planter_ids.id
          union all 
            SELECT trees.id as id from trees
              INNER JOIN (
                SELECT id FROM planter
                JOIN (
                  SELECT entity_id FROM getEntityRelationshipChildren(
                    (SELECT id FROM entity WHERE map_name = '${this.mapName}')
                  )
                ) org ON planter.organization_id = org.entity_id
              ) planter_ids
              ON trees.planter_id = planter_ids.id
          ) t1
        )
      `;
    }
    return result;
  }

  getJoin(){
    let result = "";
    if(this.wallet){
      result += 'INNER JOIN wallet.token ON wallet.token.capture_id::text = trees.uuid \n';
      result += 'INNER JOIN wallet.wallet ON wallet.wallet.id = wallet.token.wallet_id \n';
    }
    if(this.flavor){
      result += "INNER JOIN tree_attributes ON tree_attributes.tree_id = trees.id";
    }
    if(this.token){
      result += "INNER JOIN certificates ON trees.certificate_id = certificates.id AND certificates.token = '" + this.token + "'";
    }
    return result;
  }

  getJoinCriteria(){
    let result = "";
    if(this.flavor){
      result += "AND tree_attributes.key = 'app_flavor' AND tree_attributes.value = '" + this.flavor + "'";
    }
    return result;
  }

  setBounds(bounds){
    this.bounds = bounds;
  }

  getBoundingBoxQuery(){
    let result = "";
    if (this.bounds) {
      result += 'AND trees.estimated_geometric_location && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
    }
    return result;
  }

  getQuery(){
    console.log('Calculating clusters directly');
    const query = {
      text: `
        /* case3 */
        SELECT 'cluster'                                           AS type,
        St_asgeojson(St_centroid(clustered_locations))                 centroid,
        St_numgeometries(clustered_locations)                          count
        FROM   (
        SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
        FROM   trees 
        ${this.getJoin()}
        WHERE  active = true 
        ${this.getBoundingBoxQuery()} 
        ${this.getFilter()} 
        ${this.getJoinCriteria()}  
        ) clusters`,
      values: [this.getClusterRadius()]
    };
    return query;
  }
}

module.exports = SQLCase3;
