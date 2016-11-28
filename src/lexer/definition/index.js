var Iterum = require('iterum')
var TokenCalculator = require('../token-calculator.js')

var ExpressionTokenBuilder = require('../token-builder/expression-token-builder.js')
var NumberTokenBuilder = require('../token-builder/number-token-builder.js')
var SymbolTokenBuilder = require('../token-builder/symbol-token-builder.js')

function lexer (string, functions, sets) {
    return Iterum(function () {
        var regexp = /(\s*)(\w+|\(|\)|,)\s*/gi
        var column = 1
        var builders = [
            new ExpressionTokenBuilder(functions, 'function'),
            new ExpressionTokenBuilder(sets, 'set'),
            new NumberTokenBuilder(),
            new SymbolTokenBuilder()
        ]
        var tokenCalculator = new TokenCalculator(builders)
        return {
            next: function () {
                var matches = regexp.exec(string)
                var done = matches === null
                var token
                if (!done) {
                    token = tokenCalculator.calculate(matches[2], column + matches[1].length)
                    column += matches[0].length
                }
                return {
                    value: token,
                    done: done
                }
            }
        }
    })
}

module.exports = lexer
