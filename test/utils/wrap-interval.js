var Interval = require('../../src/interval.js')

module.exports = function (e) {
  return Object.create(Interval.prototype, {
    interval: {
      value: e
    }
  })
}
