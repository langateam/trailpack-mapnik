'use strict'

const Service = require('trails-service')

/**
 * @module MapService
 * @description TODO document Service
 */
module.exports = class MapService extends Service {

  getTile (source, { x, y, z }) {
    return new Promise((resolve, reject) => {
      this.sources[source].getTile(z, x, y, (err, tile, headers) => {
        if (err) return reject(err)

        resolve({ tile, headers })
      })
    })
  }

  constructor (app) {
    super(app)
    this.sources = this.app.packs.mapnik.sources
  }
}

