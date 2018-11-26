'use strict';
//@ts-check

const { isProduction } = require('../shared');

/**@type {import('webpack').Configuration} */
const config = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.(bmp|gif|jpe?g|png)$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: isProduction ? 'static/media/[name].[contenthash:8].[ext]' : 'static/media/[name].[ext]',
            },
          },
          {
            test: /\.svg$/,
            use: [{ loader: require.resolve('@svgr/webpack') }, { loader: require.resolve('url-loader') }],
          },
        ],
      },
    ],
  },
};
module.exports = config;
