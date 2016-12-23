var chai = require('chai')
var expect = chai.expect
var IntegerTokenBuilder = require('../../../src/lexer/token-builder/integer-token-builder')

describe('IntegerTokenBuilder', function () {
    it('with integer key, it builds a integer number', function () {
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

    it('with null key, it builds undefined', function () {
        var integerTokenBuilder = new IntegerTokenBuilder()
        var key = null
        var column = 2
        var token = integerTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
