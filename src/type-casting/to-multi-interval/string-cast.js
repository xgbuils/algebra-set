var typeVerify = require('type-verify')
var parseMultiInterval = require('../../parsers/multi-interval.js')

module.exports = function stringCast (value) {
  return typeVerify(value, ['String']) ? parseMultiInterval(value) : value
}
