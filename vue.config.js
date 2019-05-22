const projectConfig = require('./projectConfig')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    configureWebpack: {
        entry: {
            app:projectConfig.entry + 'main.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: projectConfig.entry + 'index.html', 
            })
        ],
        devtool: 'source-map'
    }
}
