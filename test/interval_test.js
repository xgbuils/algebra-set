var chai = require('chai')
var samples = require('./interval-samples')
var Interval = require('../src/interval.js')

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
