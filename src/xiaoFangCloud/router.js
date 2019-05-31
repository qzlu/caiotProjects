import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/layout.vue'
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
            component: Index, 
            children:[
                {
                    path:'',
                    component:() => import('./views/shuziYy/index.vue')//数字应急页面
                },
                {
                    path:'xiaofang',
                    component:() => import('./views/xiaofang/index.vue') //数字消防页面
                },
                {
                    path:'indexItem',
                    name:'indexItem',
                    component: () => import('./views/xiaofang/indexItem.vue') //项目页面（数字消防）
                },
                {
                    path:'deviceDetaile/:id',
                    name:'deviceDetaile',
                    component: () => import('./views/xiaofang/deviceDetaile.vue') //设备详情（数字消防）
                }
            ]
        },
        {
            path:'/manage',
            component:() => import('./views/manage/layout/index.vue'),
            children:[
                {
                    path:'alarmList', //告警管理（告警列表）
                    component:() => import('./views/manage/alarm/alarmList.vue')
                },
                {
                    path:'alarmConfig', //告警管理（告警配置）
                    component:() => import('./views/manage/alarm/alarmConfig.vue')
                },
                {
                    path:'projectInfo',
                    component:() => import('./views/manage/project/projectInfo.vue')
                }
            ]
        }
    ]
})