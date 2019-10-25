import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
Vue.use(Element)
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/reset-el-table.scss'
import '@/assets/css/common.scss'
import './assets/css/common.scss'
Vue.config.productionTip = false
import {post} from './request/http.js'
Vue.prototype.$post = post
/* import {sendSock,websock,initWebSocket} from '@/qianren/request/socket.js'
Vue.prototype.$socket = sendSock
Vue.prototype.$websocket = websock
Vue.prototype.$initWebSocket = initWebSocket */
store.dispatch('addRoute')
router.beforeEach((to, from, next) => {
  let {token, projectID,link}= to.query
  console.log(to);
  if(token){
      sessionStorage.setItem('FToken',token)
      sessionStorage.setItem('inIframe',1)
  }
  if(projectID){
      sessionStorage.setItem('projectID', projectID)
  }
  token = token || sessionStorage.getItem('FToken')
  if(to.path !== '/login'&&!token){
    next({path:'/login'})
  }else{
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
