var parseInterval = require('./parsers/interval.js')

var limitComparator = require('./utils/limit-comparator.js')
var intervalComparator = require('./utils/interval-comparator')
var create = require('./utils/interval-create.js')
var isEmpty = require('./utils/interval-is-empty.js')

function Interval (e) {
  var interval
  if (e instanceof Interval) {
    interval = copyInterval(e.interval)
  } else if (typeof e === 'string') {
    interval = parseInterval(e)
  }
  Object.defineProperty(this, 'interval', {
    value: interval
  })
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
  var result = [arr[count]]

  for (var i = 1; i < arr.length; ++i) {
    var currentEnd = current[1]
    var item = arr[i]
    var rawItem = item.interval
    var itemStart = rawItem[0]
    var diff = currentEnd.value - itemStart.value
    if (diff < 0 || diff === 0 && currentEnd.limit - itemStart.limit === -2) {
      result.push(new Interval(item))
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
  var b
  if (typeof e === 'string') {
    e = new Interval(parseInterval(e))
  }
  if (e instanceof Interval) {
    if (e.isEmpty()) {
      return true
    }
    b = e.interval
  } else {
    b = create('[', e, e, ']')
  }

  return limitComparator(b[0], a[0]) >= 0 &&
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

module.exports = Interval
