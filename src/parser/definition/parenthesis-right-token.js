var ParserToken = require('../parser-token')

function ParenthesisRightToken (token) {
    ParserToken.call(this, token, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

ParenthesisRightToken.prototype.nextStatus = function (status, values) {
    var parserStatus = this.parserStatus
    var value
    if (status === 'COMMA_FUNCTION') {
        var fn = parserStatus.attr('fn')
        if (values.length < fn.arity) {
            throw new Error(incorrectArity(this, parserStatus.attr('fnName'), fn.arity))
        }
        var domain = values
        fn.domain = domain
        value = fn.image
    } else {
        value = values
    }
    parserStatus.pop()
    parserStatus.addValue(value)
    return parserStatus.currentStatus()
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = ParenthesisRightToken
