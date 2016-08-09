var Interval = require('./interval.js')
var toSetFactory = require('./type-casting/to-set/')
var toSet = toSetFactory(TopologicalSet, Interval)
var typeVerify = require('type-verify')
var rawIntervalCreate = require('./utils/raw-interval-create.js')

function TopologicalSet (e) {
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
