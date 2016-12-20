var ParserToken = require('../parser-token')

function PowerToken (token) {
    ParserToken.call(this, token, [
        'NESTED_SEPARATOR_TUPLE',
        'SEPARATOR_TUPLE'
    ])
}

PowerToken.prototype = Object.create(ParserToken.prototype)
PowerToken.prototype.constructor = PowerToken

PowerToken.prototype.nextStatus = function (status) {
    return status.replace('SEPARATOR_TUPLE', 'ARGUMENT_NUMBER')
}

module.exports = PowerToken
