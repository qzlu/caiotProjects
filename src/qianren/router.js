import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/home'
Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes:[
        {
            path:'/login',
            component: () => import('./views/login')
        },
        {
            path:'',
            component: Index,//集团首页
        }
    ]
})