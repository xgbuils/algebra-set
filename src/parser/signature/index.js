var ParserStatus = require('../parser-status')

function parser (lexerGenerator, parserTokenClasses) {
    var parserStatus = new ParserStatus(lexerGenerator, parserTokenClasses)
    var status = parserStatus.next()
    var value
    while (!status.done) {
        value = status.value
        status = parserStatus.next()
    }
    return value
}

module.exports = parser
