import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
Vue.use(Element)
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/common.scss'
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  let {token, projectID}= to.query
  if(token){
      localStorage.setItem('Token',token)
  }
  if(projectID){
    localStorage.setItem('projectid', projectID)
  }
  token = token || localStorage.getItem('Token')
  if(to.name !== 'login'&&!token){
    next({name:'login'})
  }else{
    next()
  }
  
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
