var typeVerify = require('type-verify')
var toIntervalFactory = require('../type-casting/to-interval/')
var IntervalFactory = require('./factory.js')
var limitComparator = require('./limit-comparator.js')
var intervalComparator = require('./interval-comparator')
var create = require('./raw-interval-create.js')

function Interval (e) {
  var result = toIntervalFactory(Interval)(e)
  if (result === e) {
    throw new Error(e + ' is not castable to Interval')
  }
  this.interval = result
}

Interval.union = function () {
  var intervals = [].slice.call(arguments)
  var arr = intervals
    .map(function (interval) {
      var result = toIntervalFactory(Interval)(interval)
      if (result === interval) {
        throw new Error(interval + ' is not castable to Interval')
      }
      return result
    })
    .filter(function (interval) {
      return !isEmpty(interval)
    })
    .sort(intervalComparator)

  if (arr.length === 0) {
    return []
  }

  var count = 0
  var current = arr[count]
  var result = [copyInterval(arr[count])]

  for (var i = 1; i < arr.length; ++i) {
    var currentEnd = current[1]
    var item = arr[i]
    var rawItem = item
    var itemStart = rawItem[0]
    var diff = currentEnd.value - itemStart.value
    if (diff < 0 || diff === 0 && currentEnd.limit - itemStart.limit === -2) {
      result.push(copyInterval(item))
      ++count
      current = result[count]
    } else if (limitComparator(currentEnd, rawItem[1]) < 0) {
      result[count][1] = rawItem[1]
    }
  }

  return result.map(IntervalFactory(Interval))
}

Interval.prototype.isEmpty = function () {
  return isEmpty(this.interval)
}

Interval.prototype.contains = function (e) {
  var a = this.interval
  var b = typeVerify(e, ['Number']) ? create('[', e, e, ']') : toIntervalFactory(Interval)(e)
  if (b === e) {
    throw new Error(e + ' is not castable to Interval o Number')
  }

  return isEmpty(b) || limitComparator(b[0], a[0]) >= 0 &&
    limitComparator(b[1], a[1]) <= 0
}

function copyInterval (interval) {
  return interval.map(function (e) {
    return {
      value: e.value,
      limit: e.limit
    }
  })
}

function isEmpty (interval) {
  return limitComparator(interval[0], interval[1]) > 0
}

module.exports = Interval
