var typeVerify = require('type-verify')
var parseSet = require('../../parsers/set.js')

module.exports = function (TSet) {
  return function setCast (value) {
    if (typeVerify(value, ['String'])) {
      return parseSet(value)
    } else if (value instanceof TSet) {
      return value._intervals
    }
    return value
  }
}
