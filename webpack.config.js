var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, "dist");
var APP_DIR = path.resolve(__dirname, 'src');

// Boring CommonJS JavaScript
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    context: APP_DIR,
    entry: [
        'whatwg-fetch',
        APP_DIR + '/main.jsx'
    ],
    output: {
        path: BUILD_DIR,
        publicPath: "/", // dev
        // publicPath: "http://cdn..." // production
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        // This is required for webpack-dev-server. The path should  
        // be an absolute path to your build destination. 
        colors: true,
        historyApiFallback: true,
        inline: true,
        hot: true,
        contentBase: BUILD_DIR,
        outputPath: BUILD_DIR
    },
    module: {
        loaders: [{
            test: /\.jsx?/,
            include: APP_DIR,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.coffee$/,
            loader: "coffee-loader"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
            loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]',

        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.html$/,
            loader: "file?name=[name].[ext]",
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }],
        plugins: [
            new ExtractTextPlugin("styles.css", {
                allChunks: false
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
                from: "../index.html"
            },
            {
                from: 'images',
                to: "images"
            },
            {
                from: 'downloads',
                to: "downloads"
            },
        ]),
        new webpack.ProvidePlugin({
            d3: 'd3',
            $: 'jquery'
        })
    ]
};

module.exports = config;