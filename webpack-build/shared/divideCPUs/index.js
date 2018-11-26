'use strict';
//@ts-check

const os = require('os');

const ALL_CPUs = os.cpus().length;

function round(ratio) {
  if (ratio < 1) return 1;
  if (ratio > ALL_CPUs - 1) return ALL_CPUs - 1;
  return Math.round(ratio);
}

function divideCPUs(tsLoaderCpuPercentage = 50) {
  const typeCheckerCpuPercentage = 100 - tsLoaderCpuPercentage;

  const tsLoaderCpu = (ALL_CPUs * tsLoaderCpuPercentage) / 100;
  const typeCheckerCpu = (ALL_CPUs * typeCheckerCpuPercentage) / 100;
  return {
    TS_LOADER_CPU: round(tsLoaderCpu),
    TYPE_CHECKER_CPU: round(typeCheckerCpu),
  };
}

module.exports = { divideCPUs };
