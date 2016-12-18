var ParserToken = require('../parser-token')

function CartesianToken (token) {
    ParserToken.call(this, token, [
        'NESTED_COMMA_TUPLE',
        'COMMA_TUPLE'
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
