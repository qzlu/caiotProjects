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
router.beforeEach((to, from, next) => {
/*   let token = sessionStorage.getItem('FToken')||window.location.search
  if(to.name !== 'login'&&!token){
    next({name:'login'})
  }else{
    next()
  } */
  next()
  
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')