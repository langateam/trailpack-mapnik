# trailpack-mapnik

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Setup a Map Server using [Trails](http://trailsjs.io), [Mapnik](http://mapnik.org/),
and [Tilelive](https://github.com/mapbox/tilelive). Supports tile caching with [S3](https://aws.amazon.com/s3/).

## Compatibility
- Node 6 or higher
- Mapnik 3.0.9 or higher (tested on 3.0.9)
- OSX or Linux (binaries pre-built for `linux` and `darwin` platforms)

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

## License
MIT

## Maintained By
[<img src='http://i.imgur.com/Y03Jgmf.png' height='64px'>](https://langa.io)

[npm-image]: https://img.shields.io/npm/v/trailpack-mapnik.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-mapnik
[ci-image]: https://img.shields.io/travis/langateam/trailpack-mapnik/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/langateam/trailpack-mapnik
[daviddm-image]: http://img.shields.io/david/langateam/trailpack-mapnik.svg?style=flat-square
[daviddm-url]: https://david-dm.org/langateam/trailpack-mapnik
[codeclimate-image]: https://img.shields.io/codeclimate/github/langateam/trailpack-mapnik.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/langateam/trailpack-mapnik
