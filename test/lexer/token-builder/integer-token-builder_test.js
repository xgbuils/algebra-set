var chai = require('chai')
var expect = chai.expect
var IntegerTokenBuilder = require('../../../src/lexer/token-builder/integer-token-builder')

describe('IntegerTokenBuilder', function () {
    it('with integer key builds a integer number', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = '123'
        var value = Number(key)
        var column = 4
        var token = integerTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: value,
            type: 'integer',
            key: key,
            column: column
        })
    })

    it('with float key builds an undefined value', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = '123.34'
        var column = 2
        var token = integerTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })

    it('with another type of key builds an undefined value', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = 'foo-bar'
        var column = 7
        var token = integerTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
