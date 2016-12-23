var chai = require('chai')
var expect = chai.expect
var SymbolTokenBuilder = require('../../../src/lexer/token-builder/symbol-token-builder')
var repeat = require('../repeat')

describe('SymbolTokenBuilder', function () {
    var regexp
    beforeEach(function () {
        regexp = /[()x,^]*/
    })
    it('given a key builds a token with the same value and type as key', function () {
        var symbolTokenBuilder = new SymbolTokenBuilder()
        var key = ','
        var column = 11
        var string = repeat(column - 1, '&') + key
        var token = symbolTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })

    it('with key that does not match with regexp builds an undefined value', function () {
        var setTokenBuilder = new SymbolTokenBuilder()
        var column = 6
        var key = '@@'
        var string = repeat(column - 1, '&') + key
        var token = setTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
