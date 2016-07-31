var chai = require('chai')
var expect = chai.expect
var parseInterval = require('../../src/parsers/interval.js')
var samples = require('../interval-samples.js')

describe('parseInterval', function () {
  it('[4,5]', function () {
    var interval = parseInterval('[4,5]')
    expect(interval).to.be.deep.equal(samples['[4, 5]'])
  })

  it('[3, 9)', function () {
    var interval = parseInterval('[3, 9)')
    expect(interval).to.be.deep.equal(samples['[3, 9)'])
  })

  it('(3 ,11]', function () {
    var interval = parseInterval('(3 ,11]')
    expect(interval).to.be.deep.equal(samples['(3, 11]'])
  })

  it('[ 7 , 7 ]', function () {
    var interval = parseInterval('[ 7 , 7 ]')
    expect(interval).to.be.deep.equal(samples['{7}'])
  })

  it('{ 5}', function () {
    var interval = parseInterval('{ 5}')
    expect(interval).to.be.deep.equal(samples['{5}'])
  })

  it('"(a, b)" throws an exception', function () {
    function foo () {
      parseInterval('(a, b)')
    }
    expect(foo).to.throw('"a" is not a number')
  })

  it('"[4, 5*" throws an exception', function () {
    function foo () {
      parseInterval('[4, 5*')
    }
    expect(foo).to.throw('"[4, 5*" does not match to interval expression')
  })
})
