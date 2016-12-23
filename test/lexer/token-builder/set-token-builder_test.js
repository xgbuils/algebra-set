var chai = require('chai')
var expect = chai.expect
var rawSet = require('math.set/src/raw-set')
var MSet = require('math.set')
var SetTokenBuilder = require('../../../src/lexer/token-builder/set-token-builder')
var repeat = require('../repeat')

describe('SetTokenBuilder', function () {
    var regexp
    beforeEach(function () {
        regexp = /[\(\[\{][\w.,\s]+[\)\]\}](\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*/
    })
    it('with key castable to set builds a set type', function () {
        var setTokenBuilder = new SetTokenBuilder()
        var key = '(12, 134]'
        var set = new MSet(key)
        var column = 3
        var string = repeat(column - 1, '&') + key
        var token = setTokenBuilder
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

    it('with another type of key that does not cast to set builds an undefined value', function () {
        var setTokenBuilder = new SetTokenBuilder()
        var key = '(12. 134]'
        var column = 6
        var string = repeat(column - 1, '&') + key
        var token = setTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })

    it('with key that does not match with regexp builds an undefined value', function () {
        var setTokenBuilder = new SetTokenBuilder()
        var column = 6
        var string = repeat(column + 11, '&')
        var token = setTokenBuilder
            .withString(string)
            .withRegExp(regexp)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
