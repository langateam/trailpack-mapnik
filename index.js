'use strict'

const assert = require('assert')
const Trailpack = require('trailpack')
const Tilelive = require('tilelive')

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
    this.log.debug('Registering tilelive protocols...')
    this.app.config.mapnik.protocols.forEach(plugin => plugin.registerProtocols(Tilelive))
  }

  /**
   * Setup tilelive, connect to datasources.
   */
  initialize () {
    const maps = this.app.config.mapnik.maps
    const sources = Object.keys(maps).map(name => {
      const protocol = maps[name]

      return new Promise((resolve, reject) => {
        Tilelive.load(protocol, (err, source) => {
          if (err) return reject(err)

          resolve({ name, source })
        })
      })
    })

    return Promise.all(sources)
      .then(sources => {
        sources.forEach(source => {
          this[source.mapName] = source.source
        })
      })
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
