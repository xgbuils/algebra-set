var compactIntervals = require('./compact-intervals.js')
var parseSet = require('./parse-set.js')
var limitComparator = require('./limit-comparator.js')

function Set (e) {
  var type = typeof e
  var isObject = e && type === 'object'
  this.equality = equality

  if (type === 'string') {
    this.intervals = compactIntervals(parseSet(e))
  } else if (isObject && typeof e.contains === 'function') {
    this.fn = e.contains
  }

  if (isObject && typeof e.equality === 'function') {
    this.equality = e.equality
  }

  this.intervals = this.intervals || []
}

function equality (a, b) {
  return a === b
}

Set.prototype.contains = function (e) {
  if (typeof e === 'string') {
    e = new Set(e)
  }
  if (e instanceof Set) {
    var intervals = this.intervals
    if (!isCalculableSet(this) || !isCalculableSet(e)) {
      return null
    }
    return e.intervals.every(function (eInterval) {
      return intervals.some(function (interval) {
        return limitComparator(interval[0], eInterval[0]) <= 0 &&
          limitComparator(interval[1], eInterval[1]) >= 0
      })
    })
  } else if (typeof this.fn === 'function') {
    return this.fn.call(null, e)
  } else {
    return this.intervals.some(function (interval) {
      return inInterval(e, interval)
    })
  }
}

function isCalculableSet (set) {
  return typeof set.fn !== 'function'
}

function inInterval (num, interval) {
  var exactNum = {
    value: num,
    limit: 0
  }
  return limitComparator(exactNum, interval[0]) >= 0 &&
    limitComparator(exactNum, interval[1]) <= 0
}

module.exports = Set