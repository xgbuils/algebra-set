var chai = require('chai')
var expect = chai.expect
var lexer = require('../../../src/lexer/lexer')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')

describe('lexer/definition', function () {
    describe('(sum(a, b), mul(sum(c, a), c)', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(sum(a, b), mul(sum(c, 8), c)'
            var sum = 'sumFn'
            var mul = 'mulFn'
            var a = '{1}'
            var b = '{2}'
            var c = '{3}'
            var functions = {
                sum: sum,
                mul: mul
            }
            var sets = {
                a: a,
                b: b,
                c: c
            }
            var config = {
                ignore: /\s+/,
                creators: [{
                    regexp: /\w+/,
                    transform: functions,
                    type: 'function'
                }, {
                    regexp: /\w+/,
                    transform: sets,
                    type: 'set'
                }, {
                    regexp: /\d+(\.\w*)?/,
                    transform: function (key) {
                        return MSet(numToInterval(Number(key)))
                    },
                    type: 'set'
                }, {
                    regexp: /[,()]/
                }]
            }
            var result = lexer(string, config)
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
                value: new MSet(numToInterval(8)),
                key: '8',
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
            }, {
                type: 'end'
            }])
        })
    })
})
