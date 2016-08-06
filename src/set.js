var Interval = require('./interval.js')
var toSetFactory = require('./type-casting/to-set/')

function TopologicalSet (e) {
  var toSet = toSetFactory(TopologicalSet, Interval)
  var obj = toSet(e)
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

Object.defineProperties(TopologicalSet.prototype, {
  contains: {
    value: function (e) {
      if (typeof e === 'string') {
        e = new TopologicalSet(e)
      }
      if (e instanceof TopologicalSet) {
        var intervals = this.intervals
        if (!isCalculableSet(this) || !isCalculableSet(e)) {
          return null
        }
        return e.intervals.every(function (eInterval) {
          return intervals.some(function (interval) {
            return interval.contains(eInterval)
          })
        })
      } else if (typeof this.fn === 'function') {
        return this.fn.call(null, e)
      } else {
        return this.intervals.some(function (interval) {
          return interval.contains(e)
        })
      }
    }
  },

  connectedComponents: {
    value: function () {
      return this.intervals
    }
  }
})

function isCalculableSet (set) {
  return typeof set.fn !== 'function'
}

module.exports = TopologicalSet
