var Iterum = require('iterum')
var TokenCalculator = require('./token-calculator.js')

function lexer (string, sets) {
    return Iterum(function () {
        var regexp = /(\s*)((?:[\(\[\{][\w.,\s]+[\)\]\}](?:\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*)|[a-z][_\w]*|\d+|\(|\)|,|x|\^)\s*/gi
        var column = 1
        var tokenCalculator = new TokenCalculator(sets)
        return {
            next: function () {
                var matches = regexp.exec(string)
                var done = matches === null
                //console.log(matches, done, string)
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
