var chai = require('chai')
var limitComparator = require('../src/limit-comparator.js')
var samples = require('./interval-samples')

chai.should()

describe('limitComparator', function () {
  describe('when property value of first item is greater than second', function () {
    it('always return positive number', function () {
      limitComparator({
        value: 100,
        limit: 1
      }, {
        value: 50,
        limit: 1
      }).should.be.above(0)
    })

    it('always return positive number', function () {
      limitComparator({
        value: 100,
        limit: -1
      }, {
        value: 50,
        limit: 1
      }).should.be.above(0)
    })
  })

  describe('when property value of first item is less than second', function () {
    it('always return negative number', function () {
      limitComparator({
        value: -3.1,
        limit: -1
      }, {
        value: 50,
        limit: -3
      }).should.be.below(0)
    })

    it('always return negative number', function () {
      limitComparator({
        value: -2,
        limit: -1
      }, {
        value: 50,
        limit: -1
      }).should.be.below(0)
    })
  })

  describe('when property value of first item is equal to second', function () {
    describe('knowing that limit property must be -1, 0 or 1', function () {
      it('always returns the substraction between the first and second', function () {
        limitComparator({
          value: 5,
          limit: -1
        }, {
          value: 5,
          limit: 1
        }).should.be.equal(-2)
      })

      it('always returns the substraction between the first and second', function () {
        limitComparator({
          value: 0,
          limit: 1
        }, {
          value: 0,
          limit: 0
        }).should.be.equal(1)
      })

      it('always returns the substraction between the first and second', function () {
        limitComparator({
          value: -3,
          limit: 0
        }, {
          value: -3,
          limit: 0
        }).should.be.equal(0)
      })
    })
  })
})
