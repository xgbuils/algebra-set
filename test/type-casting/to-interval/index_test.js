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

  describe('when is Interval instance', function () {
    var param
    var result
    beforeEach(function () {
      param = Interval.create(samples['[4, 5]'])
      result = toInterval(param)
    })
    it('returns an Interval instance', function () {
      expect(result).to.be.instanceOf(Interval)
    })
    it('element returned wraps a correct raw interval', function () {
      expect(raw(result)).to.be.deep.equal(samples['[4, 5]'])
    })
    it('interval passed and interval returned does not have the same reference', function () {
      expect(result).to.not.be.equal(param)
    })
  })

  describe('when type of value is impossible to cast', function () {
    it('param is the same reference to result', function () {
      var param = {foo: 'bar'}
      var result = toInterval(param)
      expect(result).to.be.equal(param)
    })
  })
})
