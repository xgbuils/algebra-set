var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples')
var raw = require('../../utils/raw-interval')

var Interval = require('../../../src/interval.js')
var intervalCast = require('../../../src/type-casting/to-multi-interval/interval-cast')


describe('intervalCast', function () {
  describe('when is array of raw interval', function () {
  	var interval
  	beforeEach(function () {
      interval = intervalCast(samples['[3, 5)'])
  	})
    it('returns an array of 1 element', function () {
      expect(interval).to.be.an('array')
      expect(interval.length).to.be.equal(1)
    })
    it('first element is an Interval instance', function () {
      expect(interval[0]).to.be.instanceOf(Interval)
    })
    it('first element wraps the raw interval', function () {
      expect(raw(interval[0])).to.be.deep.equal(samples['[3, 5)'])
    })
  })
})
