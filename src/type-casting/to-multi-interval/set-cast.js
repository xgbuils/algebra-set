function setCast (value) {
  if (typeVerify(value, ['String'])) {
    return parseSet(result)
  } else if (value instanceof TopologicalSet) {
    return value._intervals
  }
  return value
}

module.exports = setCast