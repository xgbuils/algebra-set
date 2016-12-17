var ParserToken = require('../parser-token')

function PowerToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'NESTED_COMMA_TUPLE',
        'COMMA_TUPLE'
    ])
}

PowerToken.prototype = Object.create(ParserToken.prototype)
PowerToken.prototype.constructor = PowerToken

PowerToken.prototype.nextStatus = function (status) {
    return status.replace('COMMA_TUPLE', 'ARG_NUMBER')
}

module.exports = PowerToken
