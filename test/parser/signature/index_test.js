var chai = require('chai')
var expect = chai.expect
var MSet = require('math.set')
var rawSet = require('math.set/src/raw-set')

var Iterum = require('iterum')
var List = Iterum.List

var ParenthesisLeftToken = require('../../../src/parser/signature/parenthesis-left-token')
var SetToken = require('../../../src/parser/signature/set-token.js')
var CartesianToken = require('../../../src/parser/signature/cartesian-token.js')
var ParenthesisRightToken = require('../../../src/parser/signature/parenthesis-right-token')
var PowerToken = require('../../../src/parser/signature/power-token')
var NumberToken = require('../../../src/parser/signature/number-token')
var EndToken = require('../../../src/parser/signature/end-token')

var parserStatus = require('parser.status')
var parserGenerator = require('parser.generator')
var parser = require('../../../src/parser/parser')

var parserTokenClasses = {
    'set': SetToken,
    '(': ParenthesisLeftToken,
    ')': ParenthesisRightToken,
    'x': CartesianToken,
    '^': PowerToken,
    'number': NumberToken,
    'end': EndToken
}

function createToken (value, type, column, key) {
    return {
        value: value,
        type: type,
        column: column,
        key: key
    }
}

function createEndToken (column) {
    return {
        type: 'end',
        key: '<<END OF LINE>>',
        column: column
    }
}

