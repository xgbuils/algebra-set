var ParserToken = require('../parser-token')

function ParenthesisRightToken (token) {
    ParserToken.call(this, token, [
        'NESTED_COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

ParenthesisRightToken.prototype.nextStatus = function (status, values) {
    var parserStatus = this.parserStatus
    parserStatus.pop()
    parserStatus.addValue(values)
    return parserStatus.currentStatus()
}

module.exports = ParenthesisRightToken
