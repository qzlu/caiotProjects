import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/home'
Vue.use(Router)
export default new Router({
    mode: 'hash',
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
                    path:'comprehensive', //综合态势
                    component: () => import('./views/home/comprehensive.vue')
                },
                {
                    path: 'systemBrowse', //系统态势
                    component: () => import('./views/home/systemBrowse.vue')
                },
                {
                    path: 'ranking', //综合排名
                    component: () => import('./views/home/ranking.vue')
                }
            ]
        }
    ]
})