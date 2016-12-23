var chai = require('chai')
var expect = chai.expect
var ExpressionTokenBuilder = require('../../../src/lexer/token-builder/expression-token-builder')
var repeat = require('../repeat')

describe('ExpressionTokenBuilder', function () {
    var sum
    var object
    var type
    var regexp
    beforeEach(function () {
        sum = 'sumFn'
        object = {
            sum: sum
        }
        type = 'function'
        regexp = /\w+/
    })

    describe('if key is a property of object', function () {
        it('builds a token with object[key] value', function () {
            var expressionTokenBuilder = new ExpressionTokenBuilder(object, type)
            var key = 'sum'
            var column = 8
            var string = repeat(column - 1, '&') + key
            var token = expressionTokenBuilder
                .withString(string)
                .withRegExp(regexp)
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
            var string = repeat(column - 1, '&') + key
            var token = expressionTokenBuilder
                .withString(string)
                .withRegExp(regexp)
                .withColumn(column)
                .build()

            expect(token).to.be.equal(undefined)
        })
    })

    describe('if key exists but does not match properly', function () {
        it('returns undefined', function () {
            var expressionTokenBuilder = new ExpressionTokenBuilder(object)
            var key = '123'
            var column = 3
            var string = repeat(10, '&') + key
            var token = expressionTokenBuilder
                .withString(string)
                .withRegExp(regexp)
                .withColumn(column)
                .build()

            expect(token).to.be.equal(undefined)
        })
    })
})
