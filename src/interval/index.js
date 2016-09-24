var typeVerify = require('type-verify')
var toIntervalFactory = require('../type-casting/to-interval/')
var IntervalFactory = require('./factory.js')
var limitComparator = require('./limit-comparator.js')
var rawInterval = require('./raw-interval.js')
var create = require('./raw-interval-create.js')
var union = require('./union.js')
var isEmpty = require('./is-empty.js')

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
    value: function (interval) {
      return isEmpty(rawInterval(interval))
    }
  },

  contains: {
    value: function (e) {
      var a = rawInterval(this)
      var b = typeVerify(e, ['Number']) ? create('[', e, e, ']') : toIntervalFactory(Interval)(e)
      if (b === e) {
        throw new Error(e + ' is not castable to Interval o Number')
      }

      return isEmpty(b) || limitComparator(b[0], a[0]) >= 0 &&
        limitComparator(b[1], a[1]) <= 0
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
