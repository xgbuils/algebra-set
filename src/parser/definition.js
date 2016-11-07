var lexer = require('../lexer/definition.js')
var FunctionToken = require('../parser/definition/function-token.js')
var ParenthesisLeftToken = require('../parser/definition/parenthesis-left-token.js')
var SetToken = require('../parser/definition/set-token.js')
var CommaToken = require('../parser/definition/comma-token.js')
var ParenthesisRightToken = require('../parser/definition/parenthesis-right-token.js')

function parser (string, functions, sets) {
    var iterator = lexer(string, functions, sets).build()()
    var it = iterator.next()
    if (it.done) {
        throw new Error('empty string')
    }
    var globalStatus = {
        pos: 0,
        stack: [{}],
        status: 'START_EXPR',
        iterator: iterator
    }
    do {
        var token = it.value
        var tokenValue = token.value

        if (token.type === 'function') {
            (new FunctionToken(token, globalStatus)).process()
        } else if (tokenValue === '(') {
            (new ParenthesisLeftToken(token, globalStatus)).process()
        } else if (token.type === 'set') {
            (new SetToken(token, globalStatus)).process()
        } else if (tokenValue === ',') {
            (new CommaToken(token, globalStatus)).process()
        } else if (tokenValue === ')') {
            (new ParenthesisRightToken(token, globalStatus)).process()
        }
        it = globalStatus.iterator.next()
    } while (!it.done && globalStatus.pos > 0 && globalStatus.status !== 'END_EXPR')
    if (it.done && (globalStatus.status === 'END_EXPR') || globalStatus.pos === 0) {
        return globalStatus.stack[globalStatus.pos].array
    }
}

module.exports = parser
