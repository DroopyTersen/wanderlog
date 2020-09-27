const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require("webpack");
let config = require("./webpack.config");
config.mode = "development";
config.devtool = "inline-source-map";

config.devServer = {
  contentBase: "./dist",
  historyApiFallback: true,
};
config.module.rules[0].use = [
  {
    loader: 'babel-loader',
    options: { plugins: ['react-refresh/babel'] },
  },
  "ts-loader"
]
// Remove bundle analyzer from DEV
config.plugins = [
  new ReactRefreshWebpackPlugin(),
];
console.log("WEBPACK!")
console.log(JSON.stringify(config, null, 2))
module.exports = config;
