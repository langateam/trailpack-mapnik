'use strict'
/* global describe, it */

const assert = require('assert')
let MapService

describe('MapService', () => {
  before(() => {
    MapService = global.app.services.MapService
  })
  it('should exist', () => {
    assert(MapService)
  })

  describe('#getMap', () => {
    it('should render a map image', () => {
      return MapService.getMap({ }, {
        bbox: [
          -13184317.9862114,
          4045438.96941211,
          -13184187.8452536,
          4045570.04219877
        ],
        width: 320,
        height: 240
      })
      .then(result => {
        console.log('result')
      })
    })
  })
})
