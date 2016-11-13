var chai = require('chai')
var expect = chai.expect
var MSet = require('math.set')
var rawSet = require('math.set/src/raw-set')
var MFunction = require('../../../src/')
var lexer = require('../../../src/lexer/definition')
var parser = require('../../../src/parser/definition/')

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
            var string = 'a'
            var a = MSet('(2, 3)')
            var functions = {}
            var params = {
                a: a
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            expect(result).to.be.deep.equal(a)
        })
    })

    describe('given simple function expression', function () {
        it('returns the set that means', function () {
            var string = 'sum(a, b)'
            var a = MSet('(2, 3)')
            var b = MSet('[1, 4)')
            var sum = MFunction(sumFn)
            var functions = {
                sum: sum
            }
            var params = {
                a: a,
                b: b
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            var expected = MSet('(3, 7)')
            expect(rawSet(result)).to.be.deep.equal(rawSet(expected))
        })
    })

    describe('given simple tuple expression', function () {
        it('returns the tuple that means', function () {
            var string = '(a, b)'
            var a = MSet('(2, 3)')
            var b = MSet('[1, 4)')
            var functions = {}
            var params = {
                a: a,
                b: b
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            expect(result.map(rawSet)).to.be.deep.equal([rawSet(a), rawSet(b)])
        })
    })

    describe('given function with number of parameters greater than correct', function () {
        it('throws an error', function () {
            function test () {
                var string = 'sum(a, b, c)'
                var a = MSet('(2, 3)')
                var b = MSet('[1, 4)')
                var c = MSet('(3, 5]')
                var sum = MFunction(sumFn)
                var functions = {
                    sum: sum
                }
                var params = {
                    a: a,
                    b: b,
                    c: c
                }
                var lex = lexer(string, functions, params)
                parser(lex.build())
            }

            expect(test).to.throw('Expected token `,` instead `)` in column 9. `sum` arity must be 2.')
        })
    })

    describe('given function with number of parameters less than correct', function () {
        it('throws an error', function () {
            function test () {
                var string = 'sum(a)'
                var a = MSet('(2, 3)')
                var sum = MFunction(sumFn)
                var functions = {
                    sum: sum
                }
                var params = {
                    a: a
                }
                var lex = lexer(string, functions, params)
                parser(lex.build())
            }

            expect(test).to.throw('Expected token `,` instead `)` in column 6. `sum` arity must be 2.')
        })
    })

    describe('given nested function expression', function () {
        it('returns the set that means', function () {
            var string = 'sum(sum(a, sum(b, a)), c)'
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')
            var sum = MFunction(sumFn)
            var functions = {
                sum: sum
            }
            var params = {
                a: a,
                b: b,
                c: c
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            var expected = MSet('[8, 15)')
            expect(rawSet(result)).to.be.deep.equal(rawSet(expected))
        })
    })

    describe('given nested tuples expression', function () {
        it('returns the tuple that means', function () {
            var string = '((a, (b, a)), c)'
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')
            var sum = MFunction(sumFn)
            var functions = {
                sum: sum
            }
            var params = {
                a: a,
                b: b,
                c: c
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            expect(result).to.be.deep.equal([[a, [b, a]], c])
        })
    })

    describe('given nested mixed expressions (tuples and functions)', function () {
        it('returns the tuple that means', function () {
            var string = '((a, sum(b, a)), sum(c, b))'
            var a = MSet('[2, 3)')
            var b = MSet('[1, 4)')
            var c = MSet('[3, 5]')
            var sum = MFunction(sumFn)
            var functions = {
                sum: sum
            }
            var params = {
                a: a,
                b: b,
                c: c
            }
            var lex = lexer(string, functions, params)
            var result = parser(lex.build())
            var first = result[0]
            var second = result[1]
            expect(first.map(rawSet)).to.be.deep.equal([a, MSet('[3, 7)')].map(rawSet))
            expect(rawSet(second)).to.be.deep.equal(rawSet(MSet('[4, 9)')))
        })
    })
})
