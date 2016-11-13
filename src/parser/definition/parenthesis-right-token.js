var ParserToken = require('./parser-token')

function ParenthesisRightToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)

ParenthesisRightToken.prototype.nextStatus = function () {
    var parserStatus = this.parserStatus
    var status = parserStatus.getStatus()
    var current = parserStatus.getCurrent()
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
    return parserStatus.pop(value)
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = ParenthesisRightToken
