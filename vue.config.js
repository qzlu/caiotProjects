
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default
/* const DllPlugin = require('DllPlugin')
const DllReferencePlugin = require('DllReferencePlugin') */
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
        title:'千仞集团',
        /* chunks: ['chunk-vendors', 'chunk-common'] */
    },
    project:{
        entry:'src/caiot/main.js',
        template:'src/caiot/index.html',
        filename:'project.html',
        title:'千仞项目'
    },
    shuziYy:{
        entry:'src/shuziYy/main.js',
        template:'src/shuziYy/index.html',
        filename:'shuziYy.html',
        title:'数字应急'
    },
    eYingji:{
        entry:'src/eYingji/main.js',
        template:'src/eYingji/index.html',
        filename:'eYingji.html',
        title:'数字应急'
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
            }),
/*             new DllPlugin({
                context: process.cwd(),
                // manifest.json文件的输出位置
                path: path.join(src, 'js', 'dll', '[name]-manifest.json'),
                // 定义打包的公共vendor文件对外暴露的函数名
                name: '[name]_[hash]'
            }),
            new DllReferencePlugin({
                context: process.cwd(), 
                manifest: require(path.join(src, 'js', "dll", "vendor-manifest.json"))
            }) */
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
