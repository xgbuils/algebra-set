var ParserToken = require('./parser-token')

function ParenthesisLeftToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'START_EXPR',
        'ARG_TUPLE'
    ])
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)

ParenthesisLeftToken.prototype.nextStatus = function () {
    var parserStatus = this.parserStatus
    var status = parserStatus.getStatus()
    var nextStatus = status === 'START_EXPR' ? 'END_EXPR' : status.replace('ARG', 'COMMA')
    parserStatus.push(nextStatus, {array: []})
    return 'ARG_TUPLE'
}

module.exports = ParenthesisLeftToken
