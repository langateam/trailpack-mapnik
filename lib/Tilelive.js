const Tilelive = require('tilelive')
const cloneDeep = require('lodash.clonedeep')

module.exports = {
  validateTileSources (sources) {
    return Promise.all(Object.keys(sources).map(name => {
      const protocol = sources[name]

      if (!protocol.protocol) return

      return new Promise((resolve, reject) => {
        Tilelive.info(protocol, (err, info) => {
          const errors = Tilelive.verify(info)

          if (err) return reject(err)
          if (errors && errors.length) {
            return reject(new Error(`Tile source [${name}] invalid: ${errors}`))
          }

          resolve(info)
        })
      })
    }))
  },

  loadTileSources (sources, pack) {
    return Promise.all(Object.keys(sources).map(name => {
      const protocol = sources[name]

      if (!protocol.protocol) return

      return new Promise((resolve, reject) => {
        pack.log.debug('Loading tilelive map source', name, '...')
        Tilelive.load(cloneDeep(protocol), (err, source) => {
          if (err) return reject(err)

          pack.sources[name] = source
          resolve()
        })
      })
    }))
  }
}
