var ParserProcessor = require('./definition/parser-processor')

function parser (string, functions, sets) {
    var processor = new ParserProcessor(string, functions, sets)
    var status = processor.next()
    var value
    while (!status.done) {
        value = status.value
        status = processor.next()
    }
    return value
}

module.exports = parser
