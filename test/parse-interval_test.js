var chai = require('chai')
var samples = require('./interval-samples')
var parseInterval = require('../src/parse-interval.js')

chai.should()

describe('parseInterval', function () {
  it('[4,5]', function () {
    var interval = parseInterval('[4,5]')
    interval.should.be.deep.equal(samples.closed4Closed5)
  })

  it('[3, 9)', function () {
    var interval = parseInterval('[3, 9)')
    interval.should.be.deep.equal(samples.closed3Opened9)
  })

  it('(3 ,11]', function () {
    var interval = parseInterval('(3 ,11]')
    interval.should.be.deep.equal(samples.opened3Closed11)
  })

  it('[ 7 , 7 ]', function () {
    var interval = parseInterval('[ 7 , 7 ]')
    interval.should.be.deep.equal(samples.isolated7)
  })
})