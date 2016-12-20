var ParserToken = require('../parser-token')

function ParenthesisLeftToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'ARGUMENT_FUNCTION',
        'ARGUMENT_TUPLE'
    ], next)
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)
ParenthesisLeftToken.prototype.constructor = ParenthesisLeftToken

function next (status) {
    var parserStatus = this.parserStatus
    var fn = parserStatus.get.to.push('fn')
    var nextStatus = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARGUMENT', 'SEPARATOR')

    parserStatus.push(nextStatus)
    return fn ? 'ARGUMENT_FUNCTION' : 'ARGUMENT_TUPLE'
}

module.exports = ParenthesisLeftToken
