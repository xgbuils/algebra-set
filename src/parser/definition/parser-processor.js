var lexer = require('../../lexer/definition/')
var FunctionToken = require('./function-token.js')
var ParenthesisLeftToken = require('./parenthesis-left-token.js')
var SetToken = require('./set-token.js')
var CommaToken = require('./comma-token.js')
var ParenthesisRightToken = require('./parenthesis-right-token.js')

function ParserProcessor (string, functions, sets) {
    var iterator = lexer(string, functions, sets).build()()
    var it = this.it = iterator.next()
    this.done = false
    if (it.done) {
        throw new Error('empty string')
    }
    this.globalStatus = {
        pos: 0,
        stack: [{}],
        status: 'START_EXPR',
        iterator: iterator
    }
}

ParserProcessor.prototype.process = function () {
    var it = this.it
    if (it.done) {
        return {}
    }
    var token = it.value
    var globalStatus = this.globalStatus
    var status = (new {
        'function': FunctionToken,
        'set': SetToken,
        '(': ParenthesisLeftToken,
        ')': ParenthesisRightToken,
        ',': CommaToken
    }[token.type](token, globalStatus)).process()
    this.it = globalStatus.iterator.next()
    return status
}

ParserProcessor.prototype.next = function () {
    var globalStatus = this.process()
    var pos = globalStatus.pos
    var result
    var done = this.done
    if (!done) {
        if (this.it.done && (globalStatus.status === 'END_EXPR' || pos === 0)) {
            result = globalStatus.stack[pos].array
            this.done = true
        } else {
            result = globalStatus
        }
    }
    return {
        value: result,
        done: done
    }
}

module.exports = ParserProcessor
