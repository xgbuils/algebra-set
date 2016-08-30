require('chai').should()
var intervalComparator = require('../../src/interval/interval-comparator.js')
var samples = require('../interval-samples')

describe('intervalComparator', function () {
  describe('if beginning of first interval is less than begginning of second interval', function () {
    it('always returns negative number', function () {
      var a = samples['(3, 11]']
      var b = samples['(4, 8)']
      intervalComparator(a, b).should.be.below(0)
    })

    it('always returns negative number', function () {
      var a = samples['[3, 5)']
      var b = samples['(3, 11]']
      intervalComparator(a, b).should.be.below(0)
    })
  })

  describe('if beginning of first interval is greater than begginning of second interval', function () {
    it('always returns positive number', function () {
      var a = samples['(4, 5]']
      var b = samples['[4, 5]']
      intervalComparator(a, b).should.be.above(0)
    })

    it('always returns positive number', function () {
      var a = samples['(3, 11]']
      var b = samples['[3, 5)']
      intervalComparator(a, b).should.be.above(0)
    })
  })

  describe('Given beginning of first interval equal to begginning of second interval', function () {
    describe('if end of first interval is greater than end of second interval', function () {
      it('returns positive number', function () {
        var a = samples['(4, 8)']
        var b = samples['(4, 5]']
        intervalComparator(a, b).should.be.below(0)
      })
    })

    describe('if end of first interval is less than end of second interval', function () {
      it('returns negative number', function () {
        var a = samples['[3, 9]']
        var b = samples['[3, 9)']
        intervalComparator(a, b).should.be.below(0)
      })
    })

    describe('if end of first interval is equal to end of second interval', function () {
      it('returns 0', function () {
        var a = samples['[4, 5]']
        var b = samples['[4, 5]']
        intervalComparator(a, b).should.be.equal(0)
      })
    })
  })
})
