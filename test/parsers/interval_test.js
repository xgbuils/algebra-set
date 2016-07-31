var chai = require('chai')
var parseInterval = require('../../src/parsers/interval.js')
var samples = require('../interval-samples.js')

chai.should()

describe('parseInterval', function () {
  it('[4,5]', function () {
    var interval = parseInterval('[4,5]')
    interval.should.be.deep.equal(samples['[4, 5]'])
  })

  it('[3, 9)', function () {
    var interval = parseInterval('[3, 9)')
    interval.should.be.deep.equal(samples['[3, 9)'])
  })

  it('(3 ,11]', function () {
    var interval = parseInterval('(3 ,11]')
    interval.should.be.deep.equal(samples['(3, 11]'])
  })

  it('[ 7 , 7 ]', function () {
    var interval = parseInterval('[ 7 , 7 ]')
    interval.should.be.deep.equal(samples['{7}'])
  })
})
