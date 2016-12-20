var ParserToken = require('../parser-token')

function CartesianToken (token) {
    ParserToken.call(this, token, [
        'NESTED_SEPARATOR_TUPLE',
        'SEPARATOR_TUPLE'
    ])
}

CartesianToken.prototype = Object.create(ParserToken.prototype)
CartesianToken.prototype.constructor = CartesianToken

CartesianToken.prototype.nextStatus = function (status) {
    return status.substring(0, 6) === 'NESTED'
        ? 'NESTED_ARGUMENT_TUPLE'
        : 'ARGUMENT_TUPLE'
}

module.exports = CartesianToken
