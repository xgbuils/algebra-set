var chai = require('chai')
var expect = chai.expect
var samples = require('./interval-samples')
var TSet = require('math.set')
var rawSet = require('math.set/src/raw-set.js')
var TFunction = require('../src/')

var sumFn = function (a, b) {
    return [{
        value: a[0].value + b[0].value,
        limit: a[0].limit || b[0].limit
    }, {
        value: a[1].value + b[1].value,
        limit: a[1].limit || b[1].limit
    }]
}
var ZeroParametersFn = function () {}
var badReturnFn = function (a) {
    return a[0].value
}

describe('function', function () {
    describe('constructor', function () {
        it('using new returns an instance of TFunction', function () {
            var instance = new TFunction(sumFn)
            expect(instance).to.be.an.instanceOf(Function)
        })

        it('using function without new it also returns an isntance of TFunction', function () {
            var instance = TFunction(sumFn)
            expect(instance).to.be.an.instanceOf(Function)
        })

        it('if first parameter is not a function, throws an error', function () {
            function test () {
                TFunction(/a+/)
            }
            expect(test).to.throw('First parameter must be a function.')
        })

        it('if function passed does not has parameters, throws an error', function () {
            function test () {
                TFunction(ZeroParametersFn)
            }
            expect(test).to.throw('First parameter function must have 1 or more parameters.')
        })
    })

    describe('domain', function () {
        it('the default domain is the Real set', function () {
            var fn = TFunction(sumFn)
            var realSet = new TSet('(-Infinity, Infinity)')
            var expectedDomain = [realSet, realSet]
            expect(fn.domain.map(rawSet)).to.be.deep.equal(expectedDomain.map(rawSet))
        })

        /*it('if it is passed a set to constructor, this set is the domain', function () {
            var stringSet = '(2, 3] U {5}'
            var rawSpecificSet = rawSet(new TSet(stringSet))
            var fn = TFunction(sumFn, stringSet)
            expect(rawSet(fn.domain)).to.be.deep.equal(rawSpecificSet)
        })

        it('domain property is settable', function () {
            var stringSet = '(2, 3] U {5}'
            var rawSpecificSet = rawSet(new TSet(stringSet))
            var fn = TFunction(sumFn)
            fn.domain = stringSet
            expect(rawSet(fn.domain)).to.be.deep.equal(rawSpecificSet)
        })*/
    })

    /*describe('image', function () {
        it('image is calculated based on first parameter interval function', function () {
            var stringSet = '(2, 3] U {5}'
            var rawResultSet = rawSet(new TSet('(4, 6] U (7, 8] U {10}'))
            var fn = TFunction(function (a, b) {
                return [{
                    value: a[0].value + b[0].value,
                    limit: a[0].limit || b[0].limit
                }, {
                    value: a[1].value + b[1].value,
                    limit: a[1].limit || b[1].limit
                }]
            }, stringSet)
            expect(rawSet(fn.image)).to.be.deep.equal(rawResultSet)
        })

        it('if domain is modified, image is calculated based on the last domain set', function () {
            var inputSet1 = '(2, 3] U {5}'
            var inputSet2 = samples['[3, 5)']
            var rawResultSet = rawSet(new TSet('[6, 10)'))
            var fn = TFunction(sumFn, inputSet1)
            fn.domain = inputSet2
            expect(rawSet(fn.image)).to.be.deep.equal(rawResultSet)
        })

        it('image is not settable', function () {
            var inputSet1 = '(2, 3] U {5}'
            var inputSet2 = samples['[3, 5)']
            var rawResultSet = rawSet(new TSet('(4, 6] U (7, 8] U {10}'))
            var fn = TFunction(sumFn, inputSet1)
            fn.image = inputSet2
            expect(rawSet(fn.image)).to.be.deep.equal(rawResultSet)
        })

        it('if function passed does not return MultiIntervalCastable object, throws an exception when image is required', function () {
            function test () {
                var fn = TFunction(badReturnFn)
                fn.image // eslint-disable-line no-unused-expressions
            }
            expect(test).to.throw('Imposible to cast result returned by interval function.')
        })
    })

    describe('function instance', function () {
        it('function instance computes numbers based on interval function', function () {
            var fn = TFunction(sumFn)
            expect(fn(2, 3)).to.be.equal(5)
        })
    })*/
})
