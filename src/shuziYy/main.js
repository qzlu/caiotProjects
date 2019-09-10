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
import {System} from './request/api'
const title = ['', '数字消防', '数字电梯', '数字充电桩', '数字有限空间']
router.beforeEach(async (to, from, next) => {
  let {token, FUserType,TRoleType,link}= to.query
  //url携带token登录
  if(token){
    sessionStorage.setItem('FToken',token)
    sessionStorage.setItem('otherLogin',1) //记录是通过token登录
    sessionStorage.setItem('link',link+to.hash)
    await System({
      FAction:'QueryTokenInfo'
    })
    .then((data) => {
      sessionStorage.setItem('FContacts',data.FObject.FContacts)
      sessionStorage.setItem('projectList',JSON.stringify(data.FObject.Project))
      sessionStorage.setItem('FUserType',FUserType)
      sessionStorage.setItem('TRoleType',TRoleType)
      store.state.projectList = data.FObject.Project
      store.state.token = data.FObject.FToken
      if(TRoleType == 1){
        next({path:'/'})
      }else if(TRoleType == 2){
        next({path:'/index/1'})
      }else{ 
          let project = data.FObject.Project[0]
          sessionStorage.setItem('projectID',project.ProjectID)
          sessionStorage.setItem('projectName',project.ProjectName)
          next({path:'/indexItem/1'})
      }
    }).catch((err) => {
      console.log(err)
    });
    return
  }
  token = token || sessionStorage.getItem('FToken')
  TRoleType = TRoleType || sessionStorage.getItem('TRoleType')
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
    //角色权限限制
    if(TRoleType == 2&&to.name == 'block'){
      next({path:'/index/1'})
    }else if((TRoleType == 3||TRoleType == 4)&&(to.name == 'block'||to.name == 'system')){
      next({path:'/indexItem/1'})
    }else{
      next()
    }
  }

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
