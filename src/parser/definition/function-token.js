var ParserToken = require('../parser-token')

function FunctionToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'ARGUMENT_FUNCTION',
        'ARGUMENT_TUPLE'
    ], next)
}

FunctionToken.prototype = Object.create(ParserToken.prototype)
FunctionToken.prototype.constructor = FunctionToken

function next (status) {
    this.parserStatus.prepare({
        fn: this.value,
        fnName: this.key
    })
    return status
}

module.exports = FunctionToken
