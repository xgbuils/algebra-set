function ParserStatus (lexerGenerator) {
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

ParserStatus.prototype.getTokenType = function () {
    return this.token.type
}

ParserStatus.prototype.isDone = function () {
    return this.token.type === 'end'
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
