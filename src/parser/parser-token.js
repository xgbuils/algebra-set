function ParserToken (token, validStatus, next) {
    this.validStatus = validStatus
    this.value = token.value
    this.key = token.key
    this.column = token.column
    this.type = token.type
    this._next = next.bind(this) || nextMustBeDefined
}

ParserToken.prototype.next = function (status, values, cb) {
    if (this.validStatus.indexOf(status) !== -1) {
        var nextStatus = this._next(status, values)
        return cb(nextStatus)
    } else {
        throw new Error('Unexpected token ' + this.key +
            ' in column ' + this.column + '.')
    }
}

function nextMustBeDefined () {
    throw new Error('nextStatus method must be defined')
}

ParserToken.prototype.bind = function (parserStatus) {
    this.parserStatus = parserStatus
}

module.exports = ParserToken
