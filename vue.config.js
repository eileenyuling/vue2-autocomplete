const path = require('path')
// const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  configureWebpack: {
    // entry: {
    entry: path.join(__dirname, "./src/autocomplete/index.js"),

    // },
    // entry: path.join(__dirname, './src/main.js'),
    output: {
      library: `Autocomplete`,
      filename: "Autocomplete.js",
      libraryTarget: 'umd'
    },
    // resolve: {
    //   alias: {
    //     'element-ui': path.resolve(__dirname, './node_modules/element-ui/lib')
    //   }
    // },
  },
  chainWebpack: config => {
    config.module
      .rule('thejs')
      .test(/\.js$/)
      .include
        .add(path.resolve('src'))
        .add(path.resolve('node_modules/element-ui/packages'))
        .end()
      .use('babel-loader')
        .loader('babel-loader')
        .end()
  }

}

