var chai = require('chai')
var expect = chai.expect
var ExpressionTokenBuilder = require('../../../src/lexer/definition/expression-token-builder')

describe('lexer/definition/ExpressionTokenBuilder', function () {
    var sum
    var a
    var functions
    var sets
    beforeEach(function () {
        sum = 'sumFn'
        a = '{1}'
        functions = {
            sum: sum
        }
        sets = {
            a: a
        }
    })

    it('with function key builds a function type token', function () {
        var expressionTokenBuilder = new ExpressionTokenBuilder(functions, sets)
        var key = 'sum'
        var column = 8
        var token = expressionTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: sum,
            type: 'function',
            key: key,
            column: column
        })
    })

    it('with set key builds a set type token', function () {
        var expressionTokenBuilder = new ExpressionTokenBuilder(functions, sets)
        var key = 'a'
        var column = 12
        var token = expressionTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: a,
            type: 'set',
            key: key,
            column: column
        })
    })

    it('with another type of key builds an undefined value', function () {
        var expressionTokenBuilder = new ExpressionTokenBuilder(functions, sets)
        var key = '123'
        var column = 5
        var token = expressionTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
