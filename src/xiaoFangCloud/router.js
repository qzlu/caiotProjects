import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/home/index.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login/login.vue') //数字消防云平台
        },
        {
            path:'',
            name:'index',
            component: Index //集团页面
        },
        {
            path:'/indexItem',
            name:'indexItem',
            component: () => import('./views/home/indexItem.vue') //项目页面
        },
    ]
})