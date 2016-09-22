var typeVerify = require('type-verify')
var toSetFactory = require('../type-casting/to-set/')
var Interval = require('../interval/')
var IntervalFactory = require('../interval/factory.js')
var toMultiInterval = require('../type-casting/to-multi-interval/')
var union = require('../interval/union.js')
var rawIntervalCreate = require('../interval/raw-interval-create.js')
var rawInterval = require('../interval/raw-interval.js')
var toSet = toSetFactory(TopologicalSet, Interval)

function TopologicalSet (e) {
  var obj = toSet(e)
  if (!(this instanceof TopologicalSet)) {
    return new TopologicalSet(e)
  }
  if (obj === e) {
    throw new Error('TODO: error. imposible to cast')
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      Object.defineProperty(this, key, {
        value: obj[key]
      })
    }
  }
}

TopologicalSet.union = function () {
  var intervals = []
  intervals.forEach.call(arguments, function (set) {
    var result = toMultiInterval(TopologicalSet, Interval)(set)
    if (result === set) {
      throw new Error(set + ' is not castable to array of intervals')
    }
    intervals.push.apply(intervals, result.map(rawInterval))
  })

  return Object.create(TopologicalSet.prototype, {
    intervals: {
      value: union(intervals).map(IntervalFactory(Interval))
    }
  })
}

Object.defineProperties(TopologicalSet.prototype, {
  contains: {
    value: function (e) {
      var isNumber = typeVerify(e, ['Number'])
      if (this.fn) {
        return isNumber ? this.fn.call(null, e) : null
      }
      if (isNumber) {
        e = rawIntervalCreate('[', e, e, ']')
      }
      var obj = toSet(e)
      if (obj === e) {
        throw new Error(e + ' is not castable to Set')
      } else if (obj.fn) {
        return null
      }

      var intervals = this.intervals
      return obj.intervals.every(function (objInterval) {
        return intervals.some(function (interval) {
          return interval.contains(objInterval)
        })
      })
    }
  }
})

module.exports = TopologicalSet
