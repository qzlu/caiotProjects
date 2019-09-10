const projectName = require('./project')
const config = {
    /**掌上消防 */
    'xiaofang':{
        entry:'./src/xiaofang/'
    },
    /**数字消防云平台 */
    'xiaoFangCloud':{
        entry:'./src/xiaoFangCloud/',
        baseUrl:'/xf/'
    },
    /**数字应急云平台 */
    'shuziYy':{
        entry:'./src/shuziYy/'
    },
    /**千仞集团页面 */
    'qianren':{
        entry:'./src/qianren/',
        /* baseUrl:'/qianren/' */
    },
    /**智维 */
    'zhiwei':{
        entry: './src/zhiwei/'
    }
}
const configObj = config[projectName.name]
module.exports = configObj