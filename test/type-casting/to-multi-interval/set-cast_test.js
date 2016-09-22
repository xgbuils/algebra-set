var chai = require('chai')
var expect = chai.expect
var rawInterval = require('../../../src/interval/raw-interval.js')
var rawSet = require('../../utils/raw-set.js')
var assert = require('assert')

var TSet = require('../../../src/set/')
var Interval = require('../../../src/interval/')
var setCast = require('../../../src/type-casting/to-multi-interval/set-cast.js')(TSet)

describe('setCast', function () {
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
      expect(result.map(rawInterval)).to.be.deep.equal(rawSet(param))
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

