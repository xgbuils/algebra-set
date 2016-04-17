var limitComparator = require('./utils/limit-comparator.js')
var parseInterval = require('./utils/parse-interval.js')
var intervalComparator = require('./utils/interval-comparator')

function Interval (e) {
  var interval
  if (e instanceof Interval) {
    interval = copyInterval(e.interval)
  } else if (typeof e === 'string') {
    interval = normalizeIfEmpty(create.apply(null, parseInterval(e)))
  }
  Object.defineProperty(this, 'interval', {
    value: interval
  })
}

Interval.create = function () {
  return Object.create(Interval.prototype, {
    interval: {
      value: create.apply(null, arguments)
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
  if (typeof e === 'number') {
    b = create('[', e, e, ']')
  } else if (e instanceof Interval) {
    if (e.isEmpty()) {
      return true
    }
    b = e.interval
  } else {
    throw new Error(e + ' is not interval')
  }

  return limitComparator(b[0], a[0]) >= 0 &&
    limitComparator(b[1], a[1]) <= 0
}

var map = {
  '(': 1,
  '[': 0,
  ']': 0,
  ')': -1
}

function create (left, a, b, right) {
  return [{
    value: a,
    limit: map[left]
  }, {
    value: b,
    limit: map[right]
  }]
}

function isEmpty (interval) {
  return limitComparator(interval[0], interval[1]) > 0
}

function normalizeIfEmpty (interval) {
  if (isEmpty(interval)) {
    interval[1] = {
      value: interval[0].value,
      limit: -1
    }
  }
  return interval
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
