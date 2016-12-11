var ParserToken = require('../parser-token')

function CartesianToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'NESTED_COMMA_TUPLE',
        'COMMA_TUPLE',
        'NESTED_POWER_NUMBER',
        'POWER_NUMBER'
    ])
}

CartesianToken.prototype = Object.create(ParserToken.prototype)
CartesianToken.prototype.constructor = CartesianToken

CartesianToken.prototype.nextStatus = function (status) {
    return status.substring(0, 6) === 'NESTED'
        ? 'NESTED_ARG_TUPLE'
        : 'ARG_TUPLE'
}

module.exports = CartesianToken
