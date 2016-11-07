var Iterum = require('iterum')

function lexer (string, functions, sets) {
    return Iterum(function () {
        var regexp = /(\s*)(\w+|\(|\)|,)\s*/g
        var column = 1
        return {
            next: function () {
                var matches = regexp.exec(string)
                var done = matches === null
                var value
                if (!done) {
                    value = {
                        key: matches[2],
                        column: column + matches[1].length
                    }
                    column += matches[0].length
                }
                return {
                    value: value,
                    done: done
                }
            }
        }
    })
    .map(function (token) {
        var key = token.key
        var fn = functions[key]
        var set = sets[key]
        var value = fn || set
        var type = fn ? 'function' : 'set'
        if (!value && ['(', ')', ','].indexOf(key) === -1) {
            throw new Error('`' + key + '` is not a function or parameter')
        }
        token.value = value || key
        token.type = value ? type : key
        return token
    })
}

module.exports = lexer
