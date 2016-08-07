var chai = require('chai')
var expect = chai.expect

var predicateCast = require('../../../src/type-casting/to-set/predicate-cast.js')

describe('predicateCast', function () {
  describe('if it is passed a function', function () {
    var obj
    var fn
    beforeEach(function () {
      fn = function (e) {
        e > 5
      }
      obj = predicateCast(fn)
    })
    it('returns an object', function () {
      expect(obj).to.be.an('object')
    })
    it('object has a function property `.fn` with the same reference as parameter', function () {
      expect(obj.fn).to.be.equal(fn)
    })
    it('object has a function property `.equality` with that represents `===` operator', function () {
      expect(obj.equality).to.be.a('function')
      expect(obj.equality(3, 3)).to.be.equal(true)
    })
  })

  describe('if it is passed an object with properties .contains and .equality', function () {
    var obj
    var param
    beforeEach(function () {
      param = {
        contains: function (e) {
          e > 5
        },
        equality: function (a, b) {
          return Math.abs(a - b) <= 1
        }
      }
      obj = predicateCast(param)
    })
    it('returns an object', function () {
      expect(obj).to.be.an('object')
    })
    it('object has a function property `.fn` with the same reference as parameter.contains', function () {
      expect(obj.fn).to.be.equal(param.contains)
    })
    it('object has a function property `.equality` with the same reference as parameter.equality', function () {
      expect(obj.equality).to.be.equal(param.equality)
    })
  })

  describe('if it is passed an object with property .contains and not .equality', function () {
    var obj
    var param
    beforeEach(function () {
      param = {
        contains: function (e) {
          e > 5
        }
      }
      obj = predicateCast(param)
    })
    it('returns an object', function () {
      expect(obj).to.be.an('object')
    })
    it('object has a function property `.fn` with the same reference as parameter.contains', function () {
      expect(obj.fn).to.be.equal(param.contains)
    })
    it('object has a function property `.equality` with that represents `===` operator', function () {
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

