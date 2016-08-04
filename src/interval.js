var parseInterval = require('./parsers/interval.js')

var limitComparator = require('./utils/limit-comparator.js')
var intervalComparator = require('./utils/interval-comparator')
var create = require('./utils/raw-interval-create.js')
var isEmpty = require('./utils/interval-is-empty.js')
var typeVerify = require('type-verify')

function Interval (e) {
  if (typeof e === 'string') {
    this.interval = parseInterval(e)
  } else if (e instanceof Interval) {
    this.interval = e.interval
  }
}

Interval.create = function (rawInterval) {
  var args = [].slice.call(arguments)
  return Object.create(Interval.prototype, {
    interval: {
      value: typeof rawInterval !== 'string' ? rawInterval : create.apply(null, args)
    }
  })
}

Interval.union = function () {
  var intervals = [].slice.call(arguments)
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
  var result = [copyInterval(arr[count])]

  for (var i = 1; i < arr.length; ++i) {
    var currentEnd = current[1]
    var item = arr[i]
    var rawItem = item.interval
    var itemStart = rawItem[0]
    var diff = currentEnd.value - itemStart.value
    if (diff < 0 || diff === 0 && currentEnd.limit - itemStart.limit === -2) {
      result.push(copyInterval(item))
      ++count
      current = result[count].interval
    } else if (limitComparator(currentEnd, rawItem[1]) < 0) {
      result[count].interval[1] = rawItem[1]
    }
  }

  return result
}

Interval.prototype.cartesian = function (e) {
  var interval
  if (e instanceof Interval) {
    interval = e
  } else if (typeof e === 'string') {
    interval = new Interval(e)
  }
  return [this, interval]
}

Interval.prototype.isEmpty = function () {
  return isEmpty(this.interval)
}

Interval.prototype.contains = function (e) {
  var a = this.interval
  var interval
  if (typeVerify(e, ['Number'])) {
    interval = Interval.create('[', e, e, ']')
  } else {
    interval = new Interval(e)
  }
  var b = interval.interval

  return interval.isEmpty() || limitComparator(b[0], a[0]) >= 0 &&
    limitComparator(b[1], a[1]) <= 0
}

function copyInterval (interval) {
  return Interval.create(interval.interval.map(function (e) {
    return {
      value: e.value,
      limit: e.limit
    }
  }))
}

module.exports = Interval
