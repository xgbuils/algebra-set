var chai = require('chai')
var expect = chai.expect
var lexer = require('../../../src/lexer/signature/')
var MSet = require('math.set')

describe('lexer/signature', function () {
    describe('(sum(a, b), mul(sum(c, a), c)', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(R^3 x ((2, 4) U {5})^2) x S_5'
            var R = 'R'
            var S_5 = '{1, 2, 3, 4, 5}'
            var sets = {
                R: R,
                S_5: S_5
            }
            var result = lexer(string, sets)
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
                type: 'number',
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
                type: 'number',
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
            }])
        })
    })
})
