var chai = require('chai')
var expect = chai.expect
var rawSet = require('math.set/src/raw-set')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')
var NumberTokenBuilder = require('../../../src/lexer/definition/number-token-builder')

describe('lexer/definition/NumberTokenBuilder', function () {
    it('with numeric key builds a set type token with this singleton number set', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = '123.34'
        var set = new MSet(numToInterval(Number(key)))
        var column = 1
        var token = numberTokenBuilder
            .withKey(key)
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
