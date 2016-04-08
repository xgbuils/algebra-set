var chai = require('chai')
var intervalComparator = require('../src/interval-comparator.js')
var samples = require('./interval-samples')

describe('intervalComparator', function () {
  describe('if beginning of first interval is less than begginning of second interval', function () {
    it('always returns negative number', function () {
      intervalComparator(samples.opened3Closed11, samples.opened4Opened8).should.be.below(0)
    })

    it('always returns negative number', function () {
      intervalComparator(samples.closed3Opened5, samples.opened3Closed11).should.be.below(0)
    })
  })

  describe('if beginning of first interval is greater than begginning of second interval', function () {
    it('always returns positive number', function () {
      intervalComparator(samples.opened4Closed5, samples.closed4Closed5).should.be.above(0)
    })

    it('always returns positive number', function () {
      intervalComparator(samples.opened3Closed11, samples.closed3Opened5).should.be.above(0)
    })
  })

  describe('Given beginning of first interval equal to begginning of second interval', function () {
    describe('if end of first interval is greater than end of second interval', function () {
      it('returns positive number', function () {
        intervalComparator(samples.opened4Opened8, samples.opened4Closed5).should.be.below(0)
      })
    })

    describe('if end of first interval is less than end of second interval', function () {
      it('returns negative number', function () {
        intervalComparator(samples.closed3Closed9, samples.closed3Opened9).should.be.below(0)
      })
    })

    describe('if end of first interval is equal to end of second interval', function () {
      it('returns 0', function () {
        intervalComparator(samples.closed4Closed5, samples.closed4Closed5).should.be.equal(0)
      })
    })
  })
})