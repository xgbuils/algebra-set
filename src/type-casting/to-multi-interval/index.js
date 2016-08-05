var intervalCastFactory = require('./interval-cast')
var stringCast = require('./string-cast')
var setCastFactory = require('./set-cast')

module.exports = function (TSet, TInterval) {
  var intervalCast = intervalCastFactory(TInterval)
  var setCast = setCastFactory(TSet)
  return function (rawValue) {
    var value
    var castFunctions = [intervalCast, stringCast, setCast]
    for (var i = 0; i < castFunctions.length; ++i) {
      value = castFunctions[i](rawValue)
      if (value !== rawValue) {
        return value
      }
    }

    throw new Error('Imposible to cast ' + rawValue + ' to multi interval list')
  }
}
