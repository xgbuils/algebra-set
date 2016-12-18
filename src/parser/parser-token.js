function ParserToken (token, validStatus) {
    this.validStatus = validStatus
    this.value = token.value
    this.key = token.key
    this.column = token.column
    this.type = token.type
}

ParserToken.prototype.bind = function (parserStatus) {
    this.parserStatus = parserStatus
}

module.exports = ParserToken
