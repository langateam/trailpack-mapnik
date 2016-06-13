'use strict'

const Service = require('trails-service')

/**
 * @module MapService
 * @description TODO document Service
 */
module.exports = class MapService extends Service {

  getTile (source, { x, y, z }) {
    const Source = this.app.packs.mapnik.sources[source]
    x = parseInt(x)
    y = parseInt(y)
    z = parseInt(z)

    if (!Source) {
      return Promise.reject(new Error(`Tile source "${source}" is not available.`))
    }

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return Promise.reject(new Error(`Tile coordinates [x=${x}, y=${y}, z=${z}] invalid.`))
    }

    return new Promise((resolve, reject) => {
      this.app.packs.mapnik.sources[source].getTile(z, x, y, (err, tile, headers) => {
        if (err) return reject(err)

        resolve({ tile, headers })
      })
    })
  }
}

