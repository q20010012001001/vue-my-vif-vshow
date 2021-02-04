const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    resolve
} = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundefaultMaxListeners.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'src/index.html')
        })
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: './'
    }
}