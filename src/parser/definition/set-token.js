var ParserToken = require('parser.token')

function SetToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'ARGUMENT_FUNCTION',
        'ARGUMENT_TUPLE'
    ], next)
}

SetToken.prototype = Object.create(ParserToken.prototype)
SetToken.prototype.constructor = SetToken

function next (status) {
    this.parserStatus.addValue(this.value)
    return status === 'START_EXPR'
        ? 'END_EXPR'
        : status.replace('ARGUMENT', 'SEPARATOR')
}

module.exports = SetToken
