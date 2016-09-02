'use strict'

const assert = require('assert')
const Trailpack = require('trailpack')
const Tilelive = require('tilelive')
const Mapnik = require('mapnik')
const aws = require('aws-sdk')
const lib = require('./lib')

module.exports = class MapnikTrailpack extends Trailpack {

  /**
   * Check that the configured mapnik XML files exist, and appear valid.
   */
  validate () {
    assert(this.app.config.mapnik)
    assert(this.app.config.mapnik.maps)
    assert(this.app.config.mapnik.modules)

    this.app.config.mapnik.modules.forEach(plugin => plugin.registerProtocols(Tilelive))
    //return lib.Tilelive.validateTileSources(this.app.config.mapnik.maps)
  }

  /**
   * Register tilelive modules
   */
  configure () {
    this.sources = { }
    this.aws = { }
    aws.config = this.app.config.aws.config

    Mapnik.register_default_fonts()
    Mapnik.register_default_input_plugins()
  }

  /**
   * Setup tilelive, connect to datasources.
   */
  initialize () {
    const awsServices = this.app.config.aws.services
    this.log.info('Instantiating AWS Services', awsServices, '...')

    awsServices.forEach(service => {
      this.app.services.AWSService[service] = new aws[service]()
    })

    this.log.debug('Registering tilelive modules...')
    this.app.config.mapnik.modules.forEach(plugin => plugin.registerProtocols(Tilelive))

    return Promise.all([
      lib.Tilelive.loadTileSources(this.app.config.mapnik.maps, this),
      lib.Mapnik.loadXml(this.app.config.mapnik.maps, this)
    ])
  }

  /**
   * Close down the tilelive sources. clears tilecache and destroys the pool.
   */
  unload () {
    return Promise.all(
      Object.keys(this.sources).map(sourceName => {
        return new Promise((resolve, reject) => {
          this.log.debug('trailpack-tilelive: closing tilelive source', sourceName)
          const source = this.sources[sourceName]
          source.close(resolve)
        })
      }))
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
