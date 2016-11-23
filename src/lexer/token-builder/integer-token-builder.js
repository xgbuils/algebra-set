var LexerTokenBuilder = require('./lexer-token-builder')

function IntegerTokenBuilder () {}

IntegerTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
IntegerTokenBuilder.prototype.constructor = IntegerTokenBuilder

IntegerTokenBuilder.prototype.build = function () {
    var key = this.key
    var num = parseInt(key)
    if (num === Number(key)) {
        return this.createToken(num, 'number')
    }
}

module.exports = IntegerTokenBuilder
