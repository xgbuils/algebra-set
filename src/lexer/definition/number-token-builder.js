var LexerTokenBuilder = require('./lexer-token-builder')

function NumberTokenBuilder () {}

NumberTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
NumberTokenBuilder.prototype.constructor = NumberTokenBuilder

NumberTokenBuilder.prototype.build = function () {
    var key = this.key
    var num = Number(key)
    if (!Number.isNaN(num)) {
        return this.createToken(num, 'number')
    }
}

module.exports = NumberTokenBuilder
