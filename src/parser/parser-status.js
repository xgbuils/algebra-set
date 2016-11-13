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
}

ParserStatus.prototype.push = function (status, objStatus) {
    var stack = this.stack
    stack[this.pos].status = status
    stack.push(objStatus)
    ++this.pos
}

ParserStatus.prototype.pop = function (value) {
    var stack = this.stack
    stack.pop()
    --this.pos
    var current = stack[this.pos]
    current.array.push(value)
    return current.status
}

ParserStatus.prototype.getCurrent = function () {
    return this.stack[this.pos]
}

ParserStatus.prototype.setStatus = function (status) {
    this.getCurrent().status = status
}

ParserStatus.prototype.getStatus = function () {
    return this.getCurrent().status
}

ParserStatus.prototype.getToken = function () {
    return this.token
}

ParserStatus.prototype.nextToken = function () {
    var it = this.iterator.next()
    this.done = it.done
    return this.value = it.value
}

ParserStatus.prototype.isDone = function () {
    return this.done && this.getStatus() === 'END_EXPR'
}

module.exports = ParserStatus
