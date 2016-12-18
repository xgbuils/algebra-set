var ParserStatus = require('./parser-status')

function ParserProcessor (lexerGenerator, parserTokenClasses) {
    this.parserStatus = new ParserStatus(lexerGenerator)
    this.parserTokenClasses = parserTokenClasses
}

ParserProcessor.prototype.process = function () {
    var parserStatus = this.parserStatus
    var ParserTokenConstr = this.parserTokenClasses[parserStatus.getTokenType()]
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
