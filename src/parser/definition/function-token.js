var ParserToken = require('./parser-token')

function FunctionToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'START_EXPR',
        'ARG_FUNCTION',
        'ARG_TUPLE'
    ])
}

FunctionToken.prototype = Object.create(ParserToken.prototype)

FunctionToken.prototype.nextStatus = function () {
    var parserStatus = this.parserStatus
    var status = parserStatus.getStatus()
    var nextStatus = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARG', 'COMMA')
    parserStatus.push(nextStatus, {
        fn: this.value,
        fnName: this.key,
        array: []
    })
    var token = parserStatus.nextToken()
    if (token.value !== '(') {
        throw new Error('token `(` is expected after `' + token.key + '`')
    }
    return 'ARG_FUNCTION'
}

module.exports = FunctionToken
