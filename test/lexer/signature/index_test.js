var chai = require('chai')
var expect = chai.expect
var lexer = require('../../../src/lexer/signature/')
var MSet = require('math.set')

var ExpressionTokenBuilder = require('../../../src/lexer/token-builder/expression-token-builder.js')
var TransformTokenBuilder = require('../../../src/lexer/token-builder/transform-token-builder.js')
var SymbolTokenBuilder = require('../../../src/lexer/token-builder/symbol-token-builder.js')

describe('lexer/signature', function () {
    describe('(R^3 x ((2, 4) U {5})^2) x S_5', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(R^3 x ((2, 4) U {5})^2) x S_5'
            var R = 'R'
            var S_5 = '{1, 2, 3, 4, 5}'
            var sets = {
                R: R,
                S_5: S_5
            }
            var config = {
                ignore: /\s+/,
                creators: [{
                    regexp: /\w+/,
                    builder: new ExpressionTokenBuilder(sets, 'set')
                }, {
                    regexp: /[\(\[\{][\w.,\s]+[\)\]\}](\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*/,
                    builder: new TransformTokenBuilder(function (key) {
                        return new MSet(key)
                    }, 'set')
                }, {
                    regexp: /\d+/,
                    builder: new TransformTokenBuilder(parseInt, 'integer')
                }, {
                    regexp: /[x()^]/,
                    builder: new SymbolTokenBuilder()
                }]
            }
            var result = lexer(string, config)
            expect(result.toArray()).to.be.deep.equal([{
                value: '(',
                key: '(',
                type: '(',
                column: 1
            }, {
                value: R,
                key: 'R',
                type: 'set',
                column: 2
            }, {
                value: '^',
                key: '^',
                type: '^',
                column: 3
            }, {
                value: 3,
                key: '3',
                type: 'integer',
                column: 4
            }, {
                value: 'x',
                key: 'x',
                type: 'x',
                column: 6
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 8
            }, {
                value: new MSet('(2, 4) U {5}'),
                key: '(2, 4) U {5}',
                type: 'set',
                column: 9
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 21
            }, {
                value: '^',
                key: '^',
                type: '^',
                column: 22
            }, {
                value: 2,
                key: '2',
                type: 'integer',
                column: 23
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 24
            }, {
                value: 'x',
                key: 'x',
                type: 'x',
                column: 26
            }, {
                value: S_5,
                key: 'S_5',
                type: 'set',
                column: 28
            }, {
                type: 'end'
            }])
        })
    })
})
