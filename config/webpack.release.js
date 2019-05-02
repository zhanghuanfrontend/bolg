const webpackBase = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const paths = require('./paths')
const path = require('path')

module.exports = {
    ...webpackBase,
    plugins: [
        ...webpackBase.plugins,
        // 删除上次打包文件
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static/images'),
                to: path.join(__dirname, '../dist/static/images')
            }
        ]),
    ],
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             cache: true,
    //             sourceMap: true,
    //             parallel: true,
    //             uglifyOptions: {
    //                 ecma: 8
    //             }
    //         }),
    //     ]
    // },
    mode: 'production'
}