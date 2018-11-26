'use strict';
//@ts-check

const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const { isDevelopment } = require('../shared');
const paths = require('../../config/paths');

const proxyConfig = require('./proxy-config');

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    stats: 'minimal',
    proxy: proxyConfig,
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ].filter(Boolean),
  performance: {
    hints: false,
  },
  stats: 'minimal',
};

module.exports = isDevelopment ? config : {};
