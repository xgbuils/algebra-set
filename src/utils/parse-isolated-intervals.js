var Interval = require('../interval.js')

function parseIsolatedIntervals (str) {
  var matches = /^\{\s*(\S+(?:\s*,\s*\S+)*)\s*\}$/.exec(str)

  if (!matches) {
    throw new Error(str + ' does not match')
  }

  return matches[1].split(',').map(function (e) {
    return e.trim()
  }).map(function (e) {
    var num = Number(e)
    if (isNaN(num)) {
      throw new Error(e + 'is not a number')
    } else {
      return num
    }
  }).map(function (num) {
    return Interval.create('[', num, num, ']')
  })
}

module.exports = parseIsolatedIntervals