var chai = require('chai')
var expect = chai.expect
var rawSet = require('math.set/src/raw-set')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')
var NumberTokenBuilder = require('../../../src/lexer/token-builder/number-token-builder')

describe('NumberTokenBuilder', function () {
    it('with numeric key, it builds a set type token with this singleton number set', function () {
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

    it('with null key', function () {
        var numberTokenBuilder = new NumberTokenBuilder()
        var key = null
        var column = 7
        var token = numberTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
