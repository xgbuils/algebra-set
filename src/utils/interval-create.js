var map = {
  '(': 1,
  '[': 0,
  ']': 0,
  ')': -1
}

module.exports = function (left, a, b, right) {
  return [{
    value: a,
    limit: map[left]
  }, {
    value: b,
    limit: map[right]
  }]
}
