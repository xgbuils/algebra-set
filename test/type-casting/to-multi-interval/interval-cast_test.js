var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples')
var raw = require('../../utils/raw-interval')

var Interval = require('../../../src/interval/')
var intervalCast = require('../../../src/type-casting/to-multi-interval/interval-cast')(Interval)

describe('intervalCast', function () {
  describe('when param is some type castable to interval', function () {
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

  describe('when param is an array of castable-to-interval values', function () {
    var param
    var result
    beforeEach(function () {
      param = [
        '(4, 8)',
        samples['[4, 5]'],
        new Interval('{-1}')
      ]
      result = intervalCast(param)
    })
    it('returns an array with the same elements', function () {
      expect(result).to.be.an('array')
      expect(result.length).to.be.equal(param.length)
    })
    it('first element is an Interval instance', function () {
      expect(result.every(function (e) {
        return e instanceof Interval
      })).to.be.equal(true)
    })
    it('first element wraps a correct raw interval', function () {
      expect(result.map(raw)).to.be.deep.equal([
        samples['(4, 8)'],
        samples['[4, 5]'],
        samples['{-1}']
      ])
    })
  })

  describe('when param is a array with a no castable type', function () {
    it('param is the same reference to result', function () {
      var param = ['[2, 5)', new RegExp('^x+c', 'i')]
      var result = intervalCast(param)
      expect(result).to.be.equal(param)
    })
  })

  describe('when param is a array with a no castable type', function () {
    it('param is the same reference to result', function () {
      var param = new RegExp('a*$', 'g')
      var result = intervalCast(param)
      expect(result).to.be.equal(param)
    })
  })
})
