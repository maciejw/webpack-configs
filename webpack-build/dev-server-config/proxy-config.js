'use strict';

/** @type {import('webpack-dev-server').Configuration['proxy']} */
const proxyConfig = {
  '/api': {
    target: 'https://api.github.com/',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
};

module.exports = proxyConfig;
