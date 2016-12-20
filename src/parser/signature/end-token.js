var ParserToken = require('../parser-token')

function EndToken (token) {
    ParserToken.call(this, token, [
        'END_EXPR',
        'SEPARATOR_TUPLE',
        'NESTED_SEPARATOR_TUPLE'
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
