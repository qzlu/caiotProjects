import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/home'
import test from './views/test';
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
            redirect:'/blockSituation',
            children:[
                {
                    path:'/blockSituation', //集团态势
                    component: () => import('./views/home/blockSituation.vue')
                },
                {
                    path:'/systemOverview', //系统总览
                    component: () => import('./views/home/systemOverview.vue')
                },
                {
                    path:'/comprehensiveRanking', //综合排名
                    component: () => import('./views/home/comprehensiveRanking.vue')
                }
            ]
        },
        {
            path:'/waterSystem', //给排水系统
            component: () => import('./views/waterSystem/index.vue')
        },
        {
            path:'/smartParking', //智慧停车场
            component: () => import('./views/smartParking/index.vue')
        },
        {
            path:'/powerSystem', //供配电系统
            component: () => import('./views/powerSystem/index.vue')
        },
        {
            path:'/smartDoor', //智慧门禁
            component: () => import('./views/smartDoor/index.vue')
        },        {
            path:'/smartVideo', //智慧视频
            component: () => import('./views/smartVideo/index.vue')
        },
        {
            path:'/test',
            component:test
        },
        {
            path:'*',
            component:() =>import('./views/404.vue')
        }
    ]
})