describe('parser/definition', function () {
    describe('valid expressions', function () {
        describe('given simple set', function () {
            it('returns an array with the same set that means', function () {
                var set = MSet('(2, 3)')

                // (2, 3)
                var lex = List([
                    createToken(set, 'set'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(rawSet(result[0])).to.be.deep.equal(rawSet(set))
            })
        })

        describe('given a cartesian product of simple sets', function () {
            it('returns the array of sets that means', function () {
                var a = MSet('(2, 3)')
                var b = MSet('[1, 4)')
                var c = MSet('{1, 2, 5}')

                // (2, 3) x [1, 4) x {1, 2, 5}
                var lex = List([
                    createToken(a, 'set'),
                    createToken('x', 'x'),
                    createToken(b, 'set'),
                    createToken('x', 'x'),
                    createToken(c, 'set'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(rawSet(result[0])).to.be.deep.equal(rawSet(a))
                expect(rawSet(result[1])).to.be.deep.equal(rawSet(b))
                expect(rawSet(result[2])).to.be.deep.equal(rawSet(c))
            })
        })

        describe('given a cartesian product wrapped with parenthesis', function () {
            it('returns the array of sets that means wrapped in array', function () {
                var a = MSet('{1, 2, 5}')
                var b = MSet('[0, 1)')

                // ({1, 2, 5} x [0, 1))
                var lex = List([
                    createToken('(', '('),
                    createToken(a, 'set'),
                    createToken('x', 'x'),
                    createToken(b, 'set'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result.length).to.be.equal(1)
                expect(result[0].map(rawSet)).to.be.deep.equal([a, b].map(rawSet))
            })
        })

        describe('given a castesian product of cartesian products', function () {
            it('returns the array of sets that means', function () {
                var a = MSet('{1}')
                var b = MSet('(-1, 2)')
                var c = MSet('{2, 0}')
                var d = MSet('{5} U [3, 4]')

                // ({1} x (-1, 2)) x ({2, 0} x {5} U [3, 4])
                var lex = List([
                    createToken('(', '('),
                    createToken(a, 'set'),
                    createToken('x', 'x'),
                    createToken(b, 'set'),
                    createToken(')', ')'),
                    createToken('x', 'x'),
                    createToken('(', '('),
                    createToken(c, 'set'),
                    createToken('x', 'x'),
                    createToken(d, 'set'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result.length).to.be.equal(2)
                expect(result[0].length).to.be.equal(2)
                expect(result[1].length).to.be.equal(2)
                expect(result[0].map(rawSet)).to.be.deep.equal([a, b].map(rawSet))
                expect(result[1].map(rawSet)).to.be.deep.equal([c, d].map(rawSet))
            })
        })

        describe('given a castesian power', function () {
            it('returns the array of sets that means', function () {
                var a = MSet('(2, 4)')
                var power = 3

                // (2, 4)^3
                var lex = List([
                    createToken(a, 'set'),
                    createToken('^', '^'),
                    createToken(power, 'number'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result.map(rawSet)).to.be.deep.equal([a, a, a].map(rawSet))
            })
        })

        describe('given a cartesian power and cartesian product', function () {
            it('cartesian power has more priority', function () {
                var a = MSet('(2, 4)')
                var b = MSet('{1, 2}')
                var power = 3

                // (2, 4) x {1, 2}^3
                var lex = List([
                    createToken(a, 'set'),
                    createToken('x', 'x'),
                    createToken(b, 'set'),
                    createToken('^', '^'),
                    createToken(power, 'number'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result.map(rawSet)).to.be.deep.equal([a, b, b, b].map(rawSet))
            })
        })

        describe('given a cartesian power and cartesian product with parenthesis', function () {
            it('cartesian product has more priority', function () {
                var a = MSet('(2, 4)')
                var b = MSet('{1, 2}')
                var power = 3

                // ((2, 4) x {1, 2})^3
                var lex = List([
                    createToken('(', '('),
                    createToken(a, 'set'),
                    createToken('x', 'x'),
                    createToken(b, 'set'),
                    createToken(')', ')'),
                    createToken('^', '^'),
                    createToken(power, 'number'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result.map(function (product) {
                    return product.map(rawSet)
                })).to.be.deep.equal([
                    [a, b].map(rawSet),
                    [a, b].map(rawSet),
                    [a, b].map(rawSet)
                ])
            })
        })
    })

    describe('invalid expressions', function () {
        describe('given only a left parenthesis', function () {
            it('throws an error', function () {
                var column = 5

                function test () {
                    // (
                    var lex = List([
                        createToken('(', '('),
                        createEndToken(column)
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `<<END OF LINE>>` in column ' + column + '.')
            })
        })

        describe('given only a right parenthesis', function () {
            it('throws an error', function () {
                var column = 90
                var key = ')'

                function test () {
                    // )
                    var lex = List([
                        createToken(')', ')', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })

        describe('given only a power symbol', function () {
            it('throws an error', function () {
                var column = 32
                var key = '^'

                function test () {
                    // ^
                    var lex = List([
                        createToken('^', '^', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })

        describe('given only a cartesian product symbol', function () {
            it('throws an error', function () {
                var column = 61
                var key = 'x'

                function test () {
                    // x
                    var lex = List([
                        createToken('x', 'x', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })

        describe('given only a number', function () {
            it('throws an error', function () {
                var column = 21
                var number = 5
                var key = number.toString()

                function test () {
                    // 5
                    var lex = List([
                        createToken(number, 'number', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })

        describe('given empty list of tokens', function () {
            it('throws an error', function () {
                var column = 12

                function test () {
                    //
                    var lex = List([
                        createEndToken(column)
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `<<END OF LINE>>` in column ' + column + '.')
            })
        })

        describe('given not ended cartesian product', function () {
            it('throws an error', function () {
                var column = 16

                function test () {
                    var a = MSet('(2, 4)')

                    //
                    var lex = List([
                        createToken(a, 'set'),
                        createToken('x', 'x'),
                        createEndToken(column)
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `<<END OF LINE>>` in column ' + column + '.')
            })
        })

        describe('given extra right parenthesis in cartesian product', function () {
            it('throws an error', function () {
                var column = 23
                var key = ')'

                function test () {
                    var a = MSet('(2, 4)')
                    var b = MSet('{8}')

                    //
                    var lex = List([
                        createToken(a, 'set'),
                        createToken('x', 'x'),
                        createToken(b, 'set'),
                        createToken(')', ')', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })

        describe('given set as exponent of cartesian power', function () {
            it('throws an error', function () {
                var column = 16
                var key = '{8}'

                function test () {
                    var a = MSet('(2, 4)')
                    var b = MSet(key)

                    //
                    var lex = List([
                        createToken(a, 'set'),
                        createToken('^', '^'),
                        createToken(b, 'set', column, key),
                        createEndToken()
                    ])
                    var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                    parser(parserIterator)
                }

                expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
            })
        })
    })
})
