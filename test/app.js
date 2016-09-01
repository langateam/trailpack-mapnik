'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')

module.exports = _.defaultsDeep({
  pkg: {
    name: require('../package').name + '-test'
  },
  api: {
    models: { },
    controllers: { },
    services: { }
  },
  config: {
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('../')  // trailpack-mapnik
      ]
    },
    log: {
      logger: new smokesignals.Logger('debug')
    },
    mapnik: {
      maps: {

      },
      modules: [

      ]
    }

  }
}, smokesignals.FailsafeConfig)


