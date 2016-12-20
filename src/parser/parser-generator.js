function ParserGenerator (lexerGenerator, parserTokenClasses) {
    if (!(this instanceof ParserGenerator)) {
        return new ParserGenerator(lexerGenerator, parserTokenClasses)
    }
    this.parserTokenClasses = parserTokenClasses
    this.iterator = lexerGenerator()
    this.parserStatus = parserStatus()
}

ParserGenerator.prototype.next = function () {
    var token = nextToken(this)
    var status
    if (token) {
        status = doNextStatus(this.parserStatus, token)
    }
    var done = !status
    return {
        value: done ? undefined : this.parserStatus.getArray()[0],
        done: done
    }
}

function parserStatus () {
    var obj = {}
    var pos = 0
    var stack = [{
        array: [],
        status: 'START_EXPR',
        attributes: {}
    }]
    var toPushAttributes = {}
    var set = function (key, value) {
        setAttributes(stack[pos].attributes, key, value)
    }
    var get = function (key) {
        return getAttributes(stack[pos].attributes, key)
    }
    set.to = {
        push: function (key, value) {
            setAttributes(toPushAttributes, key, value)
        }
    }
    get.to = {
        push: function (key) {
            return getAttributes(toPushAttributes, key)
        }
    }
    obj.set = set
    obj.get = get
    obj.addValue = function (value) {
        stack[pos].array.push(value)
    }
    obj.getStatus = function () {
        return stack[pos].status
    }
    obj.getArray = function () {
        return stack[pos].array
    }
    obj.setStatus = function (newStatus) {
        stack[pos].status = newStatus
    }
    obj.push = function (status) {
        stack[pos].status = status
        stack.push({
            array: [],
            attributes: toPushAttributes
        })
        toPushAttributes = {}
        ++pos
    }
    obj.pop = function () {
        var current = stack.pop()
        --pos
        toPushAttributes = {}
        return current.array
    }
    return obj
}

function setAttributes (attributes, key, value) {
    var obj = {}
    if (typeof key === 'string') {
        obj[key] = value
    } else {
        obj = key
    }
    extend(attributes, obj)
}

function getAttributes (attributes, key) {
    if (typeof key === 'string') {
        return attributes[key]
    }
}

function nextToken (parserIterator) {
    var it = parserIterator.iterator.next()
    parserIterator.done = it.done
    parserIterator.token = it.value
    var rawToken = parserIterator.token || {}
    var ParserTokenConstr = parserIterator.parserTokenClasses[rawToken.type]
    if (ParserTokenConstr) {
        var token = new ParserTokenConstr(rawToken)
        return token
    }
}

function doNextStatus (parserStatus, token) {
    var status = parserStatus.getStatus()
    var array = parserStatus.getArray()
    token.bind(parserStatus)
    return token.next(status, array, function (nextStatus) {
        parserStatus.setStatus(nextStatus)
        return nextStatus
    })
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
