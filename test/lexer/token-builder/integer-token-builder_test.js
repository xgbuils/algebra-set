var chai = require('chai')
var expect = chai.expect
var IntegerTokenBuilder = require('../../../src/lexer/token-builder/integer-token-builder')
var repeat = require('../repeat')

describe('IntegerTokenBuilder', function () {
    var regexp
    beforeEach(function () {
        regexp = /\d+/
    })
    it('with integer key builds a integer number', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = '123'
        var value = Number(key)
        var column = 4
        var string = repeat(column - 1, '&') + key
        var token = integerTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: value,
            type: 'integer',
            key: key,
            column: column
        })
    })

    it('with key does not match with regexp builds an undefined value', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = 'foo-bar'
        var column = 2
        var string = repeat(column - 1, '&') + key
        var token = integerTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
