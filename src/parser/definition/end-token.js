var ParserToken = require('../parser-token')

function EndToken (token) {
    ParserToken.call(this, token, [
        'END_EXPR'
    ])
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

EndToken.prototype.nextStatus = function () {
}

module.exports = EndToken
