'use strict';
//@ts-check

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');

const loaderUtils = require('loader-utils');

const { shouldUseSourceMap, isProduction } = require('../shared');

/**
 * @typedef {Object} CssOptions
 * @property {boolean=} url Enable/Disable url() handling, default true
 * @property {boolean=} import Enable/Disable import handling, default true
 * @property {boolean=} modules Enable/Disable CSS Modules, default false
 * @property {string=} localIdentName	Configure the generated ident, default [hash:base64]
 * @property {boolean=} sourceMap 	Enable/Disable Sourcemaps, default false
 * @property {boolean|'dashes'|'only'|'dashesOnly'=} camelCase Export Classnames in CamelCase, default false
 * @property {number=}	importLoaders Number of loaders applied before CSS loader}} CssOptions, default 0
 *
 * @typedef {import('webpack').Loader} Loader
 * @typedef {import('webpack').RuleSetUse} RuleSetUse
 * @typedef {import('webpack').RuleSetUseItem} RuleSetUseItem
 *
 * @typedef {Object} getStyleLoadersParam
 * @property {CssOptions} cssOptions
 * @property {{}=} customProperties
 * @property {{}=} customMedia
 * @property {string=} preProcessor
 * @property {Loader} styleLoader
 * @property {boolean} shouldUseSourceMap
 *
 */

/** @param {getStyleLoadersParam} @returns {RuleSetUse}*/
function getStyleLoaders({ cssOptions, preProcessor, styleLoader, shouldUseSourceMap, customProperties, customMedia }) {
  /** @type {RuleSetUseItem[]} */
  const loaders = [
    {
      loader: styleLoader,
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-custom-properties')({
            customProperties,
          }),
          require('postcss-custom-media')({
            customMedia,
          }),
          require('postcss-import'),
          require('postcss-import'),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
    preProcessor && {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap,
      },
    },
  ];

  return loaders.filter(Boolean);
}

function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
  const fileNameOrFolder = context.resourcePath.match(/index\.(css)$/) ? '[folder]' : '[name]';

  const hash = loaderUtils.getHashDigest(context.resourcePath + localName, 'md5', 'base64', 5);

  const className = loaderUtils.interpolateName(context, fileNameOrFolder + '_' + localName + '__' + hash, options);

  return className;
}

const cssRegex = /\.global\.css$/;
const cssModuleRegex = /\.css$/;

/**@type {import('webpack').Configuration} */
const config = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: getStyleLoaders({
              cssOptions: {
                importLoaders: 1,
                sourceMap: shouldUseSourceMap,
              },
              shouldUseSourceMap,
              styleLoader: isProduction ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            loader: getStyleLoaders({
              cssOptions: {
                importLoaders: 1,
                sourceMap: shouldUseSourceMap,
                modules: true,
                camelCase: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              shouldUseSourceMap,
              styleLoader: isProduction ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            }),
          },
        ],
      },
    ],
  },
  plugins: [
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      isProduction &&
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
    ].filter(Boolean),
  },
};

module.exports = config;
