const path = require('path')
// const { VueLoaderPlugin } = require('vue-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
      entry: path.join(__dirname, "./src/autocomplete/index.js"),
    },
    output: {
      path: path.join( __dirname, "/dist"), // 打包后的文件存放在dist文件夹
      publicPath: '/dist/', // 设置公共路径
      filename: "Autocomplete.js", // 打包后输出文件的文件设置为btn.js
      libraryTarget: 'umd' // 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(scss|sass)$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          use: ['url-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
          include: [
            path.resolve('node_modules/element-ui/packages'),
            path.resolve('src')
          ],
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
}

