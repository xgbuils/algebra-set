var chai = require('chai')
var samples = require('../interval-samples')
var raw = require('../utils/raw-interval.js')
var parseSet = require('../../src/parsers/set.js')

chai.should()

describe('parseSet', function () {
  it('[4,5]U [ 3 , 9)', function () {
    var set = parseSet('[4,5]U [ 3 , 9)').map(raw)
    set.should.be.deep.equal([
      samples['[4, 5]'],
      samples['[3, 9)']
    ])
  })

  it('(4, 8)   U[ 3 ,5)U{-1,7}', function () {
    var set = parseSet('(4, 8)   U[ 3 ,5)U{-1,7}').map(raw)
    set.should.be.deep.equal([
      samples['(4, 8)'],
      samples['[3, 5)'],
      samples['{-1}'],
      samples['{7}']
    ])
  })

  it('  {    5    }    ', function () {
    var set = parseSet('  {    5    }    ').map(raw)
    set.should.be.deep.equal([
      samples['{5}']
    ])
  })

  it('(3,   11  ]    ', function () {
    var set = parseSet('(3,   11  ]    ').map(raw)
    set.should.be.deep.equal([
      samples['(3, 11]']
    ])
  })
})
