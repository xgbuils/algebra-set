var rawInterval = require('./raw-interval.js')

module.exports = function rawSet (e) {
  return e.intervals.map(rawInterval)
}
