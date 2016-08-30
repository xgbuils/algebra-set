var parseIsolatedIntervals = require('./isolated-intervals.js')
var Interval = require('../interval/')
var parseInterval = require('./interval.js')

function parseMultiInterval (str) {
  var intervals = []
  str.split('U').map(function (e) {
    return e.trim()
  }).forEach(function (interval) {
    if (interval[0] === '{') {
      intervals.push.apply(intervals, parseIsolatedIntervals(interval).map(Interval.create))
    } else if (['(', '['].indexOf(interval[0]) !== -1) {
      intervals.push(Interval.create(parseInterval(interval)))
    }
  })
  return intervals
}

module.exports = parseMultiInterval
