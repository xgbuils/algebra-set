var ParserStatus = require('../parser-status')
var FunctionToken = require('./function-token')
var ParenthesisLeftToken = require('./parenthesis-left-token.js')
var SetToken = require('./set-token.js')
var CommaToken = require('./comma-token.js')
var ParenthesisRightToken = require('./parenthesis-right-token.js')

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
        'default': function () {
            return {
                process: function () {
                    return {done: true}
                }
            }
        }
    }[parserStatus.getToken().type](parserStatus)).process()
    return status
}

ParserProcessor.prototype.next = function () {
    var status = this.process()
    var parserStatus = this.parserStatus
    var result
    var done = this.done
    if (!done) {
        if (parserStatus.isDone()) {
            result = parserStatus.getCurrent().array[0]
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
