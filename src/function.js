var Iterum = require('iterum')
var Cartesian = Iterum.Cartesian
var Repeat = Iterum.Repeat
var List = Iterum.List
var TInterval = require('./interval.js')
var TSet = require('./set')
var toMultiInterval = require('./type-casting/to-multi-interval')(TSet, TInterval)

function TopologicalFunction (intervalFunction, domain) {
  domain = new TSet(domain || '(-Infinity, Infinity)')

  var intervalFn = function () {
    var rawResult = intervalFunction.apply(null, arguments)
    return toMultiInterval(rawResult)
  }

  var fn = function () {
    var args = [].slice.call(arguments).map(function (value) {
      return TInterval.create('[', value, value, ']')
    })
    return intervalFn.apply(null, args)[0][0].value
  }

  Object.defineProperties(fn, {
    image: {
      get: function () {
        var length = intervalFunction.length
        var intervals = extractIntervals(domain)
        var intervalsList = Repeat(intervals, length).toArray()
        var imageIntervals = Cartesian.apply(null, intervalsList)
          .map(function (domainIntervals) {
            return List(intervalFn.apply(null, domainIntervals))
          })
          .toArray()
        return TInterval.union.apply(null, imageIntervals)
      }
    },
    domain: {
      set: function (value) {
        domain = new TSet(value)
      },
      get: function () {
        return domain
      }
    }
  })

  return fn
}

function extractIntervals (set) {
  return set.intervals.map(function (e) {
    return e.interval
  })
}

module.exports = TopologicalFunction
