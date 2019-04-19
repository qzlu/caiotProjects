const projectName = require('./project')
const config = {
    /**掌上消防 */
    'xiaofang':{
        entry:'./src/xiaofang/'
    }
}
const configObj = config[projectName.name]
module.exports = configObj