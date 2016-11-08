var ParserToken = require('./parser-token')

function CommaToken (token, globalStatus) {
    ParserToken.call(this, token, globalStatus, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

CommaToken.prototype = Object.create(ParserToken.prototype)

CommaToken.prototype.nextStatus = function () {
    var globalStatus = this.globalStatus
    var status = globalStatus.status
    var current = this.current
    if (status === 'COMMA_FUNCTION') {
        var arity = current.fn.arity
        if (current.array.length >= arity) {
            throw new Error(incorrectArity(this, current.fnName, arity))
        }
    }
    globalStatus.status = status.replace('COMMA', 'ARG')
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = CommaToken
