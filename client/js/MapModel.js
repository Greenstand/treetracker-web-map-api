/*
 * The module to handle greenstand map
 */
const axios = require("axios");
const chai = require("chai");

class MapModel {
  constructor(){
    this._markers = [];
    this._map = undefined;
  }

  set markers(mks){
    this._markers = mks;
  }

  get markers(){
    return this._markers;
  }

  set map(map){
    this._map = map;
  }

  get map(){
    return this._map;
  }

  /*
   * To check if need display arrow
   */
  async checkArrow(){
    if(this._markers.length === 0){
      //no markers, need to find nearest
      const res = await axios.get(`/api/web/nearest?zoom_level=`);
      if(res.status !== 200){
        throw Error("request failed");
      }
      const {nearest} = res.data;
      if(nearest){
        //find it
        //get nearest markers
        const center = this._map.getCenter();
        console.log("current center:", center.toJSON());
        chai.assert.isNumber(nearest.coordinate.lat);
        chai.assert.isNumber(nearest.coordinate.lng);
        if(!this._map.getBounds().contains({
          lat: nearest.coordinate.lat,
          lng: nearest.coordinate.lng,
        })){
          console.log("out of bounds, display arrow");
          const dist = {
            lat: nearest.coordinate.lat,
            lng: nearest.coordinate.lng,
          };
          const distanceLat = google.maps.geometry.spherical.computeDistanceBetween(
            center,
            new google.maps.LatLng(
              dist.lat,
              center.lng()
              ),
          );
          console.log("distanceLat:", distanceLat);
          chai.expect(distanceLat).a("number");
          const distanceLng = google.maps.geometry.spherical.computeDistanceBetween(
            center,
            new google.maps.LatLng(
              center.lat(),
              dist.lng,
              ),
          );
          console.log("distanceLng:", distanceLng);
          chai.expect(distanceLng).a("number");
          console.log("dist:", dist);
          console.log("center:", center, center.lat());
          if(dist.lat > center.lat()){
            console.log("On the north");
            if(distanceLat > distanceLng){
              console.log("On the north");
              this.showArrow("north");
            }else{
              if(dist.lng > center.lng()){
                console.log("On the east");
                this.showArrow("east");
              }else{
                console.log("On the west");
                this.showArrow("west");
              }
            }
          }else{
            console.log("On the south");
            if(distanceLat > distanceLng){
              console.log("On the south");
              this.showArrow("south");
            }else{
              if(dist.lng > center.lng()){
                console.log("On the east");
                this.showArrow("east");
              }else{
                console.log("On the west");
                this.showArrow("west");
              }
            }
          }

        }else{
          this.hideArrow();
        }
      }
    }
  }

  /*
   * To show/hide the arrow icon on the map
   */
  hideArrow(){
    const arrow = $("#arrow");
    arrow.hide();
  }

  showArrow(direction){
    const arrow = $("#arrow");
    chai.expect(direction).oneOf(["north", "south", "west", "east"]);
    if(direction === "north"){
      arrow.addClass("north");
      arrow.removeClass("south");
      arrow.removeClass("west");
      arrow.removeClass("east");
      arrow.css("top", "0");
      arrow.css("left", "50%");
      arrow.css("right", "unset");
      arrow.css("bottom", "unset");
    }else if(direction === "south"){
      arrow.addClass("south");
      arrow.removeClass("north");
      arrow.removeClass("west");
      arrow.removeClass("east");
      arrow.css("top", "unset");
      arrow.css("left", "50%");
      arrow.css("right", "unset");
      arrow.css("bottom", "0");
    }else if(direction === "west"){
      arrow.addClass("west");
      arrow.removeClass("south");
      arrow.removeClass("north");
      arrow.removeClass("east");
      arrow.css("top", "50%");
      arrow.css("left", "0");
      arrow.css("right", "unset");
      arrow.css("bottom", "unset");
    }else if(direction === "east"){
      arrow.addClass("east");
      arrow.removeClass("south");
      arrow.removeClass("west");
      arrow.removeClass("north");
      arrow.css("top", "50%");
      arrow.css("left", "unset");
      arrow.css("right", "0");
      arrow.css("bottom", "unset");
    }
    arrow.show();
  }
}

module.exports = MapModel;
