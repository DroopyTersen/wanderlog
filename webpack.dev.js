let config = require("./webpack.config");

config.mode = "development";
config.devtool = "inline-source-map";
config.devServer = {
  contentBase: "./dist",
  historyApiFallback: true,
};
module.exports = config;
