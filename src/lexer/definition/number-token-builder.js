var LexerTokenBuilder = require('./lexer-token-builder')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')

function NumberTokenBuilder () {}

NumberTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
NumberTokenBuilder.prototype.constructor = NumberTokenBuilder

NumberTokenBuilder.prototype.build = function () {
    var key = this.key
    var num = Number(key)
    if (!Number.isNaN(num)) {
        return this.createToken(new MSet(numToInterval(num)), 'set')
    }
}

module.exports = NumberTokenBuilder
