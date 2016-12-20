var parserGenerator = require('./parser-generator')

function parser (lexerGenerator, parserTokenClasses) {
    var iterator = parserGenerator(lexerGenerator, parserTokenClasses)
    var status = iterator.next()
    var value
    while (!status.done) {
        value = status.value
        status = iterator.next()
    }
    return value
}

module.exports = parser
