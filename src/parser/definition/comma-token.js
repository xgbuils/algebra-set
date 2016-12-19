var ParserToken = require('../parser-token')

function CommaToken (token) {
    ParserToken.call(this, token, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

CommaToken.prototype = Object.create(ParserToken.prototype)
CommaToken.prototype.constructor = CommaToken

CommaToken.prototype.nextStatus = function (status, values) {
    var parserStatus = this.parserStatus
    if (status === 'COMMA_FUNCTION') {
        var fn = parserStatus.attr('fn')
        var arity = fn.arity
        if (values.length >= arity) {
            throw new Error(incorrectArity(this, parserStatus.attr('fnName'), arity))
        }
    }
    return status.replace('COMMA', 'ARG')
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = CommaToken
