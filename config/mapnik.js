module.exports = {
  maps: {

  },
  modules: [
    require('tilelive-mapnik'),
    require('tilelive-bridge')
  ],
  s3cache: {
    basemap: {
      getKey ({ x, y, z }) {
        return `hybrid/v1/${z}/${x}/${y}/512px.png`
      }
    }
  }
}
