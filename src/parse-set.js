var parseInterval = require('./parse-interval.js')
var isolatedIntervalsCreator = require('./parse-isolated-intervals.js')

function parseSet (str) {
  var intervals = []
  str.split('U').map(function (e) {
    return e.trim()
  }).forEach(function (interval) {
    if (interval[0] === '{') {
      intervals.push.apply(intervals, isolatedIntervalsCreator(interval))
    } else if (['(', '['].indexOf(interval[0]) !== -1) {
      intervals.push(parseInterval(interval))
    }
  })
  return intervals
}

module.exports = parseSet