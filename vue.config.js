
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default
let pagesObject = {
    login:{
        entry:'src/login/main.js',
        template:'src/login/index.html',
        filename:'login.html',
        title:'登录'
    },
    index:{
        entry:'src/qianren/main.js',
        template:'src/qianren/index.html',
        filename:'index.html',
        title:'千仞集团'
    },
    project:{
        entry:'src/caiot/main.js',
        template:'src/caiot/index.html',
        filename:'project.html',
        title:'千仞项目'
    },
}
module.exports = {
    pages:pagesObject,
    chainWebpack: config => {
        // TODO: Remove this workaround once https://github.com/vuejs/vue-cli/issues/2463 is fixed
        // Remove preload plugins for multi-page build to prevent infinite recursion
        Object.keys(pagesObject).forEach(page => {
            config.plugins.delete(`preload-${page}`)
            config.plugins.delete(`prefetch-${page}`)
        })
    },
    configureWebpack: {
        plugins: [
            /* new BundleAnalyzerPlugin(), */
            new CompressionPlugin({
                test: /\.(js|css)/
            })
        ],
        externals:{
            echarts: 'echarts',
            html2canvas:'html2canvas',
            jspdf:'jspdf'
        },
        devtool: 'source-map',
    },
    devServer: {
        // development server port 8000
        // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
        proxy: {
          '/api': {
            target: 'http://172.172.172.37:8770/',
/*             pathRewrite: {
                '^/api': '/'
            }, */
            ws: false,
            changeOrigin: true
          }
        }
    },
    productionSourceMap:false
}
