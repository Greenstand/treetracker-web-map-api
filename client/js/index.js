const logo = require("./logo");

//declare it globally in the browser
window.logo = logo;

console.log("bundle loaded");

module.exports = logo;
