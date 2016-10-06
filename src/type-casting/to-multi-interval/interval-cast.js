var typeVerify = require('type-verify')
var Interval = require('math.interval')
var toInterval = require('math.interval/src/cast')(Interval)

module.exports = function intervalCast (value) {
  var intervalList = []
  var isIntervalList = typeVerify(value, ['Array']) && value.every(function (e) {
    var partialResult = toInterval(e)
    if (e !== partialResult) {
      return intervalList.push(new Interval(partialResult))
    }
    return false
  })
  if (isIntervalList) {
    return intervalList
  }
  var result = toInterval(value)
  if (value !== result) {
    return [new Interval(result)]
  }
  return value
}
