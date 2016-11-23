var LexerTokenBuilder = require('./lexer-token-builder')
var MSet = require('math.set')

function SetTokenBuilder () {}

SetTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
SetTokenBuilder.prototype.constructor = SetTokenBuilder

SetTokenBuilder.prototype.build = function () {
    try {
        var set = new MSet(this.key)
        return this.createToken(set, 'set')
    } catch (e) {
        return
    }
}

module.exports = SetTokenBuilder
