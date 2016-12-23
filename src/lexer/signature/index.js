var lexer = require('../lexer.js')
var TokenCalculator = require('../token-calculator')

module.exports = function (string, config) {
    return lexer(string, config.ignore, new TokenCalculator(string, config.creators))
}
