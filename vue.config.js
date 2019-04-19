const projectConfig = require('./projectConfig')
module.exports = {
    configureWebpack: {
        entry: {
            app:projectConfig.entry + 'main.js'
        }
    }
}
