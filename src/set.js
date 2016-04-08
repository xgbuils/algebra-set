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
    this.equality = function (a, b) {
      return a === b
    }
  }

  this.intervals = this.intervals || []
}

function equality (a, b) {
  return a === b
}

Set.prototype.contains = function (a) {
  if (typeof this.fn === 'function') {
    return this.fn.call(null, a)
  } else {
    return this.intervals.some(function (interval) {
      return inInterval(a, interval)
    })
  }
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