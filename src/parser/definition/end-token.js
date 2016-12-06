var ParserToken = require('./parser-token')

function EndToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'END_EXPR'
    ])
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

EndToken.prototype.nextStatus = function (status) {
    return status
}

module.exports = EndToken
