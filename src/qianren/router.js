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
            component: Index,
            redirect:'/comprehensive',
            children:[
                {
                    path:'comprehensive',
                    component: () => import('./views/home/comprehensive.vue')
                },
                {
                    path: 'systemBrowse',
                    component: () => import('./views/home/systemBrowse.vue')
                }
            ]
        }
    ]
})