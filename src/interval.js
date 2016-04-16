var limitComparator = require('./utils/limit-comparator.js')
var parseInterval = require('./utils/parse-interval.js')

function Interval (e) {
  var interval
  if (e instanceof Interval) {
    interval = copyInterval(e.interval)
  } else if (typeof e === 'string') {
    interval = create.apply(null, parseInterval(e))
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
  var interval = this.interval
  return limitComparator(interval[0], interval[1]) > 0
}

Interval.prototype.contains = function (num) {
  var interval = this.interval
  var exactNum = {
    value: num,
    limit: 0
  }
  return limitComparator(exactNum, interval[0]) >= 0 &&
    limitComparator(exactNum, interval[1]) <= 0
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

function copyInterval (interval) {
  return interval.map(function (e) {
    return {
      value: e.value,
      limit: e.limit
    }
  })
}

module.exports = Interval
