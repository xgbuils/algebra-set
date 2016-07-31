var typeVerify = require('type-verify')

module.exports = function (TInterval) {
  return function intervalCast (value) {
    var intervalList = []
    var isIntervalList = typeVerify(value, ['Array']) && value.every(function (e) {
      if (e instanceof TInterval) {
        return intervalList.push(e)
      } else if (isRawInterval(e)) {
        return intervalList.push(TInterval.create(e))
      } else {
        return false
      }
    })
    if (isIntervalList) {
      return intervalList
    }
    if (isRawInterval(value)) {
      value = TInterval.create(value)
    }
    if (value instanceof TInterval) {
      value = [value]
    }
    return value
  }
}

function isRawInterval (e) {
  return typeVerify(e, ['Array']) && isLimit(e[0]) && isLimit(e[1])
}

function isLimit (e) {
  return typeVerify(e, ['Object']) && typeVerify(e.value, ['Number']) && typeVerify(e.limit, ['Number', 'String'])
}
