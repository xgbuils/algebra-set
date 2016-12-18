var ParserToken = require('../parser-token')

function SetToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'NESTED_ARG_TUPLE',
        'ARG_TUPLE'
    ])
}

SetToken.prototype = Object.create(ParserToken.prototype)
SetToken.prototype.constructor = SetToken

SetToken.prototype.nextStatus = function (status) {
    var parserStatus = this.parserStatus
    if (status === 'START_EXPR') {
        parserStatus.push('END_EXPR')
    }
    parserStatus.addValue(this.value)
    return status === 'START_EXPR'
        ? 'COMMA_TUPLE'
        : status.replace('ARG', 'COMMA')
}

module.exports = SetToken
