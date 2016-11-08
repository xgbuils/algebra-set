var chai = require('chai')
var expect = chai.expect
var MSet = require('math.set')
var MFunction = require('../../src/')
var lexer = require('../../src/lexer/definition/')

var sumFn = function (a, b) {
    return a + b
}
var mulFn = function (a, b) {
    return a * b
}

describe('lexer/definition', function () {
    describe('(sum(a, b), mul(sum(c, a), c)', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(sum(a, b), mul(sum(c, a), c)'
            var sum = MFunction(sumFn)
            var mul = MFunction(mulFn)
            var a = MSet('(2, 3) U [4, 5)')
            var b = MSet('{-1} U [0, 1]')
            var c = MSet('{2, 3, 4}')
            var functions = {
                sum: sum,
                mul: mul
            }
            var params = {
                a: a,
                b: b,
                c: c
            }
            var result = lexer(string, functions, params)
            expect(result.toArray()).to.be.deep.equal([{
                value: '(',
                key: '(',
                type: '(',
                column: 1
            }, {
                value: sum,
                key: 'sum',
                type: 'function',
                column: 2
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 5
            }, {
                value: a,
                key: 'a',
                type: 'set',
                column: 6
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 7
            }, {
                value: b,
                key: 'b',
                type: 'set',
                column: 9
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 10
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 11
            }, {
                value: mul,
                key: 'mul',
                type: 'function',
                column: 13
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 16
            }, {
                value: sum,
                key: 'sum',
                type: 'function',
                column: 17
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 20
            }, {
                value: c,
                key: 'c',
                type: 'set',
                column: 21
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 22
            }, {
                value: a,
                key: 'a',
                type: 'set',
                column: 24
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 25
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 26
            }, {
                value: c,
                key: 'c',
                type: 'set',
                column: 28
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 29
            }])
        })
    })
})
