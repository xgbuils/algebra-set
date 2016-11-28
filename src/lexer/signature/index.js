var Iterum = require('iterum')
var TokenCalculator = require('../token-calculator.js')

var ExpressionTokenBuilder = require('../token-builder/expression-token-builder.js')
var SetTokenBuilder = require('../token-builder/set-token-builder.js')
var IntegerTokenBuilder = require('../token-builder/integer-token-builder.js')
var SymbolTokenBuilder = require('../token-builder/symbol-token-builder.js')

function lexer (string, sets) {
    return Iterum(function () {
        var regexp = /(\s*)((?:[\(\[\{][\w.,\s]+[\)\]\}](?:\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*)|[a-z][_\w]*|\d+|\(|\)|,|x|\^)\s*/gi
        var column = 1
        var tokenCalculator = new TokenCalculator([
            new ExpressionTokenBuilder(sets, 'set'),
            new SetTokenBuilder(),
            new IntegerTokenBuilder(),
            new SymbolTokenBuilder()
        ])
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
