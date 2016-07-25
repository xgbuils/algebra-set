var typeVerify = require('type-verify')
var Interval = require('../../interval.js')

function intervalCast (value) {
  var intervalList = []
  var isIntervalList = typeVerify(value, ['Array']) && value.every(function (e) {
    if (e instanceof Interval) {
      return intervalList.push(e)
    } else if (isRawInterval(e)) {
      return intervalList.push(Interval.create(e))
    } else {
      return false
    }
  })
  if (isIntervalList) {
    return intervalList
  }
  if (isRawInterval(value)) {
    value = Interval.create(value)
  }
  if (value instanceof Interval) {
    value = [value]
  }
  return value
}

function isRawInterval (e) {
  return typeVerify(e, ['Array']) && isLimit(e[0]) && isLimit(e[1])
}

function isLimit (e) {
  return typeVerify(e, ['Object']) && typeVerify(e.value, ['Number']) && typeVerify(e.limit, ['Number', 'String'])
}

module.exports = intervalCast