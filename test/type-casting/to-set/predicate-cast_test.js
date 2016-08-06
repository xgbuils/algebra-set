var chai = require('chai')
var expect = chai.expect

var predicateCast = require('../../../src/type-casting/to-set/predicate-cast.js')

describe('predicateCast', function () {
  describe('if it is passed a function', function () {
    var obj
    var fn
    beforeEach(function () {
      fn = function (a) {
        e > 5
      }
      obj = predicateCast(fn)
    })
    it('returns an object', function () {
      expect(obj).to.be.an('object')
    })
    it('object has a function property `.contains` with the same reference as parameter', function () {
      expect(obj.contains).to.be.equal(fn)
    })
    it('object has a function property `.equality` with the same that represents `===`', function () {
      expect(obj.equality).to.be.a('function')
      expect(obj.equality(3, 3)).to.be.equal(true)
    })
  })

  describe('when type of value is impossible to cast', function () {
    it('param is the same reference as result', function () {
      var param = /a+/
      var result = predicateCast(param)
      expect(result).to.be.equal(param)
    })
  })
})

