var ExpressionTokenBuilder = require('../token-builder/expression-token-builder.js')
var NumberTokenBuilder = require('../token-builder/number-token-builder.js')
var SymbolTokenBuilder = require('../token-builder/symbol-token-builder.js')

function TokenCalculator (functions, sets) {
    this.builders = [
        new ExpressionTokenBuilder(functions, 'function'),
        new ExpressionTokenBuilder(sets, 'set'),
        new NumberTokenBuilder(),
        new SymbolTokenBuilder()
    ]
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
