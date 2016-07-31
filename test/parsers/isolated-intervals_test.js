var chai = require('chai')
var samples = require('./../interval-samples')
var parseIsolatedIntervals = require('../../src/parsers/isolated-intervals.js')

chai.should()

describe('parseIsolatedIntervals', function () {
  it('{-1, 5, 7}', function () {
    var interval = parseIsolatedIntervals('{-1, 5, 7}').map(raw)
    interval.should.be.deep.equal([
      samples['{-1}'],
      samples['{5}'],
      samples['{7}']
    ])
  })

  it('{ 5}', function () {
    var interval = parseIsolatedIntervals('{5}').map(raw)
    interval.should.be.deep.equal([
      samples['{5}']
    ])
  })

  it('{5  ,-1}', function () {
    var interval = parseIsolatedIntervals('{5  ,-1}').map(raw)
    interval.should.be.deep.equal([
      samples['{5}'],
      samples['{-1}']
    ])
  })
})

function raw (e) {
  return e.interval
}
