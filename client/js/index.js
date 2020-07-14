const logo = require("./logo");
const MapModel = require("./MapModel");

//declare it globally in the browser
window.logo = logo;
window.MapModel = MapModel;

console.log("bundle loaded");

module.exports = logo;
