const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "production",
  entry: "./index.js",
  target: "node",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};
