var Iterum = require('iterum')
var Cartesian = Iterum.Cartesian
var Repeat = Iterum.Repeat
var List = Iterum.List
var TInterval = require('./interval.js')
var TSet = require('./set')
var toMultiInterval = require('./type-casting/to-multi-interval')(TSet, TInterval)

function TopologicalFunction (intervalFunction, domain) {
  domain = new TSet(domain || '(-Infinity, Infinity)')

  if (typeof intervalFunction !== 'function') {
    throw Error('First parameter must be a function.')
  } else if (intervalFunction.length <= 0) {
    throw Error('First parameter function must have 1 or more parameters.')
  }

  var intervalFn = function () {
    var rawResult = intervalFunction.apply(null, arguments)
    var result = toMultiInterval(rawResult)
    if (result === rawResult) {
      throw new Error('Imposible to cast result returned by interval function.')
    }
    return result
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
        return TSet(TInterval.union.apply(null, imageIntervals))
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
