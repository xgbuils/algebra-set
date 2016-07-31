var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples')
var raw = require('../../utils/raw-interval')

var Interval = require('../../../src/interval.js')
var toInterval = require('../../../src/type-casting/to-interval/')(Interval)

describe('toInterval', function () {
  describe('when is a raw interval', function () {
    var interval
    beforeEach(function () {
      interval = toInterval(samples['(2, 7)'])
    })
    it('returns an Interval instance', function () {
      expect(interval).to.be.instanceOf(Interval)
    })
    it('element returned wraps the raw interval', function () {
      expect(raw(interval)).to.be.deep.equal(samples['(2, 7)'])
    })
  })

  describe('when is a string', function () {
    var interval
    beforeEach(function () {
      interval = toInterval('[3, 9)')
    })
    it('returns an Interval instance', function () {
      expect(interval).to.be.instanceOf(Interval)
    })
    it('element returned wraps a correct raw interval', function () {
      expect(raw(interval)).to.be.deep.equal(samples['[3, 9)'])
    })
  })
})
