function ParserToken (parserStatus, validStatus) {
    this.validStatus = validStatus
    this.parserStatus = parserStatus
    var stack = this.stack = parserStatus.stack
    var token = parserStatus.token
    this.current = stack[parserStatus.pos]
    this.value = token.value
    this.key = token.key
    this.column = token.column
}

ParserToken.prototype.process = function () {
    var parserStatus = this.parserStatus

    if (this.validStatus.indexOf(parserStatus.getStatus()) !== -1) {
        parserStatus.setStatus(this.nextStatus())
        parserStatus.token = parserStatus.nextToken() || {type: 'default'}
        return parserStatus.getCurrent()
    } else {
        throw new Error('Unexpected token ' + this.key +
            ' in column ' + this.column + '.')
    }
}

module.exports = ParserToken