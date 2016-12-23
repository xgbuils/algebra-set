var LexerTokenBuilder = require('./lexer-token-builder')
var MSet = require('math.set')

function SetTokenBuilder () {
    LexerTokenBuilder.call(this, function (key, create) {
        try {
            var set = new MSet(key)
            return create(set, 'set')
        } catch (e) {
            return
        }
    })
}

SetTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
SetTokenBuilder.prototype.constructor = SetTokenBuilder

module.exports = SetTokenBuilder
