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
Vue.directive('loadmore', {  bind(el, binding) {  
  var p = 0;
  var t = 0;   
  var down = true;    
  var selectWrap = el.querySelector('.el-table__body-wrapper')||el.querySelector('.el-scrollbar__wrap')
  selectWrap.addEventListener('scroll', function() {      
    //判断是否向下滚动      
    p = this.scrollTop;      // 
    if ( t < p){
      down=true
    }else{
      down=false
    }      
    t = p;      //判断是否到底      
    const sign = 10;      
    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
    if (scrollDistance <= sign && down) {  
      binding.value()      
    }    
  })  
}})
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
let token = sessionStorage.getItem('FToken')
if(!token){
  location.href = '/login.html'
}else{
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
}

