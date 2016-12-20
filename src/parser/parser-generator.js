function ParserGenerator (lexerGenerator, parserTokenClasses) {
    if (!(this instanceof ParserGenerator)) {
        return new ParserGenerator(lexerGenerator, parserTokenClasses)
    }
    this.parserTokenClasses = parserTokenClasses
    var iterator = lexerGenerator()
    var it = iterator.next()
    var done = it.done
    if (done) {
        throw new Error('empty string')
    }
    this.pos = 0
    this.stack = [{
        array: [],
        status: 'START_EXPR',
        attributes: {}
    }]
    this.iterator = iterator
    this.token = it.value
    this.done = done
    this.toPush = {}
}

ParserGenerator.prototype.push = function (status) {
    var stack = this.stack
    stack[this.pos].status = status
    stack.push({
        array: [],
        attributes: this.toPush
    })
    this.toPush = {}
    ++this.pos
}

ParserGenerator.prototype.pop = function () {
    var stack = this.stack
    var current = stack.pop()
    --this.pos
    this.toPush = {}
    return current.array
}

ParserGenerator.prototype.prepare = function (obj) {
    extend(this.toPush, obj)
}

ParserGenerator.prototype.prepared = function (key) {
    return this.toPush[key]
}

ParserGenerator.prototype.attr = function (key) {
    return currentStatus(this).attributes[key]
}

ParserGenerator.prototype.addValue = function (value) {
    currentStatus(this).array.push(value)
}

ParserGenerator.prototype.currentStatus = function () {
    return currentStatus(this).status
}

ParserGenerator.prototype.next = function () {
    var token = nextToken(this)
    var status
    if (token) {
        status = nextStatus(this, token)
    }
    var done = !status
    return {
        value: done ? undefined : getValue(this),
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
        var nextStatus = token.nextStatus(status, current.array)
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
    parserStatus.token = it.value
    return nextStatus
}

function currentStatus (parserStatus) {
    return parserStatus.stack[parserStatus.pos]
}

function getValue (parserStatus) {
    return currentStatus(parserStatus).array[0]
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

module.exports = ParserGenerator
