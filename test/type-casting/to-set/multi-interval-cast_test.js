var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples.js')
var rawSet = require('../../utils/raw-set.js')

var TSet = require('../../../src/set/')
var TInterval = require('math.interval')
var multiIntervalCast = require('../../../src/type-casting/to-set/multi-interval-cast')(TSet, TInterval)

describe('multiIntervalCast', function () {
  describe('when param is string', function () {
    var set
    beforeEach(function () {
      set = multiIntervalCast('[3, 5) U {5, -1}')
    })
    it('returns an object that wraps an array of intervals', function () {
      expect(set).to.be.an('object')
      expect(rawSet(set)).to.be.an('array')
    })
    it('returns an object that has not properties .fn and .equality', function () {
      expect(set).to.have.not.property('contains')
      expect(set).to.have.not.property('equality')
    })
  })

  describe('when param is an array of castable-to-interval values', function () {
    var param
    var result
    beforeEach(function () {
      param = [
        '[3, 9)',
        samples['(4, 5]'],
        samples['(3, 0]'],
        new TInterval('{5}')
      ]
      result = multiIntervalCast(param)
    })
    it('returns an array with the same elements', function () {
      expect(result).to.be.an('object')
    })
    it('returns correct raw set', function () {
      expect(rawSet(result)).to.deep.equal([
        samples['[3, 9)']
      ])
    })
    it('returns an object that has not properties .fn and .equality', function () {
      expect(result).to.have.not.property('contains')
      expect(result).to.have.not.property('equality')
    })
  })

  describe('when param is no castable type', function () {
    it('param is the same reference to result', function () {
      var param = true
      var result = multiIntervalCast(param)
      expect(result).to.be.equal(param)
    })
  })
})
