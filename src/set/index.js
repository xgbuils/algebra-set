var typeVerify = require('type-verify')
var toSetFactory = require('../type-casting/to-set/')
var Interval = require('math.interval')
var intervalUtils = require('math.interval-utils')
var union = intervalUtils.union
var numToInterval = intervalUtils.numToInterval
var rawInterval = require('math.interval/src/raw-interval')
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
      value: union(intervals).map(function (interval) {
        return new Interval(interval)
      })
    },
    fns: {
      value: fns
    }
  })
}

Object.defineProperties(TopologicalSet.prototype, {
  isEmpty: {
    value: function () {
      return this.fns.length > 0 ? null : this.intervals.length === 0
    }
  },

  contains: {
    value: function (e) {
      var isNumber = typeVerify(e, ['Number'])
      var resultByPredicate = false
      if (isNumber) {
        resultByPredicate = containsByPredicates(this.fns, e)
        if (resultByPredicate) {
          return resultByPredicate
        }
        e = numToInterval(e)
      } else if (this.fns.length > 0) {
        resultByPredicate = null
      }

      var obj = toSet(e)
      if (obj === e) {
        throw new Error(e + ' is not castable to Set')
      } else if (obj.fns.length > 0) {
        return null
      }

      var resultByIntervals = containsByIntervals(this.intervals, obj.intervals)
      return resultByIntervals || resultByPredicate
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

function containsByPredicates (predicates, num) {
  return predicates.some(function (obj) {
    return obj.fn(num)
  })
}

function containsByIntervals (intervals1, intervals2) {
  return intervals2.every(function (i2) {
    return intervals1.some(function (i1) {
      return i1.contains(i2)
    })
  })
}

module.exports = TopologicalSet
