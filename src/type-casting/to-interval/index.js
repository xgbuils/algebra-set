var isRawInterval = require('./is-raw-interval.js')
var rawInterval = require('../../interval/raw-interval.js')
var parseInterval = require('../../parsers/interval.js')

module.exports = function (TInterval) {
  return function (value) {
    var interval
    if (typeof value === 'string') {
      interval = parseInterval(value)
    } else if (isRawInterval(value)) {
      interval = [value[0], value[1]]
    } else if (value instanceof TInterval) {
      interval = rawInterval(value)
    } else {
      return value
    }
    return interval
  }
}
