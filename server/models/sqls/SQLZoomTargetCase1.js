/*
 * Case6, to search cluster for next zoom target
 */

class SQLZoomTargetCase1{

  constructor(){
  }

  setTreeIds(treeIds){
    this.treeIds = treeIds;
  }


  getFilter(){
    let result = "";
    if(this.treeIds && this.treeIds.length > 0){
      result += "AND active_tree_region.tree_id IN(" + this.treeIds.join(",") + ") ";
    }
    return result;
  }

  setZoomLevel(zoomLevel){
    this.zoomLevel = zoomLevel;
  }

  getZoomLevel(){
    if(!this.zoomLevel){
      throw new Error("zoom level required");
    }
    return this.zoomLevel;
  }

  setBounds(bounds){
    this.bounds = bounds;
  }

  getBoundingBoxQuery(){
    let result = "";
    if (this.bounds) {
      result += ' AND region.centroid && ST_MakeEnvelope(' + this.bounds + ', 4326) ';
    }
    return result;
  }

  addTreesFilter(treeIds){
    this.treeIds = treeIds;
  }

  getQuery(){
    const query = {
      text: `
              /* case6 zoom target */
              SELECT DISTINCT ON (region.id)
                region.id region_id,
                contained.region_id most_populated_subregion_id,
                contained.total,
                contained.zoom_level,
                ST_ASGeoJson(contained.centroid) centroid
                FROM
                 (
                  SELECT region_id, zoom_level
                  FROM active_tree_region
                  WHERE zoom_level = $1
                  ${this.getFilter()}
                  GROUP BY region_id, zoom_level
                 ) populated_region
                JOIN region
                ON region.id = populated_region.region_id
                JOIN (
                  SELECT region_id, zoom_level, count(active_tree_region.id) AS total, centroid
                  FROM active_tree_region
                  WHERE zoom_level = $2
                  ${this.getFilter()}
                  GROUP BY region_id, zoom_level, centroid
                ) contained
                ON ST_CONTAINS(region.geom, contained.centroid)
                WHERE true 
                ${this.getBoundingBoxQuery()}
                ORDER BY region.id, total DESC`,
      values: [this.getZoomLevel(), this.getZoomLevel() + 2]
    }
    return query;
  }
}

module.exports = SQLZoomTargetCase1;
