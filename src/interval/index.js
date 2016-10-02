var typeVerify = require('type-verify')
var toIntervalFactory = require('../type-casting/to-interval/')
var IntervalFactory = require('./factory.js')
var rawInterval = require('./raw-interval.js')
var intervalUtils = require('math.interval-utils')
var isEmpty = intervalUtils.isEmpty
var contains = intervalUtils.contains
var numToInterval = intervalUtils.numToInterval
var union = intervalUtils.union

function Interval (e) {
  var result = toIntervalFactory(Interval)(e)
  if (result === e) {
    throw new Error(e + ' is not castable to Interval')
  }
  this.interval = result
}

Interval.union = function () {
  var arr = [].map.call(arguments, function (interval) {
    var result = toIntervalFactory(Interval)(interval)
    if (result === interval) {
      throw new Error(interval + ' is not castable to Interval')
    }
    return result
  })

  return union(arr).map(IntervalFactory(Interval))
}

Object.defineProperties(Interval.prototype, {
  isEmpty: {
    value: function () {
      return isEmpty(rawInterval(this))
    }
  },

  contains: {
    value: function (e) {
      var a = rawInterval(this)
      var b = typeVerify(e, ['Number']) ? numToInterval(e) : toIntervalFactory(Interval)(e)
      if (b === e) {
        throw new Error(e + ' is not castable to Interval o Number')
      }

      return contains(a, b)
    }
  },

  union: {
    value: function () {
      var intervals = [this]
      intervals.push.apply(intervals, arguments)
      return Interval.union.apply(null, intervals)
    }
  }
})

module.exports = Interval
