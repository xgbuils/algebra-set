
function ParserToken (token, globalStatus, validStatus) {
    this.validStatus = validStatus
    this.globalStatus = globalStatus
    var stack = globalStatus.stack
    this.current = stack[globalStatus.pos]
    this.value = token.value
    this.key = token.key
    this.column = token.column
}

ParserToken.prototype.process = function () {
    var globalStatus = this.globalStatus
    if (this.validStatus.indexOf(globalStatus.status) !== -1) {
        this.nextStatus()
        return globalStatus
    } else {
        throw new Error(unexpectedToken(this))
    }
}

function unexpectedToken (token) {
    return 'Unexpected token ' + token.key + ' in column ' + token.column + '.'
}

module.exports = ParserToken
