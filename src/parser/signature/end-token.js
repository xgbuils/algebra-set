var ParserToken = require('parser.token')

function EndToken (token) {
    ParserToken.call(this, token, [
        'END_EXPR',
        'SEPARATOR_TUPLE',
        'NESTED_SEPARATOR_TUPLE'
    ], next)
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

function next () {
    var parserStatus = this.parserStatus
    var array = parserStatus.pop()
    parserStatus.addValue(array)
    return true
}

module.exports = EndToken
