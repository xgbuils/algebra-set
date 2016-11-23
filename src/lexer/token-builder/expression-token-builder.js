var LexerTokenBuilder = require('./lexer-token-builder')

function ExpresionTokenBuilder (expressions, type) {
    this.expressions = expressions
    this.type = type
}

ExpresionTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
ExpresionTokenBuilder.prototype.constructor = ExpresionTokenBuilder

ExpresionTokenBuilder.prototype.build = function () {
    var value = this.expressions[this.key]
    if (value) {
        return this.createToken(value, this.type)
    }
}

module.exports = ExpresionTokenBuilder
