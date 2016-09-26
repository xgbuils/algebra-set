var chai = require('chai')
var expect = chai.expect
var TopologicalSet = require('../../src/set/')
var samples = require('../interval-samples.js')
var rawSet = require('../utils/raw-set.js')

describe('Set', function () {
  describe('TopologicalSet.union', function () {
    it('union of disjoint sets', function () {
      var set1 = '(0, 1] U [8, 9]'
      var set2 = new TopologicalSet('(4, 5) U {7}')

      var result = TopologicalSet.union(set1, set2)

      expect(rawSet(result)).to.be.deep.equal([
        samples['(0, 1]'],
        samples['(4, 5)'],
        samples['{7}'],
        samples['[8, 9]']
      ])
    })

    it('union of intersected sets', function () {
      var set1 = [
        samples['[3, 5]'],
        '{7}'
      ]
      var set2 = '[5, 6) U (6, 8)'

      var result = TopologicalSet.union(set1, set2)

      expect(rawSet(result)).to.be.deep.equal([
        samples['[3, 6)'],
        samples['(6, 8)']
      ])
    })

    it('union of empty sets', function () {
      var set1 = samples['(8, 8)']
      var set2 = '(3, 0]'

      var result = TopologicalSet.union(set1, set2)

      expect(rawSet(result)).to.be.deep.equal([])
    })
  })

  describe('.union', function () {
    it('union method works in the same way that static union method', function () {
      var set1 = new TopologicalSet('(4, 5) U [8, 9]')
      var set2 = '{7} U [3, 5]'
      var set3 = samples['(0, 1]']

      var result = set1.union(set2, set3)

      expect(rawSet(result)).to.be.deep.equal([
        samples['(0, 1]'],
        samples['[3, 5]'],
        samples['{7}'],
        samples['[8, 9]']
      ])
    })
  })

  describe('.contains', function () {
    describe('containing numbers', function () {
      describe('[4, 5] U [3, 9) U (10, 11]', function () {
        var set = new TopologicalSet('[4, 5] U [3, 9) U (10, 11]')
        it('contains 8', function () {
          expect(set.contains(8)).to.be.equal(true)
        })

        it('contains 3', function () {
          expect(set.contains(3)).to.be.equal(true)
        })

        it('not contains 9', function () {
          expect(set.contains(9)).to.be.equal(false)
        })

        it('not contains 2.5', function () {
          expect(set.contains(2.5)).to.be.equal(false)
        })
      })

      describe('(4, 5) U (5, 6)', function () {
        var set = new TopologicalSet('(4, 5) U (5, 6)')
        it('contains 4.5', function () {
          expect(set.contains(4.5)).to.be.equal(true)
        })

        it('contains 5.01', function () {
          expect(set.contains(5.01)).to.be.equal(true)
        })

        it('not contains 5', function () {
          expect(set.contains(5)).to.be.equal(false)
        })

        it('not contains 100', function () {
          expect(set.contains(100)).to.be.equal(false)
        })
      })

      describe('{1, 3, 4, 5, 7}', function () {
        var set = new TopologicalSet('{1, 3, 4, 5, 7}')
        it('contains 1', function () {
          expect(set.contains(1)).to.be.equal(true)
        })

        it('contains 3', function () {
          expect(set.contains(3)).to.be.equal(true)
        })

        it('not contains 6', function () {
          expect(set.contains(6)).to.be.equal(false)
        })

        it('not contains 7.5', function () {
          expect(set.contains(7.5)).to.be.equal(false)
        })
      })

      describe('[1,1]', function () {
        var set = new TopologicalSet('[1,1]')
        it('contains 1', function () {
          expect(set.contains(1)).to.be.equal(true)
        })

        it('not contains 1.5', function () {
          expect(set.contains(1.5)).to.be.equal(false)
        })

        it('not contains 0', function () {
          expect(set.contains(0)).to.be.equal(false)
        })
      })

      describe('define as a function', function () {
        var set = new TopologicalSet({
          contains: function (e) {
            return e > 5
          }
        })
        it('contains 6', function () {
          expect(set.contains(6)).to.be.equal(true)
        })

        it('not contains 5.5', function () {
          expect(set.contains(5.5)).to.be.equal(true)
        })

        it('does not contain 5', function () {
          expect(set.contains(5)).to.be.equal(false)
        })

        it('does not contain 3', function () {
          expect(set.contains(3)).to.be.equal(false)
        })
      })

      describe('mixed sets (predicates & intervals)', function () {
        var set
        beforeEach(function () {
          set = TopologicalSet.union(function (e) {
            return e === 5 || e === 6
          }, '(2, 3) U [7, 9)')
        })

        it('number contained by predicate', function () {
          expect(set.contains(5)).to.be.equal(true)
        })

        it('number contained by interval', function () {
          expect(set.contains(8)).to.be.equal(true)
        })

        it('number not contained by predicate or interval', function () {
          expect(set.contains(4)).to.be.equal(false)
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

      describe('mixed sets (predicates & intervals)', function () {
        var set
        beforeEach(function () {
          set = TopologicalSet.union(function (e) {
            return e >= 5 || e <= 6
          }, '(2, 3) U [7, 9)')
        })

        it('set not contained by intervals returns null if there are a predicate', function () {
          // it's impossible to know if set is contained in predicate. Then it returns null.
          expect(set.contains('(5, 6)')).to.be.equal(null)
        })

        it('set contained by intervals returns true', function () {
          expect(set.contains('(7, 9) U {2.5}')).to.be.equal(true)
        })

        it('set with predicates is imposible to know if is contained inside ohter set', function () {
          var container = new TopologicalSet('[0, 10]')
          expect(container.contains(set)).to.be.equal(null)
        })
      })
    })
  })
})
