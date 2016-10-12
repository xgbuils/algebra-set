var chai = require('chai')
var expect = chai.expect
var samples = require('./interval-samples')
var MSet = require('math.set')
var rawSet = require('math.set/src/raw-set.js')
var MFunction = require('../src/')

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
        it('using new returns an instance of MFunction', function () {
            var instance = new MFunction(sumFn)
            expect(instance).to.be.an.instanceOf(Function)
        })

        it('using function without new it also returns an isntance of MFunction', function () {
            var instance = MFunction(sumFn)
            expect(instance).to.be.an.instanceOf(Function)
        })

        it('if first parameter is not a function, throws an error', function () {
            function test () {
                MFunction(/a+/)
            }
            expect(test).to.throw('First parameter must be a function.')
        })

        it('if function passed does not has parameters, throws an error', function () {
            function test () {
                MFunction(ZeroParametersFn)
            }
            expect(test).to.throw('First parameter function must have 1 or more parameters.')
        })

        it('if second parameter is not undefined or an array of SetCastable values, throws an error', function () {
            function test () {
                MFunction(sumFn, /a+/)
            }
            expect(test).to.throw('domain parameter /a+/ is not an array.')
        })
    })

    describe('domain', function () {
        it('the default domain is array of Real sets', function () {
            var fn = MFunction(sumFn)
            var realSet = new MSet('(-Infinity, Infinity)')
            var expectedDomain = [realSet, realSet]
            expect(fn.domain.map(rawSet)).to.be.deep.equal(expectedDomain.map(rawSet))
        })

        it('if it is passed a set to constructor, this set is the domain', function () {
            var domain = ['(2, 3] U {5}', '(1, 8)']
            var expectedDomain = domain.map(function (set) {
                return new MSet(set)
            })
            var fn = MFunction(sumFn, domain)
            expect(fn.domain.map(rawSet)).to.be.deep.equal(expectedDomain.map(rawSet))
        })

        it('domain property is settable', function () {
            var domain = ['(2, 3] U {5}', '(1, 8)']
            var expectedDomain = domain.map(function (set) {
                return new MSet(set)
            })
            var fn = MFunction(sumFn)
            fn.domain = domain
            expect(fn.domain.map(rawSet)).to.be.deep.equal(expectedDomain.map(rawSet))
        })
    })

    describe('image', function () {
        it('image is calculated based on first parameter interval function', function () {
            var domain = ['(2, 3] U {5}', '(2, 3] U {5}']
            var expectedImage = new MSet('(4, 6] U (7, 8] U {10}')
            var fn = MFunction(sumFn, domain)
            expect(rawSet(fn.image)).to.be.deep.equal(rawSet(expectedImage))
        })

        it('if domain is modified, image is calculated based on the last domain set', function () {
            var inputSet1 = ['(2, 3] U {5}', '(2, 3] U {5}']
            var inputSet2 = [samples['[3, 5)'], '[3, 5)']
            var expectedImage = new MSet('[6, 10)')
            var fn = MFunction(sumFn, inputSet1)
            fn.domain = inputSet2
            expect(rawSet(fn.image)).to.be.deep.equal(rawSet(expectedImage))
        })

        it('image is not settable', function () {
            var domain = ['(2, 3] U {5}', '(2, 3] U {5}']
            var image = '[3, 5)'
            var expectedImage = new MSet('(4, 6] U (7, 8] U {10}')
            var fn = MFunction(sumFn, domain)
            fn.image = image
            expect(rawSet(fn.image)).to.be.deep.equal(rawSet(expectedImage))
        })

        it('if function passed does not return MultiIntervalCastable object, throws an exception when image is required', function () {
            function test () {
                var fn = MFunction(badReturnFn)
                fn.image // eslint-disable-line no-unused-expressions
            }
            expect(test).to.throw('Imposible to cast result returned by interval function.')
        })
    })

    describe('function instance', function () {
        it('function instance computes numbers based on interval function', function () {
            var fn = MFunction(sumFn)
            expect(fn(2, 3)).to.be.equal(5)
        })
    })
})
