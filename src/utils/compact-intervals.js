var limitComparator = require('./limit-comparator.js')
var intervalComparator = require('./interval-comparator.js')
var Interval = require('../interval.js')

function compactIntervals (intervals) {
  var arr = intervals
    .filter(function (interval) {
      return !interval.isEmpty()
    })
    .sort(intervalComparator)

  if (arr.length === 0) {
    return []
  }

  var count = 0
  var current = arr[count].interval
  var result = [arr[count]]

  for (var i = 1; i < arr.length; ++i) {
    var currentEnd = current[1]
    var item = arr[i]
    var rawItem = item.interval
    var itemStart = rawItem[0]
    var diff = limitComparator(currentEnd, itemStart)
    if (diff < 0 && (currentEnd.value !== itemStart.value || diff === -2)) {
      result.push(new Interval(item))
      ++count
      current = result[count].interval
    } else if (limitComparator(currentEnd, rawItem[1]) < 0) {
      result[count].interval[1] = rawItem[1]
    }
  }

  return result
}

module.exports = compactIntervals
