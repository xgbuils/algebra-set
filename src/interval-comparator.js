var limitComparator = require('./limit-comparator.js')

function intervalComparator (a, b) {
  var startCmp = limitComparator(a[0], b[0])
  if ( startCmp !== 0) {
    return startCmp
  } else {
    return limitComparator(b[1], a[1])
  }
}

module.exports = intervalComparator