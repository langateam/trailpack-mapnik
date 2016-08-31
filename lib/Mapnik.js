const path = require('path')
const fs = require('fs')

module.exports = {
  loadXml (sources, pack) {
    return Object.keys(sources).map(name => {
      const config = sources[name]

      if (config.protocol) return

      const xml = fs.readFileSync(config.pathname).toString()
      const options = {
        base: path.dirname(config.pathname)
      }
      pack.sources[name] = { xml, options }
    })
  }
}

