var chai = require('chai')
var expect = chai.expect
var MSet = require('math.set')
var rawSet = require('math.set/src/raw-set')
var MFunction = require('../../../src/')

var Iterum = require('iterum')
var List = Iterum.List

var parser = require('../../../src/parser/definition/')

function createToken (value, type, column, key) {
    return {
        value: value,
        type: type,
        column: column,
        key: key
    }
}

function createEndToken () {
    return {
        type: 'end'
    }
}

var sumFn = function (a, b) {
    return [{
        value: a[0].value + b[0].value,
        limit: a[0].limit || b[0].limit
    }, {
        value: a[1].value + b[1].value,
        limit: a[1].limit || b[1].limit
    }]
}

describe('parser/definition', function () {
    describe('given simple variable', function () {
        it('returns the set that means', function () {
            var a = MSet('(2, 3)')

            // a
            var lex = List([
                createToken(a, 'set'),
                createEndToken()
            ])
            var result = parser(lex.build())
            expect(result).to.be.deep.equal(a)
        })
    })

    describe('given simple function expression', function () {
        it('returns the set that means', function () {
            var a = MSet('(2, 3)')
            var b = MSet('[1, 4)')
            var sum = MFunction(sumFn)

            // sum(a, b)
            var lex = List([
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(a, 'set'),
                createToken(',', ','),
                createToken(b, 'set'),
                createToken(')', ')'),
                createEndToken()
            ])
            var result = parser(lex.build())
            var expected = MSet('(3, 7)')
            expect(rawSet(result)).to.be.deep.equal(rawSet(expected))
        })
    })

    describe('given simple tuple expression', function () {
        it('returns the tuple that means', function () {
            var a = MSet('(2, 3)')
            var b = MSet('[1, 4)')

            // (a, b)
            var lex = List([
                createToken('(', '('),
                createToken(a, 'set'),
                createToken(',', ','),
                createToken(b, 'set'),
                createToken(')', ')'),
                createEndToken()
            ])
            var result = parser(lex.build())
            expect(result.map(rawSet)).to.be.deep.equal([rawSet(a), rawSet(b)])
        })
    })

    describe('given function with number of parameters greater than correct', function () {
        it('throws an error', function () {
            var column = 7
            var sumKey = 'sum'
            function test () {
                var a = MSet('(2, 3)')
                var b = MSet('[1, 4)')
                var c = MSet('(3, 5]')
                var sum = MFunction(sumFn)

                // sum(a, b, c)
                var lex = List([
                    createToken(sum, 'function', 1, sumKey),
                    createToken('(', '('),
                    createToken(a, 'set'),
                    createToken(',', ','),
                    createToken(b, 'set'),
                    createToken(',', ',', column, ','),
                    createToken(c, 'set'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                parser(lex.build())
            }

            expect(test).to.throw('Expected token `,` instead `)` in column ' +
                column + '. `' + sumKey + '` arity must be 2.')
        })
    })

    describe('given function with number of parameters less than correct', function () {
        it('throws an error', function () {
            var column = 19
            var sumKey = 'sum'
            function test () {
                var a = MSet('(2, 3)')
                var sum = MFunction(sumFn)

                // sum(a)
                var lex = List([
                    createToken(sum, 'function', 2, sumKey),
                    createToken('(', '('),
                    createToken(a, 'set'),
                    createToken(')', ')', column, ')'),
                    createEndToken()
                ])
                parser(lex.build())
            }

            expect(test).to.throw('Expected token `,` instead `)` in column ' +
                column + '. `' + sumKey + '` arity must be 2.')
        })
    })

    describe('given nested function expression', function () {
        it('returns the set that means', function () {
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')
            var sum = MFunction(sumFn)

            // sum(sum(a, sum(b, 8)), c)
            var lex = List([
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(a, 'set'),
                createToken(',', ','),
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(b, 'set'),
                createToken(',', ','),
                createToken(new MSet('{8}'), 'set'),
                createToken(')', ')'),
                createToken(')', ')'),
                createToken(',', ','),
                createToken(c, 'set'),
                createToken(')', ')'),
                createEndToken()
            ])
            var result = parser(lex.build())
            var expected = MSet('[14, 20)')
            expect(rawSet(result)).to.be.deep.equal(rawSet(expected))
        })
    })

    describe('given nested tuples expression', function () {
        it('returns the tuple that means', function () {
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')

            // ((a, (b, a)), c)
            var lex = List([
                createToken('(', '('),
                createToken('(', '('),
                createToken(a, 'set'),
                createToken(',', ','),
                createToken('(', '('),
                createToken(b, 'set'),
                createToken(',', ','),
                createToken(a, 'set'),
                createToken(')', ')'),
                createToken(')', ')'),
                createToken(',', ','),
                createToken(c, 'set'),
                createToken(')', ')'),
                createEndToken()
            ])
            var result = parser(lex.build())
            expect(result).to.be.deep.equal([[a, [b, a]], c])
        })
    })

    describe('given nested mixed expressions (tuples and functions)', function () {
        it('returns the tuple that means', function () {
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')
            var sum = MFunction(sumFn)

            // ((a, sum(b, a)), sum(c, b))
            var lex = List([
                createToken('(', '('),
                createToken('(', '('),
                createToken(a, 'set'),
                createToken(',', ','),
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(b, 'set'),
                createToken(',', ','),
                createToken(a, 'set'),
                createToken(')', ')'),
                createToken(')', ')'),
                createToken(',', ','),
                createToken(sum, 'function'),
                createToken('(', '('),
                createToken(c, 'set'),
                createToken(',', ','),
                createToken(b, 'set'),
                createToken(')', ')'),
                createToken(')', ')'),
                createEndToken()
            ])
            var result = parser(lex.build())
            var first = result[0]
            var second = result[1]
            expect(first.map(rawSet)).to.be.deep.equal([a, MSet('[3, 7)')].map(rawSet))
            expect(rawSet(second)).to.be.deep.equal(rawSet(MSet('[4, 9)')))
        })
    })
})
