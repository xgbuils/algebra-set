var typeVerify = require('type-verify')
var toSetFactory = require('../type-casting/to-set/')
var Interval = require('../interval/')
var IntervalFactory = require('../interval/factory.js')
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
  var fns = []
  intervals.forEach.call(arguments, function (set) {
    var result = toSet(set)
    var resultIntervals = result.intervals
    var resultFns = result.fns
    if (result === set) {
      throw new Error(set + ' is not castable to set')
    }
    if (resultIntervals.length > 0) {
      intervals.push.apply(intervals, resultIntervals.map(rawInterval))
    }
    if (resultFns.length > 0) {
      fns.push.apply(fns, resultFns)
    }
  })

  return Object.create(TopologicalSet.prototype, {
    intervals: {
      value: union(intervals).map(IntervalFactory(Interval))
    },
    fns: {
      value: fns
    }
  })
}

Object.defineProperties(TopologicalSet.prototype, {
  contains: {
    value: function (e) {
      var isNumber = typeVerify(e, ['Number'])
      if (this.fns.length > 0) {
        return isNumber ? this.fns.some(function (obj) {
          return obj.fn(e)
        }) : null
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
  },

  union: {
    value: function () {
      var sets = [this]
      sets.push.apply(sets, arguments)
      return TopologicalSet.union.apply(null, sets)
    }
  }
})

module.exports = TopologicalSet
