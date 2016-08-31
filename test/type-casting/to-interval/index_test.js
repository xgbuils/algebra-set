var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples')

var Interval = require('../../../src/interval/')
var toInterval = require('../../../src/type-casting/to-interval/')(Interval)

describe('toInterval', function () {
  describe('when is a raw interval', function () {
    var interval
    beforeEach(function () {
      interval = toInterval(samples['(2, 7)'])
    })
    it('element returned wraps the raw interval', function () {
      expect(interval).to.be.deep.equal(samples['(2, 7)'])
    })
  })

  describe('when is a string', function () {
    var interval
    beforeEach(function () {
      interval = toInterval('[3, 9)')
    })
    it('element returned wraps a correct raw interval', function () {
      expect(interval).to.be.deep.equal(samples['[3, 9)'])
    })
  })

  describe('when is Interval instance', function () {
    var param
    var result
    beforeEach(function () {
      param = new Interval('[4, 5]')
      result = toInterval(param)
    })
    it('element returned wraps a correct raw interval', function () {
      expect(result).to.be.deep.equal(samples['[4, 5]'])
    })
    it('interval passed and interval returned does not have the same reference', function () {
      expect(result).to.not.be.equal(param)
    })
  })

  describe('when type of value is impossible to cast', function () {
    it('param is the same reference as result', function () {
      var param = {foo: 'bar'}
      var result = toInterval(param)
      expect(result).to.be.equal(param)
    })
  })
})
