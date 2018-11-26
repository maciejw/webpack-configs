const merge = require('webpack-merge');
const { zipWith } = require('lodash');

const mergeWithOneOf = merge({
  /**@type {(a: [], b: [], key: string) => unknown} */
  customizeArray: function(a, b, key) {
    if (key === 'module.rules') {
      const result = zipWith(a, b, merge);
      return result;
    }
  },
});

module.exports = { mergeWithOneOf };
