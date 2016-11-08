var LexerTokenBuilder = require('./lexer-token-builder')

function SymbolTokenBuilder () {}

SymbolTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
SymbolTokenBuilder.prototype.constructor = SymbolTokenBuilder

SymbolTokenBuilder.prototype.build = function () {
    return this.createToken(this.key, this.key)
}

module.exports = SymbolTokenBuilder
