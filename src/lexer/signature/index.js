var lexer = require('../lexer.js')

module.exports = function (string, tokenCalculator) {
    return lexer(string, tokenCalculator, /(\s*)((?:[\(\[\{][\w.,\s]+[\)\]\}](?:\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*)|[a-z][_\w]*|\d+|\(|\)|,|x|\^)\s*/gi)
}
