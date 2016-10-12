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
var typeVerify = require('type-verify')

function MFunction (intervalFunction, domain) {
    var length = intervalFunction.length

    if (typeof intervalFunction !== 'function') {
        throw Error('First parameter must be a function.')
    } else if (intervalFunction.length <= 0) {
        throw Error('First parameter function must have 1 or more parameters.')
    }
    if (domain === undefined) {
        domain = Repeat(new MSet('(-Infinity, Infinity)'), length).toArray()
    } else if (typeVerify(domain, ['Array'])) {
        domain = domain.map(function (set) {
            return new MSet(set)
        })
    } else {
        throw Error('domain parameter ' + domain + ' is not an array.')
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
                var intervalsList = domain.map(rawSet)
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
                domain = value.map(function (set) {
                    return new MSet(set)
                })
            },
            get: function () {
                return domain
            }
        }
    })

    return fn
}

module.exports = MFunction
