var create = require('../utils/interval-create.js')
var isEmpty = require('../utils/interval-is-empty.js')

function parseStringToValues (str) {
  var matches = /^([\(\[])\s*(\S+)\s*,\s*(\S+)\s*([\)\]])$/.exec(str)
  if (!matches) {
    throw new Error(str + ' does not match')
  }
  var start = matches[2] = Number(matches[2])
  var end = matches[3] = Number(matches[3])
  if (isNaN(start)) {
    throw new Error(start + 'is not a number')
  }
  if (isNaN(end)) {
    throw new Error(end + 'is not a number')
  }
  return matches.slice(1)
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
