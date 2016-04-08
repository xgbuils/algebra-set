var chai = require('chai')
var samples = require('./interval-samples')
var parseSet = require('../src/parse-set.js')

chai.should()

describe('parseSet', function () {
  it('[4,5]U [ 3 , 9)', function () {
    var set = parseSet('[4,5]U [ 3 , 9)')
    set.should.be.deep.equal([
      samples.closed4Closed5,
      samples.closed3Opened9
    ])
  })

  it('(4, 8)   U[ 3 ,5)U{-1,7}', function () {
    var set = parseSet('(4, 8)   U[ 3 ,5)U{-1,7}')
    set.should.be.deep.equal([
      samples.opened4Opened8,
      samples.closed3Opened5,
      samples.isolatedMinus1,
      samples.isolated7
    ])
  })

  it('  {    5    }    ', function () {
    var set = parseSet('  {    5    }    ')
    set.should.be.deep.equal([
      samples.isolated5
    ])
  })

  it('(3,   11  ]    ', function () {
    var set = parseSet('(3,   11  ]    ')
    set.should.be.deep.equal([
      samples.opened3Closed11
    ])
  })
})