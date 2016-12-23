var LexerTokenBuilder = require('./lexer-token-builder')

function IntegerTokenBuilder () {
    LexerTokenBuilder.call(this, function (key, create) {
        return create(Number(key), 'integer')
    })
}

IntegerTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
IntegerTokenBuilder.prototype.constructor = IntegerTokenBuilder

module.exports = IntegerTokenBuilder
