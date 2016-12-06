var ParserToken = require('./parser-token')

function EndToken (parserStatus) {
    ParserToken.call(this, parserStatus, [
        'END_EXPR'
    ])
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

EndToken.prototype.process = function () {
    return {
    	done: true
    }
}

module.exports = EndToken
