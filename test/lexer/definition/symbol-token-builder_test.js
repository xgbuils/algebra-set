var chai = require('chai')
var expect = chai.expect
var SymbolTokenBuilder = require('../../../src/lexer/definition/symbol-token-builder')

describe('lexer/definition/SymbolTokenBuilder', function () {
    it('given a key builds a token with the same value and type as key', function () {
        var symbolTokenBuilder = new SymbolTokenBuilder()
        var key = ','
        var column = 11
        var token = symbolTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })
})