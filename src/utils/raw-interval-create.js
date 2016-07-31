var typeVerify = require('type-verify')

var map = {
  '(': 1,
  '[': 0,
  ']': 0,
  ')': -1
}

function cast (value) {
  return typeVerify(value, ['Number']) ? value : map[value]
}

module.exports = function (left, a, b, right) {
  return [{
    value: a,
    limit: cast(left)
  }, {
    value: b,
    limit: cast(right)
  }]
}
