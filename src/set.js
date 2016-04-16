var parseSet = require('./utils/parse-set.js')
var limitComparator = require('./utils/limit-comparator.js')
var Interval = require('./interval.js')

function TopologicalSet (e) {
  var type = typeof e
  var isObject = e && type === 'object'
  this.equality = equality

  if (e instanceof TopologicalSet) {
    this._intervals = e._intervals.map(function (e) {
      return new Interval(e)
    })
  } else if (type === 'string') {
    this._intervals = Interval.union.apply(null, parseSet(e))
  } else if (isObject && typeof e.contains === 'function') {
    this.fn = e.contains
  }

  if (isObject && typeof e.equality === 'function') {
    this.equality = e.equality
  }

  this._intervals = this._intervals || []
}

function equality (a, b) {
  return a === b
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
            var a = interval.interval
            var b = eInterval.interval
            return limitComparator(a[0], b[0]) <= 0 &&
              limitComparator(a[1], b[1]) >= 0
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
