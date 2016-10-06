var intervalCast = require('./interval-cast')
var stringCast = require('./string-cast')
var setCastFactory = require('./set-cast')
var castFactory = require('../cast-factory.js')

module.exports = function (TSet, TInterval) {
  var setCast = setCastFactory(TSet)
  return castFactory([stringCast, intervalCast, setCast])
}
