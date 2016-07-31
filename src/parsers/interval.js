var create = require('../utils/raw-interval-create.js')
var isEmpty = require('../utils/interval-is-empty.js')

function parseStringToValues (str) {
  var matches = /^\{\s*(\S+)\s*\}|([\(\[])\s*(\S+)\s*,\s*(\S+)\s*([\)\]])$/.exec(str)
  if (!matches) {
    throw new Error('"' + str + '" does not match to interval expression')
  }
  var value = matches[1]
  if (value) {
    var num = Number(value)
    assertNum(num, value)
    return ['[', num, num, ']']
  }
  return matches.slice(2).map(function (value, index) {
    if ((index === 1 || index === 2)) {
      var num = Number(value)
      assertNum(num, value)
      return num
    } else {
      return value
    }
  })
}

function assertNum (num, value) {
  if (isNaN(num)) {
    throw new Error('"' + value + '" is not a number')
  }
}

function normalizeIfEmpty (interval) {
  if (isEmpty(interval)) {
    interval[1] = {
      value: interval[0].value,
      limit: -1
    }
  }
  return interval
}

module.exports = function stringToInterval (e) {
  return normalizeIfEmpty(create.apply(null, parseStringToValues(e)))
}
