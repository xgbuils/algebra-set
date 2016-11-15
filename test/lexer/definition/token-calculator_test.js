var chai = require('chai')
var expect = chai.expect
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')
var TokenCalculator = require('../../../src/lexer/definition/token-calculator')

describe('lexer/definition/TokenCalculator', function () {
    var sum
    var functions
    var sets
    beforeEach(function () {
        sum = 'sumFn'
        functions = {
            sum: sum
        }
        sets = {}
    })

    it('with function or set key builds a function or set type token', function () {
        var tokenCalculator = new TokenCalculator(functions, sets)
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
        var tokenCalculator = new TokenCalculator(functions, sets)
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
        var tokenCalculator = new TokenCalculator(functions, sets)
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
