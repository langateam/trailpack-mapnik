module.exports = {
  maps: {

  },
  modules: [
    require('tilelive-mapnik')
  ],
  s3cache: {
    basemap: {
      getKey ({ x, y, z }) {
        return `hybrid/v1/${z}/${x}/${y}/512px.png`
      }
    }
  }
}
