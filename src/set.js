var Interval = require('./interval.js')
var toSetFactory = require('./type-casting/to-set/')
var predicateCast = require('./type-casting/to-set/predicate-cast.js')

function TopologicalSet (e) {
  var toSet = toSetFactory(TopologicalSet, Interval)
  var intervals = toSet(e)
  if (intervals !== e) {
    this._intervals = intervals
  } else {
    var obj = predicateCast(e)
    if (obj !== e) {
      this.fn = obj.contains
      this.equality = obj.equality
    } else {
      throw new Error('TODO: error')
    }
  }
}

Object.defineProperties(TopologicalSet.prototype, {
  contains: {
    value: function (e) {
      if (typeof e === 'string') {
        e = new TopologicalSet(e)
      }
      if (e instanceof TopologicalSet) {
        var intervals = this._intervals
        if (!isCalculableSet(this) || !isCalculableSet(e)) {
          return null
        }
        return e._intervals.every(function (eInterval) {
          return intervals.some(function (interval) {
            return interval.contains(eInterval)
          })
        })
      } else if (typeof this.fn === 'function') {
        return this.fn.call(null, e)
      } else {
        return this._intervals.some(function (interval) {
          return interval.contains(e)
        })
      }
    }
  },

  connectedComponents: {
    value: function () {
      return this._intervals
    }
  }
})

function isCalculableSet (set) {
  return typeof set.fn !== 'function'
}

module.exports = TopologicalSet
