var chai = require('chai')
var samples = require('./interval-samples')
var compactIntervals = require('../src/compact-intervals.js')

chai.should()

describe('compactIntervals', function () {
  it('[4,5]U [ 3 , 9) --> [3, 9)', function () {
    var set = compactIntervals([
      samples.closed4Closed5,
      samples.closed3Opened9
    ])
    set.should.be.deep.equal([
      samples.closed3Opened9
    ])
  })

  it('(4, 8) U [ 3 ,5) U {-1,7} --> {-1} U (4, 8)', function () {
    var set = compactIntervals([
      samples.opened4Opened8,
      samples.closed3Opened5,
      samples.isolatedMinus1,
      samples.isolated7
    ])
    set.should.be.deep.equal([
      samples.isolatedMinus1,
      samples.closed3Opened8
    ])
  })

  it('{5} --> {5}', function () {
    var set = compactIntervals([
      samples.isolated5
    ])
    set.should.be.deep.equal([
      samples.isolated5
    ])
  })

  it('(3, 11] --> (3, 11]', function () {
    var set = compactIntervals([
      samples.opened3Closed11
    ])
    set.should.be.deep.equal([
      samples.opened3Closed11
    ])
  })

  it('(3, 0] --> empty', function () {
    var set = compactIntervals([
      samples.opened3Closed0
    ])
    set.should.be.deep.equal([])
  })

  it('(3, 0] U {7} U (2, 7) --> (2, 7]', function () {
    var set = compactIntervals([
      samples.opened2Opened7,
      samples.isolated7
    ])
    set.should.be.deep.equal([
      samples.opened2Closed7
    ])
  })
})