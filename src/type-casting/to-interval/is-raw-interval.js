var typeVerify = require('type-verify')

function isRawInterval (e) {
  return typeVerify(e, ['Array']) && isLimit(e[0]) && isLimit(e[1])
}

function isLimit (e) {
  return typeVerify(e, ['Object']) && typeVerify(e.value, ['Number']) && typeVerify(e.limit, ['Number', 'String'])
}

module.exports = isRawInterval
