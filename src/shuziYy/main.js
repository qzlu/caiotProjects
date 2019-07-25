import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/xiaoFangCloud/store'
import Element from 'element-ui'
Vue.use(Element)
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/reset-el-table.scss'
import '@/assets/css/common.scss'
Vue.config.productionTip = false
import {sendSock,websock,initWebSocket} from '@/xiaoFangCloud/request/socket.js'
Vue.prototype.$socket = sendSock
Vue.prototype.$websocket = websock
Vue.prototype.$initWebSocket = initWebSocket
const title = ['', '数字消防', '数字电梯', '数字充电桩', '数字有限空间']
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('FToken')||window.location.search
  if(to.path.match(/index/ig)){
    document.title = title[to.params.formID]
  }else{
    if(to.meta.title){
      document.title = to.meta.title
    }
  }
  if(to.name !== 'login'&&!token){
    next({name:'login'})
  }else{
    next()
  }
  next()
  
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
