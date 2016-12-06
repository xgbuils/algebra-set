var ParserStatus = require('../parser-status')
var FunctionToken = require('./function-token')
var ParenthesisLeftToken = require('./parenthesis-left-token')
var SetToken = require('./set-token.js')
var CommaToken = require('./comma-token.js')
var ParenthesisRightToken = require('./parenthesis-right-token')
var EndToken = require('./end-token')

function ParserProcessor (lexerGenerator) {
    this.parserStatus = new ParserStatus(lexerGenerator)
}

ParserProcessor.prototype.process = function () {
    var parserStatus = this.parserStatus
    var status = (new {
        'function': FunctionToken,
        'set': SetToken,
        '(': ParenthesisLeftToken,
        ')': ParenthesisRightToken,
        ',': CommaToken,
        'end': EndToken
    }[parserStatus.getTokenType()](parserStatus)).process()
    return status
}

ParserProcessor.prototype.next = function () {
    var status = this.process()
    var parserStatus = this.parserStatus
    var result
    var done = this.done
    if (!done) {
        if (parserStatus.isDone()) {
            result = parserStatus.getValue()
            this.done = true
        } else {
            result = status
        }
    }
    return {
        value: result,
        done: done
    }
}

module.exports = ParserProcessor
