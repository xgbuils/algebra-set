var ParserStatus = require('../parser-status')
var ParenthesisLeftToken = require('./parenthesis-left-token')
var SetToken = require('./set-token.js')
var CartesianToken = require('./cartesian-token.js')
var ParenthesisRightToken = require('./parenthesis-right-token')
var PowerToken = require('./power-token')
var NumberToken = require('./number-token')
var EndToken = require('./end-token')

function ParserProcessor (lexerGenerator) {
    this.parserStatus = new ParserStatus(lexerGenerator)
}

ParserProcessor.prototype.process = function () {
    var parserStatus = this.parserStatus
    var ParserTokenConstr = {
        'set': SetToken,
        '(': ParenthesisLeftToken,
        ')': ParenthesisRightToken,
        'x': CartesianToken,
        '^': PowerToken,
        'number': NumberToken,
        'end': EndToken
    }[parserStatus.getTokenType()]
    if (ParserTokenConstr) {
        return new ParserTokenConstr(parserStatus).process()
    }
}

ParserProcessor.prototype.next = function () {
    var status = this.process()
    var done = !status
    return {
        value: done ? undefined : this.parserStatus.getValue(),
        done: done
    }
}

module.exports = ParserProcessor
