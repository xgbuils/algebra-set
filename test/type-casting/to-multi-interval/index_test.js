var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples.js')
var raw = require('../../utils/raw-interval.js')

var TSet = require('../../../src/set/')
var TInterval = require('../../../src/interval/')
var toMultiInterval = require('../../../src/type-casting/to-multi-interval/')(TSet, TInterval)

describe('toMultiInterval', function () {
  describe('when param is string', function () {
    it('returns an object that has not properties .fn and .equality', function () {
      var param = '{7, 5, -1}'
      var result = toMultiInterval(param)
      expect(result.map(raw)).to.be.deep.equal([
        samples['{7}'],
        samples['{5}'],
        samples['{-1}']
      ])
    })
  })

  describe('when param is raw interval', function () {
    it('returns correct array of intervals', function () {
      var param = samples['(3, 0]']
      var result = toMultiInterval(param).map(raw)
      expect(result).to.deep.equal([
        samples['(3, 0]']
      ])
    })
  })

  describe('when param is a Set', function () {
    it('returns correct raw set', function () {
      var param = new TSet('{7} U (2, 7)')
      var result = toMultiInterval(param)
      expect(result.map(raw)).to.deep.equal([
        samples['(2, 7]']
      ])
    })
  })

  describe('when param is no castable type', function () {
    it('param is the same reference to result', function () {
      var param = 45
      var result = toMultiInterval(param)
      expect(result).to.be.equal(param)
    })
  })
})
