function intervalCreator (e) {
  if (typeof e === 'string') {
    return parseInterval(e)
  } else {
    return e
  }
}

module.exports = intervalCreator

function parseInterval (str) {
  var matches = /^([\(\[])\s*(\S+)\s*,\s*(\S+)\s*([\)\]])$/.exec(str)
  if (!matches) {
    throw new Error(str + ' does not match')
  }
  var start = Number(matches[2])
  var end = Number(matches[3])
  if (isNaN(start)) {
    throw new Error(matches[2] + 'is not a number')
  }
  if (isNaN(end)) {
    throw new Error(matches[3] + 'is not a number')
  }

  return [
    {
      value: start,
      limit: matches[1] === '[' ? 0 : 1
    },
    {
      value: end,
      limit: matches[4] === ']' ? 0 : -1
    }
  ]
}
