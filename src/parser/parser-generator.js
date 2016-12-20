function ParserGenerator (lexerGenerator, parserTokenClasses) {
    if (!(this instanceof ParserGenerator)) {
        return new ParserGenerator(lexerGenerator, parserTokenClasses)
    }
    this.parserTokenClasses = parserTokenClasses
    this.pos = 0
    this.stack = [{
        array: [],
        status: 'START_EXPR',
        attributes: {}
    }]
    this.iterator = lexerGenerator()
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
        status = doNextStatus(this, token)
    }
    var done = !status
    return {
        value: done ? undefined : getValue(this),
        done: done
    }
}

function nextToken (parserStatus) {
    var it = parserStatus.iterator.next()
    parserStatus.done = it.done
    parserStatus.token = it.value
    var rawToken = parserStatus.token || {}
    var ParserTokenConstr = parserStatus.parserTokenClasses[rawToken.type]
    if (ParserTokenConstr) {
        var token = new ParserTokenConstr(rawToken)
        return token
    }
}

function doNextStatus (parserStatus, token) {
    var current = currentStatus(parserStatus)
    token.bind(parserStatus)
    return token.next(current.status, current.array, function (nextStatus) {
        return currentStatus(parserStatus).status = nextStatus
    })
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
