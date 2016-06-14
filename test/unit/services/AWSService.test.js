'use strict'
/* global describe, it */

const assert = require('assert')

describe('AWSService', () => {
  it('should exist', () => {
    assert(global.app.api.services['AWSService'])
  })
})
