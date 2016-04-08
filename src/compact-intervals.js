var limitComparator = require('./limit-comparator.js')
var intervalComparator = require('./interval-comparator.js')

function compactIntervals (intervals) {
  var arr = intervals
    .filter(function (interval) {
      return limitComparator(interval[0], interval[1]) <= 0
    })
    .sort(intervalComparator)

  if (arr.length === 0) {
    return []
  }

  var count = 0
  var current = arr[count]
  var result = [current]

  for (var i = 1; i < arr.length; ++i) {
    var currentEnd = current[1]
    var itemStart = arr[i][0]
    var diff = limitComparator(currentEnd, itemStart)
    if (diff < 0 && (currentEnd.value !== itemStart.value || diff === -2)) {
      result.push([arr[i][0], arr[i][1]])
      ++count
      current = result[count]
    } else if (limitComparator(currentEnd, arr[i][1]) < 0) {
      result[count][1] = arr[i][1]
    }
  }

  return result
}

module.exports = compactIntervals