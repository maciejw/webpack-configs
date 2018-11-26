'use strict';
//@ts-check

const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const { TS_LOADER_CPU, TYPE_CHECKER_CPU, isProduction } = require('../shared');
const paths = require('../../config/paths');

/**@type {import('webpack').Configuration} */
const config = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
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
              { loader: path.resolve(__dirname, './minify-lit-html-template') },
            ].filter(Boolean),
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsConfig,
      compilerOptions: {
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: false,
        noEmit: true,
        jsx: 'preserve',
      },
      workers: TYPE_CHECKER_CPU,
      reportFiles: [
        '**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!src/setupProxy.js',
        '!src/setupTests.*',
      ],
      watch: paths.appSrc,
      silent: true,
      tslint: true,
      formatter: typescriptFormatter,
    }),
  ],
};

module.exports = config;
