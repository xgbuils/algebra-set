var chai = require('chai')
var expect = chai.expect
var samples = require('../../interval-samples.js')
var rawInterval = require('../../utils/raw-interval.js')
var rawSet = require('../../utils/raw-set.js')
var assert = require('assert')

var TSet = require('../../../src/set.js')
var Interval = require('../../../src/interval.js')
var setCast = require('../../../src/type-casting/to-multi-interval/set-cast.js')(TSet)

describe('setCast', function () {
  describe('if is a string then try to parse to array of intervals', function () {
    var intervals
    beforeEach(function () {
      intervals = setCast('(2, 7) U {5, 7}')
    })
    it('returns an array', function () {
      expect(intervals).to.be.an('array')
    })
    it('all elements of array are Interval instances', function () {
      intervals.forEach(function (e, index) {
        assert.ok(e instanceof Interval, e + ' in position ' + index + ' is not an instance of Interval class')
      })
    })
    it('intervals has the correct values', function () {
      var expected = [
        samples['(2, 7)'],
        samples['{5}'],
        samples['{7}']
      ]
      assert.ok(intervals.length === expected.length,
        intervals.length + ' is not correct number of intervals. Expected: ' + expected.length)
      expected.forEach(function (e) {
        var errors = []
        var ok = intervals.map(rawInterval).some(function (interval) {
          try {
            assert.deepEqual(e, interval)
            return true
          } catch (e) {
            errors.push(e)
            return false
          }
        })
        assert.ok(ok, e + ' is not contained in ' + intervals + '\n' + errors.join('\n'))
      })
    })
  })

  describe('when is a Topological Set instance', function () {
    var param
    var result
    beforeEach(function () {
      param = new TSet('(2, 7) U {5, 7}')
      result = setCast(param)
    })
    it('returns an array', function () {
      expect(result).to.be.an('array')
    })
    it('all elements of array are Interval instances', function () {
      result.forEach(function (e, index) {
        assert.ok(e instanceof Interval, e + ' in position ' + index + ' is not an instance of Interval class')
      })
    })
    it('result has the same intervals as raw set parameter', function () {
      expect(result).to.be.deep.equal(rawSet(param))
    })
  })

  describe('when type of value is impossible to cast', function () {
    it('param is the same reference as result', function () {
      var param = {foo: 'bar'}
      var result = setCast(param)
      expect(result).to.be.equal(param)
    })
  })
})

