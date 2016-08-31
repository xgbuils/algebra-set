var typeVerify = require('type-verify')
var Interval = require('../../interval/')
var IntervalInstanceFactory = require('../../interval/factory.js')(Interval)
var toIntervalFactory = require('../to-interval/')

module.exports = function (TInterval) {
  var toInterval = toIntervalFactory(TInterval)
  return function intervalCast (value) {
    var intervalList = []
    var isIntervalList = typeVerify(value, ['Array']) && value.every(function (e) {
      var partialResult = toInterval(e)
      if (e !== partialResult) {
        return intervalList.push(IntervalInstanceFactory(partialResult))
      }
      return false
    })
    if (isIntervalList) {
      return intervalList
    }
    var result = toInterval(value)
    if (value !== result) {
      return [IntervalInstanceFactory(result)]
    }
    return value
  }
}
