const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    entry:  paths.entry,
    output: {
        filename: 'static/js/[name].[id].[hash].js',
        path: paths.output,
        library: 'jsx-form',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [paths.testPath, paths.srcPath],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['ie >= 8']
                                    }
                                }], 
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(css|less)/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-cssnext')(),
                            ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            // {
            //     test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 10000,
            //                 name: 'static/media/[name].[hash:8].[ext]',
            //             }
            //         }
            //     ]
            // },
            // {
            //     exclude: [
            //         /\.(config|overrides|variables)$/,
            //         /\.html$/,
            //         /\.(js|jsx)$/,
            //         /\.css$/,
            //         /\.json$/,
            //         /\.bmp$/,
            //         /\.gif$/,
            //         /\.jpe?g$/,
            //         /\.png$/,
            //         /\.scss$/,
            //         /\.less$/,
            //     ],
            //     loader: require.resolve( 'file-loader' ),
            //     options: {
            //         name: 'static/media/[name].[hash:8].[ext]',
            //     },
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.rootHtml,
            filename: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            }
        })
    ],
    resolve: {
        alias: paths.alias,
        extensions: ['.js', '.jsx', '.css', '.less', '.json'],
        modules: [paths.module],
    },
    externals: {}
}