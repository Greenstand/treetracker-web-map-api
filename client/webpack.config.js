const path = require("path");
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./js/index.js",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./",
  },
  plugins: [
    //    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    //    new HtmlWebpackPlugin({
    //      title: 'Output Management',
    //    }),
  ],
  output: {
    filename: "./js/bundle.js",
    path: path.resolve(__dirname, "."),
    publicPath: "/",
  },
};
