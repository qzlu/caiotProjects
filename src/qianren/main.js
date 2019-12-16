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
Vue.config.productionTip = false
import {Post} from '@/request/api.js'
Vue.prototype.$post = Post
/* import {sendSock,websock,initWebSocket} from '@/qianren/request/socket.js'
Vue.prototype.$socket = sendSock
Vue.prototype.$websocket = websock
Vue.prototype.$initWebSocket = initWebSocket */
/* 
store.dispatch('addRoute') */
router.beforeEach((to, from, next) => {
  console.log('ee',to,router)
  let {token, projectID,link}= to.query
  if(token){
      sessionStorage.setItem('FToken',token)
      sessionStorage.setItem('inIframe',1)
  }
  if(projectID){
      sessionStorage.setItem('projectID', projectID)
  }
  token = token || sessionStorage.getItem('FToken')
  if(!token){
    next()
    /* next({path:'/login'}) */
    location.href = '/login.html'
  }else{
    next()
  }
})
store.dispatch('getMenus')
.then((result) => {
}).catch((err) => {
})
.finally(() => {
  store.dispatch('addRoute')
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
