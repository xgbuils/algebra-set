var ParserToken = require('./parser-token')

function ParenthesisRightToken (token, globalStatus) {
    ParserToken.call(this, token, globalStatus, [
        'COMMA_FUNCTION',
        'COMMA_TUPLE'
    ])
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)

ParenthesisRightToken.prototype.nextStatus = function () {
    var globalStatus = this.globalStatus
    var stack = globalStatus.stack
    var status = globalStatus.status
    var current = this.current
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
    stack.pop()
    --globalStatus.pos
    current = stack[globalStatus.pos]
    array = current.array
    if (array) {
        array.push(value)
    } else {
        current.array = value
    }
    globalStatus.status = current.status
}

function incorrectArity (token, fnName, arity) {
    return 'Expected token `,` instead `)` in column ' + token.column + '. `' +
        fnName + '` arity must be ' + arity + '.'
}

module.exports = ParenthesisRightToken
