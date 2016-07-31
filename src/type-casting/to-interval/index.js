var isRawInterval = require('./is-raw-interval.js')
var parseInterval = require('../../parsers/interval.js')

module.exports = function (TInterval) {
  return function (value) {
    var interval
    if (typeof value === 'string') {
      interval = parseInterval(value)
    } else if (isRawInterval(value)) {
      interval = value
    } else if (value instanceof TInterval) {
      interval = value.interval
    } else {
      return value
    }
    return TInterval.create(interval)
  }
}
