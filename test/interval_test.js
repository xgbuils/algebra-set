var chai = require('chai')
var samples = require('./interval-samples')
var Interval = require('../src/interval.js')
var wrap = require('./utils/wrap-interval')
var raw = require('./utils/raw-interval')

chai.should()

describe('Interval', function () {
  describe('Interval.create', function () {
    it('[4,5]', function () {
      var interval = Interval.create('[', 4, 5, ']').interval
      interval.should.be.deep.equal(samples.closed4Closed5)
    })

    it('[3, 9)', function () {
      var interval = Interval.create('[', 3, 9, ')').interval
      interval.should.be.deep.equal(samples.closed3Opened9)
    })

    it('(3 ,11]', function () {
      var interval = Interval.create('(', 3, 11, ']').interval
      interval.should.be.deep.equal(samples.opened3Closed11)
    })

    it('[ 7 , 7 ]', function () {
      var interval = Interval.create('[', 7, 7, ']').interval
      interval.should.be.deep.equal(samples.isolated7)
    })
  })

  describe('Interval.union', function () {
    it('[4,5] U [ 3 , 9) --> [3, 9)', function () {
      var set = Interval.union.apply(null, [
        samples.closed4Closed5,
        samples.closed3Opened9
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.closed3Opened9
      ])
    })

    it('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
      var set = Interval.union.apply(null, [
        samples.OPENED_4_TO_OPENED_8,
        samples['[3, 5)'],
        samples.isolatedMinus1,
        samples.isolated7
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.isolatedMinus1,
        samples.closed3Opened8
      ])
    })

    it('[5, 5] --> {5}', function () {
      var set = Interval.union.apply(null, [
        samples.isolated5
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.isolated5
      ])
    })

    it('(3, 11] --> (3, 11]', function () {
      var set = Interval.union.apply(null, [
        samples.opened3Closed11
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.opened3Closed11
      ])
    })

    it('(3, 0] --> empty', function () {
      var set = Interval.union.apply(null, [
        samples.opened3Closed0
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([])
    })

    it('(3, 0] U [7, 7] U (2, 7) --> (2, 7]', function () {
      var set = Interval.union.apply(null, [
        samples.opened2Opened7,
        samples.isolated7
      ].map(wrap)).map(raw)
      set.should.be.deep.equal([
        samples.opened2Closed7
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
