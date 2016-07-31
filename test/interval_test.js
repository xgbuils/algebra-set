var chai = require('chai')
var samples = require('./interval-samples')
var Interval = require('../src/interval.js')
var raw = require('./utils/raw-interval')

chai.should()

describe('Interval', function () {
  describe('Interval.create', function () {
    it('[4,5]', function () {
      var interval = Interval.create('[', 4, 5, ']').interval
      interval.should.be.deep.equal(samples['[4, 5]'])
    })

    it('[3, 9)', function () {
      var interval = Interval.create('[', 3, 9, ')').interval
      interval.should.be.deep.equal(samples['[3, 9)'])
    })

    it('(3 ,11]', function () {
      var interval = Interval.create('(', 3, 11, ']').interval
      interval.should.be.deep.equal(samples['(3, 11]'])
    })

    it('[ 7 , 7 ]', function () {
      var interval = Interval.create('[', 7, 7, ']').interval
      interval.should.be.deep.equal(samples['{7}'])
    })
  })

  describe('Interval.union', function () {
    it('[4,5] U [ 3 , 9) --> [3, 9)', function () {
      var set = Interval.union.apply(null, [
        samples['[4, 5]'],
        samples['[3, 9)']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([
        samples['[3, 9)']
      ])
    })

    it('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
      var set = Interval.union.apply(null, [
        samples['(4, 8)'],
        samples['[3, 5)'],
        samples['{-1}'],
        samples['{7}']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([
        samples['{-1}'],
        samples['[3, 8)']
      ])
    })

    it('[5, 5] --> {5}', function () {
      var set = Interval.union.apply(null, [
        samples['{5}']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([
        samples['{5}']
      ])
    })

    it('(3, 11] --> (3, 11]', function () {
      var set = Interval.union.apply(null, [
        samples['(3, 11]']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([
        samples['(3, 11]']
      ])
    })

    it('(3, 0] --> empty', function () {
      var set = Interval.union.apply(null, [
        samples['(3, 0]']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([])
    })

    it('(3, 0] U [7, 7] U (2, 7) --> (2, 7]', function () {
      var set = Interval.union.apply(null, [
        samples['(2, 7)'],
        samples['{7}']
      ].map(Interval.create)).map(raw)
      set.should.be.deep.equal([
        samples['(2, 7]']
      ])
    })
  })

  describe('.contains()', function () {
    describe('containing numbers...', function () {
      describe('isolated: [-2, -2]', function () {
        var interval = new Interval('[-2,-2]')

        it('contains -2', function () {
          interval.contains(-2).should.be.true
        })
        it('does not contain -2.5', function () {
          interval.contains(-2.5).should.be.false
        })
        it('does not contain 0', function () {
          interval.contains(0).should.be.false
        })
      })

      describe('[1, 6)', function () {
        var interval = new Interval('[1, 6)')

        it('does not contain -2', function () {
          interval.contains(-2).should.be.false
        })
        it('contains 1.5', function () {
          interval.contains(1.5).should.be.true
        })
        it('does not contain 6', function () {
          interval.contains(6).should.be.false
        })
      })

      describe('empty: (3, -2)', function () {
        var interval = new Interval('(3,-2)')

        it('does not contain -2', function () {
          interval.contains(-2).should.be.equal(false)
        })
        it('does not contain 1.5', function () {
          interval.contains(1.5).should.be.equal(false)
        })
        it('does not contain 0', function () {
          interval.contains(0).should.be.equal(false)
        })
      })
    })

    describe('containing intervals...', function () {
      describe('isolated: [-2, -2]', function () {
        var interval = new Interval('[-2,-2]')

        it('contains [-2, -2]', function () {
          interval.contains(new Interval('[-2,-2]')).should.be.true
        })
        it('does not contain [1, 1]', function () {
          interval.contains(new Interval('[1, 1]')).should.be.false
        })
        it('does not contain [-2, 0)', function () {
          interval.contains(new Interval('[-2, 0)')).should.be.false
        })
        it('does not contain [-4, -2]', function () {
          interval.contains(new Interval('[-4, -2]')).should.be.false
        })
        it('does not contain (-2, 1]', function () {
          interval.contains(new Interval('(-2, 1]')).should.be.false
        })
        it('does not contain [-5, -2)', function () {
          interval.contains(new Interval('[-5,-2)')).should.be.false
        })
        it('does not contain [-4, 8)', function () {
          interval.contains(new Interval('[-4, 8)')).should.be.false
        })
        it('contains empty set: (8, -4]', function () {
          interval.contains(new Interval('(8, -4]')).should.be.true
        })
      })

      describe('[1, 6)', function () {
        var interval = new Interval('[1, 6)')

        it('contains [2, 2]', function () {
          interval.contains(new Interval('[2, 2]')).should.be.true
        })
        it('does not contain [1, 6]', function () {
          interval.contains(new Interval('[1, 6]')).should.be.false
        })
        it('contains [1, 6)', function () {
          interval.contains(new Interval('[1, 6)')).should.be.true
        })
        it('contains (1, 6)', function () {
          interval.contains(new Interval('(1, 6)')).should.be.true
        })
        it('contains (2, 5)', function () {
          interval.contains(new Interval('(2, 5)')).should.be.true
        })
        it('contains (0, 5)', function () {
          interval.contains(new Interval('(2, 5)')).should.be.true
        })
        it('contains (100, 95)', function () {
          interval.contains(new Interval('(100, 95)')).should.be.true
        })
      })

      describe('empty: (3, -2)', function () {
        var interval = new Interval('(3,-2)')

        it('does not contain [1, 5)', function () {
          interval.contains(new Interval('[1, 5)')).should.be.false
        })
        it('empty contains empty', function () {
          interval.contains(new Interval('(100, 10)')).should.be.true
        })
        it('does not contain [3, 3]', function () {
          interval.contains(new Interval('[3, 3]')).should.be.false
        })
        it('does not contain [-2, -2]', function () {
          interval.contains(new Interval('[-2, -2]')).should.be.false
        })
      })
    })
  })
})
