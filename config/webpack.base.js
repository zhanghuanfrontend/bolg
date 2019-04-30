const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const markdownRenderer = require('react-markdown-reader').renderer
const JSXFormLoader = require('react_jsx_form/dist/loader.js')
console.log(JSXFormLoader)
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
                                    useBuiltIns: 'usage',
                                    targets: {
                                        browsers: ['ie >= 8']
                                    }
                                }], 
                                '@babel/preset-react'
                            ],
                            plugins: [
                                // '@babel/plugin-transform-runtime',
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }]
                            ]
                        }
                    },
                    {
                        loader: JSXFormLoader,
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
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                    {
                        loader: 'markdown-loader',
                        options: {
                            pedantic: true,
                            renderer: markdownRenderer()
                        }
                    },
                ],
            },
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
    externals: {
        echarts: 'echarts'
    }
}