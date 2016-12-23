var Iterum = require('iterum')
var Value = Iterum.Value

var exec = require('./regexp-utils/exec')
var toGlobal = require('./regexp-utils/to-global')

function lexer (string, ignore, tokenCalculator) {
    var endToken = {
        type: 'end'
    }
    ignore = toGlobal(ignore)
    return Iterum(function () {
        var column = 0

        return {
            next: function () {
                var ignoreMatch = exec(ignore, string, column)
                var start = ignoreMatch ? ignore.lastIndex : column
                var done = start === string.length
                var token
                if (!done) {
                    token = tokenCalculator.calculate(start + 1)
                    column = start + token.key.length
                }
                return {
                    value: token,
                    done: done
                }
            }
        }
    })
    .concat(Value(endToken))
}

module.exports = lexer
