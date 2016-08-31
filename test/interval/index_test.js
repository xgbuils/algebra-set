var chai = require('chai')
var expect = chai.expect
var samples = require('../interval-samples')
var Interval = require('../../src/interval/')
var raw = require('../utils/raw-interval')
var clone = require('clone')

describe('Interval', function () {
  describe('Interval.union', function () {
    describe('[4,5] U [ 3 , 9) --> [3, 9)', function () {
      var copies = {
        '[4, 5]': clone(samples['[4, 5]']),
        '[3, 9)': clone(samples['[3, 9)'])
      }
      var intervalList = Interval.union.apply(null, [
        samples['[4, 5]'],
        samples['[3, 9)']
      ])

      it('returns expected union', function () {
        expect(intervalList.map(raw)).to.be.deep.equal([
          samples['[3, 9)']
        ])
      })

      it('does not produce side effects', function () {
        expect(samples['[4, 5]']).to.deep.equal(copies['[4, 5]'])
        expect(samples['[3, 9)']).to.deep.equal(copies['[3, 9)'])
      })
    })

    describe('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
      var copies = {
        '(4, 8)': clone(samples['(4, 8)']),
        '[3, 5)': clone(samples['[3, 5)']),
        '{-1}': clone(samples['{-1}']),
        '{7}': clone(samples['{7}'])
      }
      var intervalList = Interval.union.apply(null, [
        samples['(4, 8)'],
        samples['[3, 5)'],
        samples['{-1}'],
        samples['{7}']
      ])

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['{-1}'],
        samples['[3, 8)']
      ])

      it('returns expected union', function () {
        expect(intervalList.map(raw)).to.be.deep.equal([
          samples['{-1}'],
          samples['[3, 8)']
        ])
      })

      it('does not produce side effects', function () {
        expect(samples['(4, 8)']).to.deep.equal(copies['(4, 8)'])
        expect(samples['[3, 5)']).to.deep.equal(copies['[3, 5)'])
        expect(samples['{-1}']).to.deep.equal(copies['{-1}'])
        expect(samples['{7}']).to.deep.equal(copies['{7}'])
      })
    })

    it('[5, 5] --> {5}', function () {
      var intervalList = Interval.union.apply(null, [
        samples['{5}']
      ])

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['{5}']
      ])
    })

    it('(3, 11] --> (3, 11]', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(3, 11]']
      ])

      expect(intervalList.map(raw)).to.be.deep.equal([
        samples['(3, 11]']
      ])
    })

    it('(3, 0] --> empty', function () {
      var intervalList = Interval.union.apply(null, [
        samples['(3, 0]']
      ])

      expect(intervalList).to.be.deep.equal([])
    })

    describe('(3, 0] U [7, 7] U (2, 7) --> (2, 7]', function () {
      var copies = {
        '(2, 7)': clone(samples['(2, 7)']),
        '{7}': clone(samples['{7}'])
      }
      var intervalList = Interval.union.apply(null, [
        samples['(2, 7)'],
        samples['{7}']
      ])

      it('returns expected union', function () {
        expect(intervalList.map(raw)).to.be.deep.equal([
          samples['(2, 7]']
        ])
      })

      it('does not produce side effects', function () {
        expect(samples['(2, 7)']).to.deep.equal(copies['(2, 7)'])
        expect(samples['{7}']).to.deep.equal(copies['{7}'])
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
