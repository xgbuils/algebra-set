function LexerTokenBuilder () {}

LexerTokenBuilder.prototype.withColumn = function (column) {
    this.column = column
    return this
}

LexerTokenBuilder.prototype.withKey = function (key) {
    this.key = key
    return this
}

LexerTokenBuilder.prototype.createToken = function (value, type) {
    return {
        value: value,
        key: this.key,
        type: type,
        column: this.column
    }
}

module.exports = LexerTokenBuilder
