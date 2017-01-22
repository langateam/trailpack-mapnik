module.exports = {
  maps: {

  },
  modules: [
  ],
  s3cache: {
    basemap: {
      getKey ({ x, y, z }) {
        return `hybrid/v1/${z}/${x}/${y}/512px.png`
      }
    }
  }
}
