'use strict'

const Service = require('trails-service')

/**
 * @module MapService
 * @description TODO document Service
 */
module.exports = class MapService extends Service {

  getTile (source, { x, y, z }) {

    return this.validateTileParameters(source, {x, y, z})
      .then(({x, y, z}) => {
        return this.downloadTile(source, {x, y, z})
      })
      .then(tile => {
        if (tile) return tile

        return this.renderTile(source, {x, y, z})
          .then(tile => {
            this.uploadTile(source, {x, y, z}, tile)
            return tile
          })
      })
  }

  downloadTile (source, {x, y, z}) {
    const s3cache = this.app.config.mapnik.s3cache[source]
    const AWSService = this.app.services.AWSService
    const t0 = Date.now()

    return new Promise((resolve, reject) => {
      AWSService.S3.getObject({
        Bucket: s3cache.Bucket,
        Key: s3cache.getKey({ x, y, z })
      }, (err, data) => {
        if (err && err.name === 'NoSuchKey') {
          this.log.info(`Tile cache miss: ${source}/${z}/${x}/${y}`)
          resolve()
        }
        else if (err) {
          this.log.warn('S3 Error:', err)
          resolve()
        }
        else if (Buffer.isBuffer(data.Body)) {
          this.log.info(`Retrieved tile ${source}/${z}/${x}/${y} from s3 in ${(Date.now() - t0)}ms`)
          resolve({
            tile: data.Body,
            headers: {
              'Content-Type': data.ContentType
            }
          })
        }
        else {
          this.log.warn(`Tile from S3 ${source}/${z}/${x}/${y} is not a buffer.`)
          resolve()
        }
      })
    })
  }

  uploadTile (source, {x, y, z}, { tile, headers }) {
    const AWSService = this.app.services.AWSService
    const s3cache = this.app.config.mapnik.s3cache[source]

    this.log.debug(`Caching tile ${source}/${z}/${x}/${y} in bucket ${s3cache.Bucket}...`)

    const t1 = Date.now()
    AWSService.S3.putObject({
      Bucket: s3cache.Bucket,
      ContentType: headers['Content-Type'],
      Key: s3cache.getKey({ x, y, z }),
      Body: tile
    }, (err, data) => {
      if (err) {
        this.log.warn('S3 Cache failed on tile [', z, x, y, ']:', err)
      }
      else {
        this.log.info(`Cached tile ${source}/${z}/${x}/${y} in ${(Date.now() - t1)}ms`)
      }
    })
  }

  renderTile (source, {x, y, z}) {
    const t0 = Date.now()

    return new Promise((resolve, reject) => {
      this.app.packs.mapnik.sources[source].getTile(z, x, y, (err, tile, headers) => {
        if (err) return reject(err)

        this.log.debug(`Tile rendered: ${source}/${z}/${x}/${y},`,
          `size=${Math.round(tile.length / 1024)}kb`,
          `elapsed=${(Date.now() - t0)}ms`)

        resolve({ tile, headers })
      })
    })
  }

  validateTileParameters (source, {x, y, z}) {
    const Source = this.app.packs.mapnik.sources[source]
    x = parseInt(x)
    y = parseInt(y)
    z = parseInt(z)

    if (!Source) {
      return Promise.reject(new Error(`Tile source "${source}" is not available.`))
    }

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return Promise.reject(new Error(`Tile coordinates [z=${z}, x=${x}, y=${y}] invalid.`))
    }

    return Promise.resolve({x, y, z})
  }
}

