const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  devServer: (devServerConfig) => {
    devServerConfig.onBeforeSetupMiddleware = (devServer) => {
      devServer.app.use((req, res, next) => {
        if (req.url.endsWith(".wasm")) {
          res.setHeader("Content-Type", "application/wasm");
        }
        next();
      });
    };

    return devServerConfig;
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ];

      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        "process/browser": path.resolve(__dirname, "node_modules/process/browser.js"),
      };

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        process: require.resolve("process/browser"),
      };

      return webpackConfig;
    },
  },
};
