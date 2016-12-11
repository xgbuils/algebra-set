function ParserToken (parserStatus, validStatus) {
    this.validStatus = validStatus
    this.parserStatus = parserStatus
    var token = parserStatus.token
    this.value = token.value
    this.key = token.key
    this.column = token.column
    this.type = token.type
}

ParserToken.prototype.process = function () {
    var parserStatus = this.parserStatus
    var current = currentStatus(parserStatus)
    var status = current.status
    if (this.validStatus.indexOf(status) !== -1) {
        var nextStatus = this.nextStatus(status, current)
        updateStatus(parserStatus, nextStatus, current)
        return nextStatus
    } else {
        throw new Error('Unexpected token ' + this.key +
            ' in column ' + this.column + '.')
    }
}

function currentStatus (parserStatus) {
    return parserStatus.stack[parserStatus.pos]
}

function updateStatus (parserStatus, nextStatus, current) {
    current = currentStatus(parserStatus)
    current.status = nextStatus
    var it = parserStatus.iterator.next()
    parserStatus.done = it.done
    parserStatus.token = (parserStatus.value = it.value)
}

module.exports = ParserToken
