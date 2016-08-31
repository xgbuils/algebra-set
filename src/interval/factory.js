function IntervalFactory (IntervalClass) {
  return function (rawInterval) {
    return Object.create(IntervalClass.prototype, {
      interval: {
        value: rawInterval
      }
    })
  }
}

module.exports = IntervalFactory
