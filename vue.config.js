const projectConfig = require('./projectConfig')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? projectConfig.baseUrl||'/'
    : '/',
    configureWebpack: {
        entry: {
            app:projectConfig.entry + 'main.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: projectConfig.entry + 'index.html', 
            }),
            new BundleAnalyzerPlugin(),
            new CompressionPlugin()
        ],
        externals:{
            
        },
        devtool: 'source-map'
    }
}
