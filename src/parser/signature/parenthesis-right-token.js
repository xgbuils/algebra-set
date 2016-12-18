var ParserToken = require('../parser-token')

function ParenthesisRightToken (token) {
    ParserToken.call(this, token, [
        'NESTED_COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

ParenthesisRightToken.prototype.nextStatus = function (status, current) {
    var parserStatus = this.parserStatus
    var nextStatus = parserStatus.pop()
    parserStatus.addValue(current.array)
    return nextStatus
}

module.exports = ParenthesisRightToken
