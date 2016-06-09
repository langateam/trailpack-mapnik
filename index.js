'use strict'

const Trailpack = require('trailpack')
const Tilelive = require('tilelive')
const tlMapnik = require('tilelive-mapnik')
const tlBridge = require('tilelive-bridge')

module.exports = class MapnikTrailpack extends Trailpack {

  /**
   * Check that the configured mapnik XML files exist, and appear valid.
   */
  validate () {

  }

  /**
   * TODO document method
   */
  configure () {

  }

  /**
   * Setup tilelive, connect to datasources.
   */
  initialize () {

  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

