var ParserToken = require('../parser-token')

function ParenthesisLeftToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'START_EXPR',
        'NESTED_ARG_TUPLE',
        'ARG_TUPLE'
    ])
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)
ParenthesisLeftToken.prototype.constructor = ParenthesisLeftToken

ParenthesisLeftToken.prototype.nextStatus = function (status) {
    if (status === 'START_EXPR') {
        this.parserStatus.push('END_EXPR')
    }
    this.parserStatus.push('NESTED_COMMA_TUPLE')
    return 'NESTED_ARG_TUPLE'
}

module.exports = ParenthesisLeftToken
