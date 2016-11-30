var lexer = require('../lexer.js')

module.exports = function (string, tokenCalculator) {
    return lexer(string, tokenCalculator, /(\s*)(\w+|\(|\)|,)\s*/gi)
}
