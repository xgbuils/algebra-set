var chai = require('chai')
var expect = chai.expect

var ExpressionTokenBuilder = require('../../src/lexer/token-builder/expression-token-builder.js')
var TransformTokenBuilder = require('../../src/lexer/token-builder/transform-token-builder.js')
var SymbolTokenBuilder = require('../../src/lexer/token-builder/symbol-token-builder.js')

var numToInterval = require('math.interval-utils').numToInterval
var rawSet = require('math.set/src/raw-set')
var MSet = require('math.set')
var TokenCalculator = require('../../src/lexer/token-calculator')

function createColumns (keys, whiteSpaces) {
    var col = 1
    var columns = []
    for (var i = 0; i < keys.length; ++i) {
        columns.push(col)
        col += keys[i].length + whiteSpaces.length
    }
    return columns
}

describe('lexer/TokenCalculator (definition)', function () {
    var sum
    var functions
    var sets
    var keys
    var columns
    var string
    var whiteSpaces = '  '
    var creators
    beforeEach(function () {
        keys = ['sum', '42.3', ',', 'fizz-buzz']
        columns = createColumns(keys, whiteSpaces)
        string = keys.join(whiteSpaces)
        sum = 'sumFn'
        functions = {
            sum: sum
        }
        sets = {}
        creators = [{
            regexp: /\w+/,
            builder: [
                new ExpressionTokenBuilder(functions, 'function'),
                new ExpressionTokenBuilder(sets, 'set')
            ]
        }, {
            regexp: /\d+\.\w*/,
            builder: new TransformTokenBuilder(function (key) {
                return MSet(numToInterval(Number(key)))
            }, 'set')
        }, {
            regexp: /[,()]/,
            builder: new SymbolTokenBuilder()
        }]
    })

    it('with function or set key builds a function or set type token', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[0]
        var column = columns[0]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: sum,
            type: 'function',
            key: key,
            column: column
        })
    })

    it('with numeric key, it builds a set type token with this singleton number set', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[1]
        var set = new MSet(numToInterval(Number(key)))
        var column = columns[1]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: set,
            type: 'set',
            key: key,
            column: column
        })
    })

    it('with symbol type of key, it builds a token with the same value and type as key', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[2]
        var column = columns[2]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })

    it('with another type of key, it builds a token with the same value and type as key', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[3]
        var column = columns[3]

        function test () {
            tokenCalculator.calculate(column)
        }

        expect(test).to.throw('Unexpected `' + key + '` in column ' + column + '.')
    })
})

describe('lexer/TokenCalculator (signature)', function () {
    var sets
    var keys
    var columns
    var string
    var whiteSpaces = '  '
    var creators
    beforeEach(function () {
        keys = ['R', '{1, 3, 4} U [3, 5]', '231', 'x', 'fizz-buzz']
        columns = createColumns(keys, whiteSpaces)
        string = keys.join(whiteSpaces)
        sets = {
            R: 'R'
        }
        creators = [{
            regexp: /\w+/,
            builder: new ExpressionTokenBuilder(sets, 'set')
        }, {
            regexp: /[\(\[\{][\w.,\s]+[\)\]\}](\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*/,
            builder: new TransformTokenBuilder(function (key) {
                return new MSet(key)
            }, 'set')
        }, {
            regexp: /\d+/,
            builder: new TransformTokenBuilder(parseInt, 'integer')
        }, {
            regexp: /[x()^]/,
            builder: new SymbolTokenBuilder()
        }]
    })

    it('with set expression key, it builds a set type token', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[0]
        var column = columns[0]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: key,
            type: 'set',
            key: key,
            column: column
        })
    })

    it('with castable to real set key, it builds a set type', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[1]
        var set = new MSet(key)
        var column = columns[1]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: set,
            type: 'set',
            key: key,
            column: column
        })

        expect(rawSet(token.value)).to.be.deep.equal(rawSet(set))
    })

    it('with integer key, it builds a integer type', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[2]
        var num = Number(key)
        var column = columns[2]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: num,
            type: 'integer',
            key: key,
            column: column
        })
    })

    it('with symbol key, it builds a integer type', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[3]
        var column = columns[3]
        var token = tokenCalculator.calculate(column)

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })

    it('with another type of key, it builds a token with the same value and type as key', function () {
        var tokenCalculator = new TokenCalculator(string, creators)
        var key = keys[4]
        var column = columns[4]

        function test () {
            tokenCalculator.calculate(column)
        }

        expect(test).to.throw('Unexpected `' + key + '` in column ' + column + '.')
    })
})
