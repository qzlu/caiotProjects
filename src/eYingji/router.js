import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/login',
            name: 'login',
            component: () => import('@/shuziYy/views/login/login.vue') //数字消防云平台
        }
    ]
})