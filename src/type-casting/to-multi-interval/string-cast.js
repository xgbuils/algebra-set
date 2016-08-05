var typeVerify = require('type-verify')
var parseSet = require('../../parsers/set.js')

module.exports = function stringCast (value) {
  return typeVerify(value, ['String']) ? parseSet(value) : value
}
