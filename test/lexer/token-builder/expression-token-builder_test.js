var chai = require('chai')
var expect = chai.expect
var ExpressionTokenBuilder = require('../../../src/lexer/token-builder/expression-token-builder')

describe('lexer/definition/ExpressionTokenBuilder', function () {
    var sum
    var object
    var type
    beforeEach(function () {
        sum = 'sumFn'
        object = {
            sum: sum
        }
        type = 'function'
    })

    describe('if key is a property of object', function () {
        it('builds a token with object[key] value', function () {
            var expressionTokenBuilder = new ExpressionTokenBuilder(object, type)
            var key = 'sum'
            var column = 8
            var token = expressionTokenBuilder
                .withKey(key)
                .withColumn(column)
                .build()

            expect(token).to.be.deep.equal({
                value: sum,
                type: type,
                key: key,
                column: column
            })
        })
    })

    describe('if key is not a property of object', function () {
        it('returns undefined', function () {
            var expressionTokenBuilder = new ExpressionTokenBuilder(object)
            var key = '123'
            var column = 5
            var token = expressionTokenBuilder
                .withKey(key)
                .withColumn(column)
                .build()

            expect(token).to.be.equal(undefined)
        })
    })
})
