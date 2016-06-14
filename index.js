'use strict'

const assert = require('assert')
const Trailpack = require('trailpack')
const Tilelive = require('tilelive')
const cloneDeep = require('lodash.clonedeep')
const aws = require('aws-sdk')

module.exports = class MapnikTrailpack extends Trailpack {

  /**
   * Check that the configured mapnik XML files exist, and appear valid.
   */
  validate () {
    assert(this.app.config.mapnik)
    assert(this.app.config.mapnik.maps)
    assert(this.app.config.mapnik.protocols)

    this.app.config.mapnik.protocols.forEach(plugin => plugin.registerProtocols(Tilelive))

    return Promise.all(Object.keys(this.app.config.mapnik.maps).map(name => {
      const protocol = this.app.config.mapnik.maps[name]
      return new Promise((resolve, reject) => {
        Tilelive.info(protocol, (err, info) => {
          this.log.silly('Tile source [', name, '] info:', info)
          const errors = Tilelive.verify(info)

          if (err) return reject(err)
          if (errors && errors.length) {
            return reject(new Error(`Tile source [${name}] invalid: ${errors}`))
          }

          resolve(info)
        })
      })
    }))
  }

  /**
   * Register tilelive protocols
   */
  configure () {
    this.sources = { }
    this.aws = { }
    aws.config = this.app.config.aws.config
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


    this.log.debug('Registering tilelive protocols...')
    this.app.config.mapnik.protocols.forEach(plugin => plugin.registerProtocols(Tilelive))

    const maps = this.app.config.mapnik.maps
    const sources = Object.keys(maps).map(name => {
      const protocol = maps[name]

      return new Promise((resolve, reject) => {
        this.log.debug('Loading tilelive map source', name, '...')
        Tilelive.load(cloneDeep(protocol), (err, source) => {
          if (err) return reject(err)

          this.log.info('source loaded')

          this.sources[name] = source
          resolve()
        })
      })
    })

    return Promise.all(sources)
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
