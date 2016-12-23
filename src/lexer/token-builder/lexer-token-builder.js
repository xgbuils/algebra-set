function LexerTokenBuilder (cb) {
    this.cb = cb
}

LexerTokenBuilder.prototype.withColumn = function (column) {
    this.column = column
    return this
}

LexerTokenBuilder.prototype.withKey = function (key) {
    this.key = key
    return this
}

LexerTokenBuilder.prototype.build = function () {
    var key = this.key
    if (key) {
        return this.cb(key, create.bind(this))
    }
}

function create (value, type) {
    return {
        value: value,
        key: this.key,
        type: type,
        column: this.column
    }
}

module.exports = LexerTokenBuilder
