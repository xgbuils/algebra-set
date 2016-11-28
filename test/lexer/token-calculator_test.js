var chai = require('chai')
var expect = chai.expect

var ExpressionTokenBuilder = require('../../src/lexer/token-builder/expression-token-builder.js')
var NumberTokenBuilder = require('../../src/lexer/token-builder/number-token-builder.js')
var SymbolTokenBuilder = require('../../src/lexer/token-builder/symbol-token-builder.js')

var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')
var TokenCalculator = require('../../src/lexer/token-calculator')

describe('lexer/TokenCalculator', function () {
    var sum
    var functions
    var sets
    var builders
    beforeEach(function () {
        sum = 'sumFn'
        functions = {
            sum: sum
        }
        sets = {}
        builders = [
            new ExpressionTokenBuilder(functions, 'function'),
            new ExpressionTokenBuilder(sets, 'set'),
            new NumberTokenBuilder(),
            new SymbolTokenBuilder()
        ]
    })

    it('with function or set key builds a function or set type token', function () {
        var tokenCalculator = new TokenCalculator(builders)
        var key = 'sum'
        var column = 3
        var token = tokenCalculator.calculate(key, column)

        expect(token).to.be.deep.equal({
            value: sum,
            type: 'function',
            key: key,
            column: column
        })
    })

    it('with numeric key builds a set type token with this singleton number set', function () {
        var tokenCalculator = new TokenCalculator(builders)
        var key = '42'
        var set = new MSet(numToInterval(Number(key)))
        var column = 6
        var token = tokenCalculator.calculate(key, column)

        expect(token).to.be.deep.equal({
            value: set,
            type: 'set',
            key: key,
            column: column
        })
    })

    it('with another type of key builds a token with the same value and type as key', function () {
        var tokenCalculator = new TokenCalculator(builders)
        var key = 'fizz-buzz'
        var column = 9
        var token = tokenCalculator.calculate(key, column)

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })
})
