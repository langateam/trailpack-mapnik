# trailpack-mapnik

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Setup a Map Server using [Trails](http://trailsjs.io) and [Mapnik](http://mapnik.org/).

## Install

```sh
$ npm install --save trailpack-mapnik
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-mapnik')
  ]
}
```

```js
// config/mapnik.js
const path = require('path')
module.exports = {
  /**
   * Define paths to mapnik map configs
   */
  maps: {
    basemap: {
      pathname: path.resolve(__dirname, 'basemap.xml')
    },
    someOverlay: {
      pathname: path.resolve(__dirname, 'vector_overlay.xml')
    }
  },
  /**
   * Additional Tilelive protocols (e.g. vector)
   */
  protocols: [
    require('tilelive-additionalplugin')
  ]
}
```

[npm-image]: https://img.shields.io/npm/v/trailpack-mapnik.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-mapnik
[ci-image]: https://img.shields.io/travis//trailpack-mapnik/master.svg?style=flat-square
[ci-url]: https://travis-ci.org//trailpack-mapnik
[daviddm-image]: http://img.shields.io/david//trailpack-mapnik.svg?style=flat-square
[daviddm-url]: https://david-dm.org//trailpack-mapnik
[codeclimate-image]: https://img.shields.io/codeclimate/github//trailpack-mapnik.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github//trailpack-mapnik
