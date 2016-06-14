'use strict'

const Service = require('trails-service')

/**
 * @module MapService
 * @description TODO document Service
 */
module.exports = class MapService extends Service {

  getTile (source, { x, y, z }) {
    const AWSService = this.app.services.AWSService
    const s3cache = this.app.config.mapnik.s3cache[source]
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
      AWSService.S3.getObject({
        Bucket: s3cache.Bucket,
        Key: s3cache.getKey({ x, y, z })
      }, (err, data) => {
        if (err && err.message === 'NoSuchKey') {
          resolve()
        }
        else if (err) {
          this.log.warn('S3 Error:', err)
        }
        else if (Buffer.isBuffer(data.Body)) {
          resolve(data)
        }
      })
    }).then(obj => {
      if (obj) {
        return {
          tile: obj.Body,
          headers: {
            'Content-Type': obj.ContentType
          }
        }
      }

      return new Promise((resolve, reject) => {

        const t0 = Date.now()
        this.app.packs.mapnik.sources[source].getTile(z, x, y, (err, tile, headers) => {
          if (err) return reject(err)

          this.log.debug('Tile rendered. zxy = [', z, x, y, '], size =',
              Math.round(tile.length / 1024), 'kb, elapsed =', (Date.now() - t0), 'ms')

          resolve({ tile, headers })

          if (!s3cache) return

          this.log.debug('Caching tile [', z, x, y, '] in bucket [', s3cache.Bucket, ']...')

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
              this.log.debug('Cached tile [', z, x, y, '] in', (Date.now() - t1), 'ms')
              this.log.silly('Cache data:', data)
            }
          })
        })
      })
    })
  }
}

