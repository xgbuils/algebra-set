var ParserToken = require('./parser-token')

function ParenthesisLeftToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'START_EXPR',
        'ARG_FUNCTION',
        'ARG_TUPLE'
    ])
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)
ParenthesisLeftToken.prototype.constructor = ParenthesisLeftToken

ParenthesisLeftToken.prototype.nextStatus = function (status) {
    var parserStatus = this.parserStatus
    var fn = parserStatus.memo.fn
    var nextStatus = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARG', 'COMMA')

    parserStatus.push(nextStatus, {
        fn: fn,
        fnName: parserStatus.memo.fnName,
        array: []
    })
    return fn ? 'ARG_FUNCTION' : 'ARG_TUPLE'
}

module.exports = ParenthesisLeftToken
