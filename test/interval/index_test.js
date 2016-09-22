var chai = require('chai')
var expect = chai.expect
var Interval = require('../../src/interval/')
var raw = require('../../src/interval/raw-interval.js')
var samples = require('../interval-samples.js')

describe('Interval', function () {
  describe('.union()', function () {
    describe('if it is passed an array of castable intervals', function () {
      it('it returns an array with raw intervals that represents the union', function () {
        var intervalList = Interval.union(
          samples['(4, 8)'],
          '[3, 5)',
          new Interval('{-1}')
        )

        expect(intervalList.map(raw)).to.be.deep.equal([
          samples['{-1}'],
          samples['[3, 8)']
        ])
      })
    })

    describe('if it is passed an array with no castable interval', function () {
      it('it returns an array with raw intervals that represents the union', function () {
        function test () {
          Interval.union(
            samples['(4, 8)'],
            5,
            new Interval('{-1}')
          )
        }

        expect(test).to.throw('5 is not castable to Interval')
      })
    })
  })

  describe('.contains()', function () {
    describe('containing numbers...', function () {
      describe('isolated: [-2, -2]', function () {
        var interval = new Interval('[-2,-2]')

        it('contains -2', function () {
          expect(interval.contains(-2)).to.be.equal(true)
        })
        it('does not contain -2.5', function () {
          expect(interval.contains(-2.5)).to.be.equal(false)
        })
        it('does not contain 0', function () {
          expect(interval.contains(0)).to.be.equal(false)
        })
      })

      describe('[1, 6)', function () {
        var interval = new Interval('[1, 6)')

        it('does not contain -2', function () {
          expect(interval.contains(-2)).to.be.equal(false)
        })
        it('contains 1.5', function () {
          expect(interval.contains(1.5)).to.be.equal(true)
        })
        it('does not contain 6', function () {
          expect(interval.contains(6)).to.be.equal(false)
        })
      })

      describe('empty: (3, -2)', function () {
        var interval = new Interval('(3,-2)')

        it('does not contain -2', function () {
          expect(interval.contains(-2)).to.be.equal(false)
        })
        it('does not contain 1.5', function () {
          expect(interval.contains(1.5)).to.be.equal(false)
        })
        it('does not contain 0', function () {
          expect(interval.contains(0)).to.be.equal(false)
        })
      })
    })

    describe('containing intervals...', function () {
      describe('isolated: [-2, -2]', function () {
        var interval = new Interval('[-2,-2]')

        it('contains [-2, -2]', function () {
          expect(interval.contains(new Interval('[-2,-2]'))).to.be.equal(true)
        })
        it('does not contain [1, 1]', function () {
          expect(interval.contains(new Interval('[1, 1]'))).to.be.equal(false)
        })
        it('does not contain [-2, 0)', function () {
          expect(interval.contains(new Interval('[-2, 0)'))).to.be.equal(false)
        })
        it('does not contain [-4, -2]', function () {
          expect(interval.contains(new Interval('[-4, -2]'))).to.be.equal(false)
        })
        it('does not contain (-2, 1]', function () {
          expect(interval.contains('(-2, 1]')).to.be.equal(false)
        })
        it('does not contain [-5, -2)', function () {
          expect(interval.contains('[-5,-2)')).to.be.equal(false)
        })
        it('does not contain [-4, 8)', function () {
          expect(interval.contains('[-4, 8)')).to.be.equal(false)
        })
        it('contains empty set: (8, -4]', function () {
          expect(interval.contains('(8, -4]')).to.be.equal(true)
        })
      })

      describe('[1, 6)', function () {
        var interval = new Interval('[1, 6)')

        it('contains [2, 2]', function () {
          expect(interval.contains(new Interval('[2, 2]'))).to.be.equal(true)
        })
        it('does not contain [1, 6]', function () {
          expect(interval.contains(new Interval('[1, 6]'))).to.be.equal(false)
        })
        it('contains [1, 6)', function () {
          expect(interval.contains(new Interval('[1, 6)'))).to.be.equal(true)
        })
        it('contains (1, 6)', function () {
          expect(interval.contains('(1, 6)')).to.be.equal(true)
        })
        it('contains (2, 5)', function () {
          expect(interval.contains('(2, 5)')).to.be.equal(true)
        })
        it('contains (0, 5)', function () {
          expect(interval.contains('(2, 5)')).to.be.equal(true)
        })
        it('contains (100, 95)', function () {
          expect(interval.contains('(100, 95)')).to.be.equal(true)
        })
      })

      describe('empty: (3, -2)', function () {
        var interval = new Interval('(3,-2)')

        it('does not contain [1, 5)', function () {
          expect(interval.contains('[1, 5)')).to.be.equal(false)
        })
        it('empty contains empty', function () {
          expect(interval.contains('(100, 10)')).to.be.equal(true)
        })
        it('does not contain [3, 3]', function () {
          expect(interval.contains('[3, 3]')).to.be.equal(false)
        })
        it('does not contain [-2, -2]', function () {
          expect(interval.contains('[-2, -2]')).to.be.equal(false)
        })
      })
    })
  })
})
