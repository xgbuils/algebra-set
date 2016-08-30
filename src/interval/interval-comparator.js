var limitComparator = require('./limit-comparator.js')

function intervalComparator (x, y) {
  var a = x.interval
  var b = y.interval
  var startCmp = limitComparator(a[0], b[0])
  if (startCmp !== 0) {
    return startCmp
  } else {
    return limitComparator(b[1], a[1])
  }
}

module.exports = intervalComparator
