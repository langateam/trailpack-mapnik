'use strict'

const assert = require('assert')
const Trailpack = require('trailpack')
const Tilelive = require('tilelive')
const cloneDeep = require('lodash.clonedeep')

module.exports = class MapnikTrailpack extends Trailpack {

  /**
   * Check that the configured mapnik XML files exist, and appear valid.
   */
  validate () {
    assert(this.app.config.mapnik)
    assert(this.app.config.mapnik.maps)
  }

  /**
   * Register tilelive protocols
   */
  configure () {
    this.sources = { }
  }

  /**
   * Setup tilelive, connect to datasources.
   */
  initialize () {
    this.log.debug('Registering tilelive protocols...')
    this.app.config.mapnik.protocols.forEach(plugin => plugin.registerProtocols(Tilelive))

    const maps = this.app.config.mapnik.maps
    const sources = Object.keys(maps).map(name => {
      const protocol = maps[name]

      return new Promise((resolve, reject) => {
        this.log.debug('Loading tilelive map source', name, '...')
        Tilelive.load(cloneDeep(protocol), (err, source) => {
          if (err) return reject(err)

          this.log.info('source loaded')

          this.sources[name] = source
          resolve()
        })
      })
    })

    return Promise.all(sources)
  }

  get tl () {
    return Tilelive
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
