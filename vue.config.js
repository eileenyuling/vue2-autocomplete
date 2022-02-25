const path = require('path')

module.exports = {
  outputDir: 'lib',
  publicPath: './',
  configureWebpack: {
    entry: path.join(__dirname, "./src/index.js"),
    // entry: path.join(__dirname, './examples/main.js'),
    output: {
      library: 'vue2-el-autocomplete',
      filename: "autocomplete.js",
      libraryTarget: 'umd'
    },
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

