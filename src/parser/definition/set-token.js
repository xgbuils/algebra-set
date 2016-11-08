var ParserToken = require('./parser-token')

function SetToken (token, globalStatus) {
    ParserToken.call(this, token, globalStatus, [
        'START_EXPR',
        'ARG_FUNCTION',
        'ARG_TUPLE'
    ])
}

SetToken.prototype = Object.create(ParserToken.prototype)

SetToken.prototype.nextStatus = function () {
    var globalStatus = this.globalStatus
    var status = globalStatus.status
    var current = this.current
    if (status === 'START_EXPR') {
        globalStatus.status = 'END_EXPR'
        current.array = this.value
    } else {
        globalStatus.status = status.replace('ARG', 'COMMA')
        this.current.array.push(this.value)
    }
}

module.exports = SetToken
