var ParserToken = require('../parser-token')

function CommaToken (token) {
    ParserToken.call(this, token, [
        'SEPARATOR_FUNCTION',
        'SEPARATOR_TUPLE'
    ])
}

CommaToken.prototype = Object.create(ParserToken.prototype)
CommaToken.prototype.constructor = CommaToken

CommaToken.prototype.nextStatus = function (status, values) {
    var parserStatus = this.parserStatus
    if (status === 'SEPARATOR_FUNCTION') {
        var fn = parserStatus.attr('fn')
        var arity = fn.arity
        if (values.length >= arity) {
            throw new Error(incorrectArity(this, parserStatus.attr('fnName'), arity))
        }
    }
    return status.replace('SEPARATOR', 'ARGUMENT')
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = CommaToken
