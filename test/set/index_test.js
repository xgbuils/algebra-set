var chai = require('chai')
var expect = chai.expect
var TopologicalSet = require('../../src/set/')
var samples = require('../interval-samples.js')

describe('Set', function () {
  describe('containing numbers', function () {
    describe('[4, 5] U [3, 9) U (10, 11]', function () {
      var set = new TopologicalSet('[4, 5] U [3, 9) U (10, 11]')
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
      var set = new TopologicalSet('(4, 5) U (5, 6)')
      it('contains 4.5', function () {
        set.contains(4.5).should.be.true
      })

      it('contains 5.01', function () {
        set.contains(5.01).should.be.true
      })

      it('not contains 5', function () {
        set.contains(5).should.be.false
      })

      it('not contains 100', function () {
        set.contains(100).should.be.false
      })
    })

    describe('{1, 3, 4, 5, 7}', function () {
      var set = new TopologicalSet('{1, 3, 4, 5, 7}')
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
      var set = new TopologicalSet('[1,1]')
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
      var set = new TopologicalSet({
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

      it('does not contain 3', function () {
        set.contains(3).should.be.false
      })
    })
  })

  describe('containing sets', function () {
    describe('(4, 5) U (5, 6)', function () {
      var set = new TopologicalSet('(4, 5) U (5, 6)')
      it('contains (5, 6)', function () {
        expect(set.contains('(5, 6)')).to.be.equal(true)
      })

      it('contains (4.5, 5) U {5.5}', function () {
        expect(set.contains(new TopologicalSet('(4.5, 5) U {5.5}'))).to.be.equal(true)
      })

      it('does not contain (4, 6)', function () {
        expect(set.contains(samples['(4, 6)'])).to.be.equal(false)
      })

      it('does not contain {5}', function () {
        expect(set.contains([
          samples['{5}']
        ])).to.be.equal(false)
      })

      it('does not contain (3, 4.5)', function () {
        expect(set.contains('(3, 4.5)')).to.be.equal(false)
      })
    })

    describe('{-1} U (3, 0] U {3, 5} U (3, 5)', function () {
      var set = new TopologicalSet('{-1} U (3, 0] U {3, 5} U (3, 5)')
      it('contains (3, 5)', function () {
        expect(set.contains(samples['[3, 5)'])).to.be.equal(true)
      })

      it('contains {-1}, {4, 3}', function () {
        expect(set.contains([
          samples['{-1}'],
          '{4}',
          '[3, 3]'
        ])).to.be.equal(true)
      })

      it('does not contain {0}', function () {
        expect(set.contains('{0}')).to.be.equal(false)
      })

      it('does not contain [-1, 5]', function () {
        expect(set.contains('[-1, 5]')).to.be.equal(false)
      })
    })
  })
})
