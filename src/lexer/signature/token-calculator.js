var ExpressionTokenBuilder = require('../token-builder/expression-token-builder.js')
var SetTokenBuilder = require('../token-builder/set-token-builder.js')
var IntegerTokenBuilder = require('../token-builder/integer-token-builder.js')
var SymbolTokenBuilder = require('../token-builder/symbol-token-builder.js')

function TokenCalculator (sets) {
    this.builders = [
        new ExpressionTokenBuilder(sets, 'set'),
        new SetTokenBuilder(),
        new IntegerTokenBuilder(),
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
