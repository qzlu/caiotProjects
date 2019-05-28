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
    'shuziYy':{
        entry:'./src/shuziYy/'
    }
}
const configObj = config[projectName.name]
module.exports = configObj