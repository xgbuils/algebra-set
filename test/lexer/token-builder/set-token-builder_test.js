var chai = require('chai')
var expect = chai.expect
var rawSet = require('math.set/src/raw-set')
var MSet = require('math.set')
var SetTokenBuilder = require('../../../src/lexer/token-builder/set-token-builder')

describe('SetTokenBuilder', function () {
    it('with key castable to set builds a set type', function () {
        var setTokenBuilder = new SetTokenBuilder()
        var key = '(12, 134]'
        var set = new MSet(key)
        var column = 3
        var token = setTokenBuilder
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

    it('with another type of key that does not cast to set builds an undefined value', function () {
        var setTokenBuilder = new SetTokenBuilder()
        var key = '(12. 134]'
        var column = 6
        var token = setTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
