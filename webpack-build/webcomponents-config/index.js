'use strict';
//@ts-check

const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';
const { TS_LOADER_CPU, isProduction } = require('../shared');
const paths = require('../../config/paths');

/**@type {import('webpack').Configuration} */
const config = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer)\/).*/,
            use: [
              { loader: require.resolve('cache-loader') },
              {
                loader: require.resolve('thread-loader'),
                options: {
                  workers: TS_LOADER_CPU,
                },
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  happyPackMode: true,
                  experimentalWatchApi: isProduction ? false : true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
        to: path.join(paths.appBuild, 'static/js/vendor'),
        flatten: true,
      },
      {
        from: path.resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
        to: path.join(paths.appBuild, 'static/js/vendor/bundles'),
        flatten: true,
      },
      {
        from: path.resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
        to: path.join(paths.appBuild, 'static/js/vendor'),
        flatten: true,
      },
    ]),
  ],
};

module.exports = config;
