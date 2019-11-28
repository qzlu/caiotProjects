const projectConfig = require('./projectConfig')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default
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
            /* new BundleAnalyzerPlugin(), */
            new CompressionPlugin({
                test: /\.(js|css)$/
            })
        ],
        externals:{
            
        },
        devtool: 'source-map',
    },
    productionSourceMap:false
}
