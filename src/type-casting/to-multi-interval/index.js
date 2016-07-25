var intervalCast = require('./interval-cast')
var setCast = require('./set-cast')

module.exports = function (rawValue) {
  var value
  var castFunctions = [intervalCast, setCast]
  for (var i = 0; i < castFunctions.length; ++i) {
    value = castFunctions[i](rawValue)
    if (value !== rawValue) {
      return value
    }
  }

  throw new Error('Imposible to cast ' + rawValue + ' to multi interval list')
}