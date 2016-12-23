var exec = require('../regexp-utils/exec')
var checkMatch = require('../regexp-utils/check-match')
var toGlobal = require('../regexp-utils/to-global')

function LexerTokenBuilder (cb) {
    this.cb = cb
}

LexerTokenBuilder.prototype.withColumn = function (column) {
    this.column = column
    return this
}

LexerTokenBuilder.prototype.withString = function (string) {
    this.string = string
    return this
}

LexerTokenBuilder.prototype.withRegExp = function (regexp) {
    this.regexp = toGlobal(regexp)
    return this
}

LexerTokenBuilder.prototype.build = function () {
    var regexp = this.regexp
    var column = this.column - 1
    var key = this.key = exec(regexp, this.string, column)
    if (checkMatch(key, regexp, column)) {
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
