require('chai').should()
var intervalComparator = require('../../src/utils/interval-comparator.js')
var samples = require('../interval-samples')
var wrap = require('./wrap-interval')

describe('intervalComparator', function () {
  describe('if beginning of first interval is less than begginning of second interval', function () {
    it('always returns negative number', function () {
      intervalComparator(wrap(samples.opened3Closed11), wrap(samples.OPENED_4_TO_OPENED_8)).should.be.below(0)
    })

    it('always returns negative number', function () {
      intervalComparator(wrap(samples['[3, 5)']), wrap(samples.opened3Closed11)).should.be.below(0)
    })
  })

  describe('if beginning of first interval is greater than begginning of second interval', function () {
    it('always returns positive number', function () {
      intervalComparator(wrap(samples.opened4Closed5), wrap(samples.closed4Closed5)).should.be.above(0)
    })

    it('always returns positive number', function () {
      intervalComparator(wrap(samples.opened3Closed11), wrap(samples['[3, 5)'])).should.be.above(0)
    })
  })

  describe('Given beginning of first interval equal to begginning of second interval', function () {
    describe('if end of first interval is greater than end of second interval', function () {
      it('returns positive number', function () {
        intervalComparator(wrap(samples.OPENED_4_TO_OPENED_8), wrap(samples.opened4Closed5)).should.be.below(0)
      })
    })

    describe('if end of first interval is less than end of second interval', function () {
      it('returns negative number', function () {
        intervalComparator(wrap(samples.closed3Closed9), wrap(samples.closed3Opened9)).should.be.below(0)
      })
    })

    describe('if end of first interval is equal to end of second interval', function () {
      it('returns 0', function () {
        intervalComparator(wrap(samples.closed4Closed5), wrap(samples.closed4Closed5)).should.be.equal(0)
      })
    })
  })
})
