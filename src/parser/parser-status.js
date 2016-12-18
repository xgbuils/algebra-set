function ParserStatus (lexerGenerator, parserTokenClasses) {
    this.parserTokenClasses = parserTokenClasses
    var iterator = lexerGenerator()
    var it = iterator.next()
    var token = it.value
    var done = it.done
    if (done) {
        throw new Error('empty string')
    }
    this.pos = 0
    this.stack = [{
        array: [],
        status: 'START_EXPR'
    }]
    this.iterator = iterator
    this.token = token
    this.done = done
    this.memo = {}
}

ParserStatus.prototype.push = function (status) {
    var stack = this.stack
    stack[this.pos].status = status
    stack.push(extend({
        array: []
    }, this.memo))
    this.memo = {}
    ++this.pos
}

ParserStatus.prototype.pop = function () {
    var stack = this.stack
    stack.pop()
    --this.pos
    this.memo = {}
    return stack[this.pos].status
}

ParserStatus.prototype.save = function (obj) {
    extend(this.memo, obj)
}

ParserStatus.prototype.addValue = function (value) {
    currentStatus(this).array.push(value)
}

ParserStatus.prototype.getValue = function () {
    return currentStatus(this).array[0]
}

ParserStatus.prototype.next = function () {
    var token = nextToken(this)
    var status
    if (token) {
        status = nextStatus(this, token)
    }
    var done = !status
    return {
        value: done ? undefined : this.getValue(),
        done: done
    }
}

function nextToken (parserStatus) {
    var rawToken = parserStatus.token || {}
    var ParserTokenConstr = parserStatus.parserTokenClasses[rawToken.type]
    if (ParserTokenConstr) {
        var token = new ParserTokenConstr(rawToken)
        return token
    }
}

function nextStatus (parserStatus, token) {
    var current = currentStatus(parserStatus)
    var status = current.status
    if (token.validStatus.indexOf(status) !== -1) {
        token.bind(parserStatus)
        var nextStatus = token.nextStatus(status, current)
        return updateStatus(parserStatus, nextStatus)
    } else {
        throw new Error('Unexpected token ' + token.key +
            ' in column ' + token.column + '.')
    }
}

function updateStatus (parserStatus, nextStatus) {
    var current = currentStatus(parserStatus)
    current.status = nextStatus
    var it = parserStatus.iterator.next()
    parserStatus.done = it.done
    parserStatus.token = (parserStatus.value = it.value)
    return nextStatus
}

function currentStatus (parserStatus) {
    return parserStatus.stack[parserStatus.pos]
}

function extend (source, obj) {
    source = source || {}
    for (var key in obj) {
        if (obj[key]) {
            source[key] = obj[key]
        }
    }
    return source
}

module.exports = ParserStatus
