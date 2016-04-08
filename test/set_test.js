var chai = require('chai')
var samples = require('./interval-samples')
var Set = require('../src/set.js')

chai.should()

describe('Set', function () {
  describe('[4, 5] U [3, 9) U (10, 11]', function () {
    var set = new Set('[4, 5] U [3, 9) U (10, 11]')
    it('contains 8', function () {
      set.contains(8).should.be.true
    })

    it('contains 3', function () {
      set.contains(3).should.be.true
    })

    it('not contains 9', function () {
      set.contains(9).should.be.false
    })

    it('not contains 2.5', function () {
      set.contains(2.5).should.be.false
    })
  })

  describe('(4, 5) U (5, 6)', function () {
    var set = new Set('(4, 5) U (5, 6)')
    it('contains 4.5', function () {
      set.contains(4.5).should.be.true
    })

    it('contains 5.01', function () {
      set.contains(5.01).should.be.true
    })

    it('not contains 5', function () {
      set.contains(5).should.be.false
    })

    it('not contains 2.5', function () {
      set.contains(100).should.be.false
    })
  })

  describe('{1, 3, 4, 5, 7}', function () {
    var set = new Set('{1, 3, 4, 5, 7}')
    it('contains 1', function () {
      set.contains(1).should.be.true
    })

    it('contains 3', function () {
      set.contains(3).should.be.true
    })

    it('not contains 6', function () {
      set.contains(6).should.be.false
    })

    it('not contains 7.5', function () {
      set.contains(7.5).should.be.false
    })
  })

  describe('[1,1]', function () {
    var set = new Set('[1,1]')
    it('contains 1', function () {
      set.contains(1).should.be.true
    })

    it('not contains 1.5', function () {
      set.contains(1.5).should.be.false
    })

    it('not contains 0', function () {
      set.contains(0).should.be.false
    })
  })

  describe('define as a function', function () {
    var set = new Set({
      contains: function (e) {
        return e > 5
      }
    })
    it('contains 6', function () {
      set.contains(6).should.be.true
    })

    it('not contains 5.5', function () {
      set.contains(5.5).should.be.true
    })

    it('does not contain 5', function () {
      set.contains(5).should.be.false
    })

    it('does not contain 6', function () {
      set.contains(3).should.be.false
    })
  })
})