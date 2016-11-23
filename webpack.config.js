/* eslint-env node */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.jsx'
    ],
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        },
        {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff&name=./assets/[name]/[hash].[ext]'
        },
        {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff&name=./assets/[name]/[hash].[ext]'
        },
        {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream&name=./assets/[name]/[hash].[ext]'
        },
        {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file?&name=./assets/[name]/[hash].[ext]'
        },
        {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=image/svg+xml&name=./assets/[name]/[hash].[ext]'
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css!sass')
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css')
        },
        {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=100000&name=./imgs/[hash].[ext]'
        }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss']
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
};
