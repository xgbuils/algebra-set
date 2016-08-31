var typeVerify = require('type-verify')
var parseMultiInterval = require('../../parsers/multi-interval.js')
var Interval = require('../../interval/')
var IntervalFactory = require('../../interval/factory.js')

module.exports = function stringCast (value) {
  return typeVerify(value, ['String'])
    ? parseMultiInterval(value).map(IntervalFactory(Interval))
    : value
}
