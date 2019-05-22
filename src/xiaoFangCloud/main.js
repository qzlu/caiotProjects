import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
Vue.use(Element)
/**webSocket */
/* import {sendSock} from '@/xiaofang/request/socket.js'
Vue.prototype.socket = sendSock */
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/reset-el-table.scss'
import '@/assets/css/common.scss'
Vue.config.productionTip = false

/* import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client' */
/* Vue.use(VueSocketio, socketio('http://cazsyj.com/'), store); */
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('FToken')
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
