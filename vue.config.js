const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

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
    plugins: [
      new BundleAnalyzerPlugin(),
      new LodashModuleReplacementPlugin()
    ]
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

