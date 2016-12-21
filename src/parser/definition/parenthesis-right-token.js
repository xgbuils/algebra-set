var ParserToken = require('parser.token')

function ParenthesisRightToken (token) {
    ParserToken.call(this, token, [
        'SEPARATOR_FUNCTION',
        'SEPARATOR_TUPLE'
    ], next)
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

function next (status, values) {
    var parserStatus = this.parserStatus
    var value
    var fn = parserStatus.get('fn')
    if (fn) {
        if (values.length < fn.arity) {
            throw new Error(incorrectArity(this, parserStatus.get('fnName'), fn.arity))
        }
        var domain = values
        fn.domain = domain
        value = fn.image
    } else {
        value = values
    }
    parserStatus.pop()
    parserStatus.addValue(value)
    return parserStatus.getStatus()
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = ParenthesisRightToken
