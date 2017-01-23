'use strict'

const assert = require('assert')

describe('Trailpack', () => {
  let pack
  before(() => {
    pack = global.app.packs.mapnik
  })
  it.skip('TODO should be loaded into the app.packs collection', () => {
    assert(pack)
  })
  describe('#validate', () => {
    it.skip('TODO test')
  })
  describe('#initialize', () => {
    it('should register default tilelive protocols (mapnik)', () => {
      assert(pack.tl.protocols['mapnik:'])
    })
  })
  describe('#initialize', () => {
    it.skip('TODO test')
  })
})
