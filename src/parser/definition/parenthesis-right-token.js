var ParserToken = require('./parser-token')

function ParenthesisRightToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

ParenthesisRightToken.prototype.nextStatus = function (status, current) {
    var parserStatus = this.parserStatus
    var array = current.array
    var value
    if (status === 'COMMA_FUNCTION') {
        var fn = current.fn
        if (array.length < fn.arity) {
            throw new Error(incorrectArity(this, current.fnName, fn.arity))
        }
        var domain = array
        fn.domain = domain
        value = fn.image
    } else {
        value = array
    }
    var nextStatus = parserStatus.pop()
    parserStatus.addValue(value)
    return nextStatus
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = ParenthesisRightToken
