var chai = require('chai')
var expect = chai.expect
var samples = require('./interval-samples')
var Interval = require('../src/interval.js')
var raw = require('./utils/raw-interval')

describe('Interval', function () {
  describe('Interval.create', function () {
    describe('passing 4 parameters', function () {
      it('returns instance of Interval', function () {
        var interval = Interval.create('(', 0, 1, ']')
        expect(interval).to.be.instanceOf(Interval)
      })
      it('returns closed interval', function () {
        var interval = Interval.create('[', 4, 5, ']')
        expect(raw(interval)).to.be.deep.equal(samples['[4, 5]'])
      })

      it('returns opened interval', function () {
        var interval = Interval.create('(', 4, 8, ')')
        expect(raw(interval)).to.be.deep.equal(samples['(4, 8)'])
      })
    })

    describe('passing raw interval', function () {
      it('returns instance of Interval', function () {
        var interval = Interval.create('(', 0, 1, ']')
        expect(interval).to.be.instanceOf(Interval)
      })
      it('returns closed interval', function () {
        var interval = Interval.create(samples['{5}'])
        expect(raw(interval)).to.be.deep.equal(samples['{5}'])
      })

      it('returns opened interval', function () {
        var interval = Interval.create(samples['(2, 7)'])
        expect(raw(interval)).to.be.deep.equal(samples['(2, 7)'])
      })
    })
  })

  describe('Interval.union', function () {
    it('[4,5] U [ 3 , 9) --> [3, 9)', function () {
      var intervalList = Interval.union.apply(null, [
        samples['[4, 5]'],
        samples['[3, 9)']
      ].map(Interval.create))

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['[3, 9)']
      ])
    })

    it('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(4, 8)'],
        samples['[3, 5)'],
        samples['{-1}'],
        samples['{7}']
      ].map(Interval.create))

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['{-1}'],
        samples['[3, 8)']
      ])
    })

    it('[5, 5] --> {5}', function () {
      var intervalList = Interval.union.apply(null, [
        samples['{5}']
      ].map(Interval.create))

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['{5}']
      ])
    })

    it('(3, 11] --> (3, 11]', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(3, 11]']
      ].map(Interval.create))

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['(3, 11]']
      ])
    })

    it('(3, 0] --> empty', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(3, 0]']
      ].map(Interval.create))

      expect(intervalList).to.be.deep.equal([])
    })

    it('(3, 0] U [7, 7] U (2, 7) --> (2, 7]', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(2, 7)'],
        samples['{7}']
      ].map(Interval.create))

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['(2, 7]']
      ])
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
          expect(interval.contains(new Interval('(-2, 1]'))).to.be.equal(false)
        })
        it('does not contain [-5, -2)', function () {
          expect(interval.contains(new Interval('[-5,-2)'))).to.be.equal(false)
        })
        it('does not contain [-4, 8)', function () {
          expect(interval.contains(new Interval('[-4, 8)'))).to.be.equal(false)
        })
        it('contains empty set: (8, -4]', function () {
          expect(interval.contains(new Interval('(8, -4]'))).to.be.equal(true)
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
          expect(interval.contains(new Interval('(1, 6)'))).to.be.equal(true)
        })
        it('contains (2, 5)', function () {
          expect(interval.contains(new Interval('(2, 5)'))).to.be.equal(true)
        })
        it('contains (0, 5)', function () {
          expect(interval.contains(new Interval('(2, 5)'))).to.be.equal(true)
        })
        it('contains (100, 95)', function () {
          expect(interval.contains(new Interval('(100, 95)'))).to.be.equal(true)
        })
      })

      describe('empty: (3, -2)', function () {
        var interval = new Interval('(3,-2)')

        it('does not contain [1, 5)', function () {
          expect(interval.contains(new Interval('[1, 5)'))).to.be.equal(false)
        })
        it('empty contains empty', function () {
          expect(interval.contains(new Interval('(100, 10)'))).to.be.equal(true)
        })
        it('does not contain [3, 3]', function () {
          expect(interval.contains(new Interval('[3, 3]'))).to.be.equal(false)
        })
        it('does not contain [-2, -2]', function () {
          expect(interval.contains(new Interval('[-2, -2]'))).to.be.equal(false)
        })
      })
    })
  })
})
