'use strict';
//@ts-check

const getClientEnvironment = require('../../config/env');
const paths = require('../../config/paths');
const { divideCPUs } = require('./divideCPUs');

const publicPath = paths.servedPath;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const { TS_LOADER_CPU, TYPE_CHECKER_CPU } = divideCPUs();

const isProduction = env.stringified['process.env'].NODE_ENV === '"production"';
const isDevelopment = env.stringified['process.env'].NODE_ENV === '"development"';

const { mergeWithOneOf } = require('./mergeWithOneOf');

const analyzeBundle = process.argv.find(arg => arg.includes('--analyze'));

module.exports = {
  shouldUseSourceMap,
  shouldInlineRuntimeChunk,
  TS_LOADER_CPU,
  TYPE_CHECKER_CPU,
  isProduction,
  isDevelopment,
  analyzeBundle,
  env,
  publicPath,
  mergeWithOneOf,
};
