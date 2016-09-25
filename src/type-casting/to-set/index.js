var multiIntervalCastFactory = require('./multi-interval-cast.js')
var predicateCast = require('./predicate-cast.js')
var setCastFactory = require('./set-cast.js')
var castFactory = require('../cast-factory.js')

module.exports = function (TSet, TInterval) {
  var multiIntervalCast = multiIntervalCastFactory(TSet, TInterval)
  var setCast = setCastFactory(TSet)
  return castFactory([setCast, multiIntervalCast, predicateCast])
}

