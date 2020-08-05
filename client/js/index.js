const logo = require("./logo");
const MapModel = require("./MapModel");
const mapTools = require("./mapTools");

//declare it globally in the browser
window.logo = logo;
window.MapModel = MapModel;
window.mapTools = mapTools;

console.log("bundle loaded");

module.exports = logo;
