var chai = require('chai')
var samples = require('../interval-samples')
var raw = require('../utils/raw-interval.js')
var parseSet = require('../../src/parsers/set.js')

chai.should()

describe('parseSet', function () {
  it('[4,5]U [ 3 , 9)', function () {
    var set = parseSet('[4,5]U [ 3 , 9)').map(raw)
    set.should.be.deep.equal([
      samples.closed4Closed5,
      samples.closed3Opened9
    ])
  })

  it('(4, 8)   U[ 3 ,5)U{-1,7}', function () {
    var set = parseSet('(4, 8)   U[ 3 ,5)U{-1,7}').map(raw)
    set.should.be.deep.equal([
      samples.OPENED_4_TO_OPENED_8,
      samples['[3, 5)'],
      samples.isolatedMinus1,
      samples.isolated7
    ])
  })

  it('  {    5    }    ', function () {
    var set = parseSet('  {    5    }    ').map(raw)
    set.should.be.deep.equal([
      samples.isolated5
    ])
  })

  it('(3,   11  ]    ', function () {
    var set = parseSet('(3,   11  ]    ').map(raw)
    set.should.be.deep.equal([
      samples.opened3Closed11
    ])
  })
})
