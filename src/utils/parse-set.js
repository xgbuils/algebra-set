var parseInterval = require('./parse-interval.js')
var parseIsolatedIntervals = require('./parse-isolated-intervals.js')
var Interval = require('../interval.js')

function parseSet (str) {
  var intervals = []
  str.split('U').map(function (e) {
    return e.trim()
  }).forEach(function (interval) {
    if (interval[0] === '{') {
      intervals.push.apply(intervals, parseIsolatedIntervals(interval))
    } else if (['(', '['].indexOf(interval[0]) !== -1) {
      intervals.push(Interval.create.apply(null, parseInterval(interval)))
    }
  })
  return intervals
}

module.exports = parseSet
