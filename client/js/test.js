/*
 * NOTE this shouldn't be deploy to production, we will try to move it from
 * this dir away in the future
 */
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} = require("http-proxy-middleware");

const app = express();
const config = require("../webpack.config.js");
const compiler = webpack(config);

const dir = path.join(__dirname, "../");
console.log("dir:", dir);
app.use(express.static(dir));

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
//app.use(
//  webpackDevMiddleware(compiler, {
//    publicPath: config.output.publicPath,
//  })
//);

//proxy the api
app.use(
  "/api/web",
  createProxyMiddleware({
    target: "http://localhost:3000",
    logLevel: "debug",
    changeOrigin: true,
    pathRewrite: {
      "^/api/web": "",
    },
  })
);

// Serve the files on port 3000.
app.listen(3001, function () {
  console.log("Example app listening on port 3001!\n");
});
