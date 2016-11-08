var ParserToken = require('./parser-token')

function ParenthesisLeftToken (token, globalStatus) {
    ParserToken.call(this, token, globalStatus, [
    	'START_EXPR',
    	'ARG_TUPLE'
    ])
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)

ParenthesisLeftToken.prototype.nextStatus = function () {
    var globalStatus = this.globalStatus
    var status = globalStatus.status
    var stack = globalStatus.stack
    this.current.status = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARG', 'COMMA')
    stack.push({
        array: []
    })
    globalStatus.status = 'ARG_TUPLE'
    ++globalStatus.pos
}

module.exports = ParenthesisLeftToken
