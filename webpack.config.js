var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, "dist");
var APP_DIR = path.resolve(__dirname, 'src');

// Boring CommonJS JavaScript
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: APP_DIR + '/main.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    devServer: {
        inline: true
    },
    module: {
        loaders: [{
            test: /\.jsx?/,
            include: APP_DIR,
            exclude: /node_modules/,
            loader: 'babel'
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
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }],
        plugins: [
            new ExtractTextPlugin("styles.css", {
                allChunks: false
            })
        ]
    }
};

module.exports = config;
