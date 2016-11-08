var LexerTokenBuilder = require('./lexer-token-builder')

function ExpresionTokenBuilder(functions, sets) {
    this.functions = functions
    this.sets = sets
}

ExpresionTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
ExpresionTokenBuilder.prototype.constructor = ExpresionTokenBuilder

ExpresionTokenBuilder.prototype.build = function () {
    var key = this.key
    var fn = this.functions[key]
    var set = this.sets[key]
    var value = fn || set
    if (value) {
        return this.createToken(value, fn ? 'function' : 'set')
    }
}

module.exports = ExpresionTokenBuilder
