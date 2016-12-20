var ParserToken = require('../parser-token')

function ParenthesisLeftToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'NESTED_ARGUMENT_TUPLE',
        'ARGUMENT_TUPLE'
    ])
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)
ParenthesisLeftToken.prototype.constructor = ParenthesisLeftToken

ParenthesisLeftToken.prototype.nextStatus = function (status) {
    if (status === 'START_EXPR') {
        this.parserStatus.push('END_EXPR')
    }
    this.parserStatus.push('NESTED_SEPARATOR_TUPLE')
    return 'NESTED_ARGUMENT_TUPLE'
}

module.exports = ParenthesisLeftToken
