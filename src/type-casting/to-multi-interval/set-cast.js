module.exports = function (TSet) {
  return function setCast (value) {
    return value instanceof TSet ? value._intervals : value
  }
}
