var chai = require('chai')
var expect = chai.expect
var rawSet = require('math.set/src/raw-set')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')
var NumberTokenBuilder = require('../../../src/lexer/token-builder/number-token-builder')
var repeat = require('../repeat')

describe('NumberTokenBuilder', function () {
    var regexp
    beforeEach(function () {
        regexp = /\d+\.\w*/
    })
    it('with numeric key builds a set type token with this singleton number set', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = '123.34'
        var set = new MSet(numToInterval(Number(key)))
        var column = 1
        var string = repeat(column - 1, '&') + key
        var token = numberTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: set,
            type: 'set',
            key: key,
            column: column
        })

        expect(rawSet(token.value)).to.be.deep.equal(rawSet(set))
    })

    it('with key does not match with regexp builds an undefined value', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = 'foo-bar'
        var column = 7
        var string = repeat(column - 1, '&') + key
        var token = numberTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
