module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/airport-map/' : '/',
  chainWebpack: config => config.resolve.symlinks(false)
}
