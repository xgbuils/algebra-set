var limitComparator = require('./limit-comparator.js')

module.exports = function (interval) {
  return limitComparator(interval[0], interval[1]) > 0
}
