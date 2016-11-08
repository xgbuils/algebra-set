var chai = require('chai')
var expect = chai.expect
var NumberTokenBuilder = require('../../../src/lexer/definition/number-token-builder')

describe('lexer/definition/NumberTokenBuilder', function () {
    it('with numeric key builds a number type token', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = '123.34'
        var number = Number(key)
        var column = 1
        var token = numberTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: number,
            type: 'number',
            key: key,
            column: column
        })
    })

    it('with another type of key builds an undefined value', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = 'foo-bar'
        var column = 7
        var token = numberTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
