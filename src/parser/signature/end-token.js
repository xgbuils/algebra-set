var ParserToken = require('../parser-token')

function EndToken (token) {
    ParserToken.call(this, token, [
        'END_EXPR',
        'COMMA_TUPLE',
        'NESTED_COMMA_TUPLE'
    ])
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

EndToken.prototype.nextStatus = function () {
    var array = this.parserStatus.pop()
    this.parserStatus.addValue(array)
    return true
}

module.exports = EndToken
