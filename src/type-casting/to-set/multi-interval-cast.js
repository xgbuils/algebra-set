var intervalCastFactory = require('../to-multi-interval/interval-cast')
var stringCast = require('../to-multi-interval/string-cast')
var setCastFactory = require('../to-multi-interval/set-cast')
var castFactory = require('../cast-factory.js')

module.exports = function (TSet, TInterval) {
  var intervalCast = intervalCastFactory(TInterval)
  var setCast = setCastFactory(TSet)
  return function (value) {
    var intervals = castFactory([
      compactAfter(stringCast),
      compactAfter(intervalCast),
      setCast
    ])(value)
    return value !== intervals ? {intervals: intervals} : value
  }

  function compactAfter (cb) {
    return function (value) {
      var intervals = cb(value)
      return value !== intervals ? TInterval.union.apply(null, intervals) : value
    }
  }
}
