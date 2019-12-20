// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import './router/handle' //路由拦截、设置title及强制跳转
import DeleteMessage from './zw-components/messageBox/index.js'
Vue.prototype.$DeleteMessage = DeleteMessage
import '@/assets/css/reset.css'
import '@/assets/css/common.scss' /*引入公共样式*/
import '@/assets/css-font/iconfont.css' /*引入字体图标样式*/
import '@/assets/css/reset-el-table.scss' //修改el-table样式
import {Post} from '@/request/api.js'
Vue.prototype.$post = Post
import htmlToPdf from './static/js/htmlToPdf.js' /*引入生成pdf文件*/
Vue.use(htmlToPdf)

import caito from './static/js/caito.js' /*引入插件*/
Vue.use(caito)
/*引入videojs视频播放器*/
import 'video.js/dist/video-js.css'
Vue.config.productionTip = false
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
/* eslint-disable no-new */
