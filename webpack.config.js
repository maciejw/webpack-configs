'use strict';
//@ts-check
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

const paths = require('./config/paths');
const { env, publicPath, mergeWithOneOf, isProduction } = require('./webpack-build/shared');

const stylesConfiguration = require('./webpack-build/styles-config');
const webComponentsConfiguration = require('./webpack-build/webcomponents-config');
const codeConfiguration = require('./webpack-build/code-config');
const mediaConfiguration = require('./webpack-build/media-config');
const devServerConfiguration = require('./webpack-build/dev-server-config');
const optimizationConfiguration = require('./webpack-build/optimization-config');

/** @type {import('webpack').Configuration} */
const baseConfig = {
  context: path.resolve(__dirname),
  mode: env.raw.NODE_ENV,
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  entry: [path.resolve('./src/index.tsx')],
  resolve: {
    modules: ['node_modules', ...process.env.NODE_PATH.split(path.delimiter).filter(Boolean)],
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    plugins: [PnpWebpackPlugin, new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: isProduction ? 'static/media/[name].[contenthash:8].[ext]' : 'static/media/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  output: {
    path: paths.appBuild,
    filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    chunkFilename: isProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
    publicPath,
    devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  plugins: [
    new CleanWebpackPlugin([paths.appBuild], { verbose: true }),
    new WebpackBar({ profile: false }),
    new ModuleNotFoundPlugin(paths.appPath),
  ].filter(Boolean),

  stats: 'minimal',
};

module.exports = mergeWithOneOf(
  devServerConfiguration,
  webComponentsConfiguration,
  codeConfiguration,
  stylesConfiguration,
  mediaConfiguration,
  optimizationConfiguration,
  baseConfig,
);
