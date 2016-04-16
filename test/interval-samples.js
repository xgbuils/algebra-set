module.exports = {
  // [3, 5)
  closed3Opened5: [{
    // exactly 3
    value: 3,
    limit: 0
  }, {
    // 5 - infinitesimal
    value: 5,
    limit: -1
  }],

  // [3, 9)
  closed3Opened9: [{
    // exactly 3
    value: 3,
    limit: 0
  }, {
    // 9 - infinitesimal
    value: 9,
    limit: -1
  }],

  // [3, 9]
  closed3Closed9: [{
    // exactly 3
    value: 3,
    limit: 0
  }, {
    // exactly 9
    value: 9,
    limit: 0
  }],

  // (4, 8)
  opened4Opened8: [{
    // 4 + infinitesimal
    value: 4,
    limit: 1
  }, {
    // 8 - infinitesimal
    value: 8,
    limit: -1
  }],

  // (4, 5]
  opened4Closed5: [{
    // 4 + infinitesimal
    value: 4,
    limit: 1
  }, {
    // exactly 5
    value: 5,
    limit: 0
  }],

  // [4, 5]
  closed4Closed5: [{
    // exactly 4
    value: 4,
    limit: 0
  }, {
    // exactly 5
    value: 5,
    limit: 0
  }],

  // (3, 11]
  opened3Closed11: [{
    // 3 + infinitesimal
    value: 3,
    limit: 1
  }, {
    // exactly 11
    value: 11,
    limit: 0
  }],

  closed3Opened8: [{
    value: 3,
    limit: 0
  }, {
    value: 8,
    limit: -1
  }],

  opened3Closed0: [{
    value: 3,
    limit: 1
  }, {
    value: 0,
    limit: 0
  }],

  opened2Opened7: [{
    value: 2,
    limit: 1
  }, {
    value: 7,
    limit: -1
  }],

  opened2Closed7: [{
    value: 2,
    limit: 1
  }, {
    value: 7,
    limit: 0
  }],

  // [-1, -1]
  isolatedMinus1: [{
    // exactly -1
    value: -1,
    limit: 0
  }, {
    // exactly -1
    value: -1,
    limit: 0
  }],

  // [5, 5]
  isolated5: [{
    // exactly 5
    value: 5,
    limit: 0
  }, {
    // exactly 5
    value: 5,
    limit: 0
  }],

  // [7, 7]
  isolated7: [{
    // exactly 7
    value: 7,
    limit: 0
  }, {
    // exactly 7
    value: 7,
    limit: 0
  }]
}
