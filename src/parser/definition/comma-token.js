var ParserToken = require('../parser-token')

function CommaToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

CommaToken.prototype = Object.create(ParserToken.prototype)
CommaToken.prototype.constructor = CommaToken

CommaToken.prototype.nextStatus = function (status, current) {
    if (status === 'COMMA_FUNCTION') {
        var arity = current.fn.arity
        if (current.array.length >= arity) {
            throw new Error(incorrectArity(this, current.fnName, arity))
        }
    }
    return status.replace('COMMA', 'ARG')
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = CommaToken
