const projectName = require('./project')
const config = {
    /**掌上消防 */
    'xiaofang':{
        entry:'./src/xiaofang/'
    },
    /**数字消防云平台 */
    'xiaoFangCloud':{
        entry:'./src/xiaoFangCloud/',
    },
    /**数字应急云平台 */
    'shuziYy':{
        entry:'./src/shuziYy/'
    },
    /**后台管理系统 */
    'manage':{
        entry:'./src/manage/'
    }
}
const configObj = config[projectName.name]
module.exports = configObj