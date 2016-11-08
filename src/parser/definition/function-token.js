var ParserToken = require('./parser-token')

function FunctionToken (token, globalStatus) {
    ParserToken.call(this, token, globalStatus, [
        'START_EXPR',
        'ARG_FUNCTION',
        'ARG_TUPLE'
    ])
}

FunctionToken.prototype = Object.create(ParserToken.prototype)

FunctionToken.prototype.nextStatus = function () {
    var globalStatus = this.globalStatus
    var status = globalStatus.status
    var stack = globalStatus.stack
    this.current.status = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARG', 'COMMA')
    stack.push({
        fn: this.value,
        fnName: this.key,
        array: []
    })
    globalStatus.status = 'ARG_FUNCTION'
    ++globalStatus.pos
    var it = globalStatus.iterator.next()
    var token = it.value
    var tokenValue = token.value
    if (tokenValue !== '(') {
        throw new Error('token `(` is expected after `' + token.key + '`')
    }
}

module.exports = FunctionToken
