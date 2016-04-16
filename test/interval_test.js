var chai = require('chai')
var samples = require('./interval-samples')
var Interval = require('../src/interval.js')
var wrap = require('./utils/wrap-interval')
var raw = require('./utils/raw-interval')

chai.should()

describe('Interval', function () {
  describe('Interval.create', function () {
    it('[4,5]', function () {
      var interval = Interval.create('[', 4, 5, ']').interval
      interval.should.be.deep.equal(samples.closed4Closed5)
    })

    it('[3, 9)', function () {
      var interval = Interval.create('[', 3, 9, ')').interval
      interval.should.be.deep.equal(samples.closed3Opened9)
    })

    it('(3 ,11]', function () {
      var interval = Interval.create('(', 3, 11, ']').interval
      interval.should.be.deep.equal(samples.opened3Closed11)
    })

    it('[ 7 , 7 ]', function () {
      var interval = Interval.create('[', 7, 7, ']').interval
      interval.should.be.deep.equal(samples.isolated7)
    })
  })

  describe('Interval.union', function () {
    it('[4,5] U [ 3 , 9) --> [3, 9)', function () {
      var set = Interval.union.apply(null, [
        samples.closed4Closed5,
        samples.closed3Opened9
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.closed3Opened9
      ])
    })

    it('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
      var set = Interval.union.apply(null, [
        samples.opened4Opened8,
        samples.closed3Opened5,
        samples.isolatedMinus1,
        samples.isolated7
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.isolatedMinus1,
        samples.closed3Opened8
      ])
    })

    it('[5, 5] --> {5}', function () {
      var set = Interval.union.apply(null, [
        samples.isolated5
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.isolated5
      ])
    })

    it('(3, 11] --> (3, 11]', function () {
      var set = Interval.union.apply(null, [
        samples.opened3Closed11
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.opened3Closed11
      ])
    })

    it('(3, 0] --> empty', function () {
      var set = Interval.union.apply(null, [
        samples.opened3Closed0
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([])
    })

    it('(3, 0] U [7, 7] U (2, 7) --> (2, 7]', function () {
      var set = Interval.union.apply(null, [
        samples.opened2Opened7,
        samples.isolated7
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.opened2Closed7
      ])
    })
  })

  describe('.contains()', function () {
    describe('isolated: [-2, -2]', function () {
      var interval = new Interval('[-2,-2]')

      it('contains -2', function () {
        interval.contains(-2).should.be.true
      })
      it('does not contain -2.5', function () {
        interval.contains(-2.5).should.be.false
      })
      it('does not contain 0', function () {
        interval.contains(0).should.be.false
      })
    })

    describe('[1, 6)', function () {
      var interval = new Interval('[1, 6)')

      it('does not contain -2', function () {
        interval.contains(-2).should.be.false
      })
      it('contains 1.5', function () {
        interval.contains(1.5).should.be.true
      })
      it('does not contain 6', function () {
        interval.contains(6).should.be.false
      })
    })

    describe('empty: (3, -2)', function () {
      var interval = new Interval('(3,-2)')

      it('does not contain -2', function () {
        interval.contains(-2).should.be.equal(false)
      })
      it('does not contain 1.5', function () {
        interval.contains(1.5).should.be.equal(false)
      })
      it('does not contain 0', function () {
        interval.contains(0).should.be.equal(false)
      })
    })
  })
})
