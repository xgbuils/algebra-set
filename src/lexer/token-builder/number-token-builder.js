var LexerTokenBuilder = require('./lexer-token-builder')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')

function NumberTokenBuilder () {
    LexerTokenBuilder.call(this, function (key, create) {
        var num = Number(key)
        return create(new MSet(numToInterval(num)), 'set')
    })
}

NumberTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
NumberTokenBuilder.prototype.constructor = NumberTokenBuilder

module.exports = NumberTokenBuilder
