function TokenCalculator (builders) {
    this.builders = builders
}

TokenCalculator.prototype.calculate = function (key, column) {
    var builders = this.builders
    for (var i = 0; i < builders.length; ++i) {
        var token = builders[i]
            .withKey(key)
            .withColumn(column)
            .build()
        if (token) {
            return token
        }
    }
}

module.exports = TokenCalculator
