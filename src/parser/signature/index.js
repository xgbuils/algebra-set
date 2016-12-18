var ParserProcessor = require('../parser-processor')

function parser (lexerGenerator, parserTokenClasses) {
    var processor = new ParserProcessor(lexerGenerator, parserTokenClasses)
    var status = processor.next()
    var value
    while (!status.done) {
        value = status.value
        status = processor.next()
    }
    return value
}

module.exports = parser
