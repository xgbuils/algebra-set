var ParserToken = require('../parser-token')

function NumberToken (token) {
    ParserToken.call(this, token, [
        'NESTED_ARG_NUMBER',
        'ARG_NUMBER'
    ])
}

NumberToken.prototype = Object.create(ParserToken.prototype)
NumberToken.prototype.constructor = NumberToken

NumberToken.prototype.nextStatus = function (status, values) {
    var value = values.pop()
    var power = this.value
    for (var i = 0; i < power; ++i) {
        values.push(value)
    }

    return status.replace('ARG_NUMBER', 'COMMA_TUPLE')
}

module.exports = NumberToken
