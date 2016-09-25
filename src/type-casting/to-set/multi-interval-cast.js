var intervalCastFactory = require('../to-multi-interval/interval-cast')
var stringCast = require('../to-multi-interval/string-cast')
var castFactory = require('../cast-factory.js')

module.exports = function (TSet, TInterval) {
  var intervalCast = intervalCastFactory(TInterval)
  return function (value) {
    var intervals = castFactory([
      compactAfter(stringCast),
      compactAfter(intervalCast)
    ])(value)
    return value !== intervals ? {
      intervals: intervals,
      fns: []
    } : value
  }

  function compactAfter (cb) {
    return function (value) {
      var intervals = cb(value)
      return value !== intervals ? TInterval.union.apply(null, intervals) : value
    }
  }
}
