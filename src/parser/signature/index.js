var ParserProcessor = require('./parser-processor')

function parser (lexerGenerator) {
    var processor = new ParserProcessor(lexerGenerator)
    var status = processor.next()
    var value
    while (!status.done) {
        value = status.value
        status = processor.next()
    }
    return value
}

module.exports = parser
