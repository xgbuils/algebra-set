require('chai').should()
var intervalComparator = require('../../src/utils/interval-comparator.js')
var samples = require('../interval-samples')
var wrap = require('./wrap-interval')

describe('intervalComparator', function () {
  describe('if beginning of first interval is less than begginning of second interval', function () {
    it('always returns negative number', function () {
      intervalComparator(wrap(samples['(3, 11]']), wrap(samples['(4, 8)'])).should.be.below(0)
    })

    it('always returns negative number', function () {
      intervalComparator(wrap(samples['[3, 5)']), wrap(samples['(3, 11]'])).should.be.below(0)
    })
  })

  describe('if beginning of first interval is greater than begginning of second interval', function () {
    it('always returns positive number', function () {
      intervalComparator(wrap(samples['(4, 5]']), wrap(samples['[4, 5]'])).should.be.above(0)
    })

    it('always returns positive number', function () {
      intervalComparator(wrap(samples['(3, 11]']), wrap(samples['[3, 5)'])).should.be.above(0)
    })
  })

  describe('Given beginning of first interval equal to begginning of second interval', function () {
    describe('if end of first interval is greater than end of second interval', function () {
      it('returns positive number', function () {
        intervalComparator(wrap(samples['(4, 8)']), wrap(samples['(4, 5]'])).should.be.below(0)
      })
    })

    describe('if end of first interval is less than end of second interval', function () {
      it('returns negative number', function () {
        intervalComparator(wrap(samples['[3, 9]']), wrap(samples['[3, 9)'])).should.be.below(0)
      })
    })

    describe('if end of first interval is equal to end of second interval', function () {
      it('returns 0', function () {
        intervalComparator(wrap(samples['[4, 5]']), wrap(samples['[4, 5]'])).should.be.equal(0)
      })
    })
  })
})
