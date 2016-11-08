var Iterum = require('iterum')
var TokenCalculator = require('./token-calculator.js')

function lexer (string, functions, sets) {
    return Iterum(function () {
        var regexp = /(\s*)(\w+|\(|\)|,)\s*/gi
        var column = 1
        var tokenCalculator = new TokenCalculator(functions, sets)
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
