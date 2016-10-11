var Iterum = require('iterum')
var Cartesian = Iterum.Cartesian
var Repeat = Iterum.Repeat
var List = Iterum.List
var intervalUtils = require('math.interval-utils')
var numToInterval = intervalUtils.numToInterval
var union = require('math.interval-utils').union
var MSet = require('math.set')
var rawSet = require('math.set/src/raw-set')
var toMultiInterval = require('math.set/src/cast/')(MSet, false)

function MFunction (intervalFunction, domain) {
  domain = new MSet(domain || '(-Infinity, Infinity)')

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
    return rawSet(result)
  }

  var fn = function () {
    var args = [].map.call(arguments, function (value) {
      return numToInterval(value)
    })
    return intervalFn.apply(null, args)[0][0].value
  }

  Object.defineProperties(fn, {
    image: {
      get: function () {
        var length = intervalFunction.length
        var intervals = rawSet(domain)
        var intervalsList = Repeat(intervals, length).toArray()
        var imageIntervals = Cartesian.apply(null, intervalsList)
          .map(function (domainIntervals) {
            return List(intervalFn.apply(null, domainIntervals))
          })
          .toArray()
        return MSet(union(imageIntervals))
      }
    },
    domain: {
      set: function (value) {
        domain = new MSet(value)
      },
      get: function () {
        return domain
      }
    }
  })

  return fn
}

module.exports = MFunction
