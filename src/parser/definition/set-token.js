var ParserToken = require('./parser-token')

function SetToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'START_EXPR',
        'ARG_FUNCTION',
        'ARG_TUPLE'
    ])
}

SetToken.prototype = Object.create(ParserToken.prototype)
SetToken.prototype.constructor = SetToken

SetToken.prototype.nextStatus = function () {
    var parserStatus = this.parserStatus
    var status = parserStatus.getStatus()
    parserStatus.getCurrent().array.push(this.value)
    return status === 'START_EXPR'
        ? 'END_EXPR'
        : status.replace('ARG', 'COMMA')
}

module.exports = SetToken
