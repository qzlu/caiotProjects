import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
Vue.use(Element)
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/reset-el-table.scss'
import '@/assets/css/common.scss'
Vue.config.productionTip = false
import {post} from '@/request/http.js'
Vue.prototype.$post = post
new Vue({
  render: h => h(App)
}).$mount('#app')
