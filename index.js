'use strict'

const Trailpack = require('trailpack')
const Tilelive = require('tilelive')

module.exports = class MapnikTrailpack extends Trailpack {

  /**
   * Check that the configured mapnik XML files exist, and appear valid.
   */
  validate () {

  }

  /**
   * Register tilelive protocols
   */
  configure () {
    this.config.mapnik.protocols.forEach(plugin => plugin.registerProtocols(Tilelive))
  }

  /**
   * Setup tilelive, connect to datasources.
   */
  initialize () {
    const maps = this.app.config.mapnik.maps
    const sources = Object.keys(maps).map(mapName => {
      const protocol = maps[mapName]

      return new Promise((resolve, reject) => {
        Tilelive.load(protocol, (err, source) => {
          if (err) return reject(err)

          resolve({
            name: mapName,
            source
          })
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

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
