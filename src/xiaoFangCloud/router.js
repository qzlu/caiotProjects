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
                    path:'/',
                    component:() => import('./views/shuziYy/index.vue')//数字应急页面
                },
                {
                    path:'index/:formID',
                    component:() => import('./views/xiaofang/index.vue') //数字消防页面
                },
                {
                    path:'indexItem/:formID',
                    name:'indexItem',
                    component: () => import('./views/xiaofang/indexItem.vue') //项目页面（数字消防）
                },
                {
                    path:'/deviceDetaile/:formID/:id',
                    name:'/deviceDetaile',
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
                    path:'projectInfo', //项目信息
                    component:() => import('./views/manage/project/projectInfo.vue')
                },
                {
                    path:'gatewayInfo', //网关信息
                    component:() => import('./views/manage/project/gatewayInfo.vue')
                },
                {
                    path:'deviceInfo', //设备台账
                    component:() => import('./views/manage/deviceInfo.vue')
                },
                {
                    path:'meterInfo', //仪表信息
                    component:() => import('./views/manage/project/meterInfo.vue')
                },
                {
                    path:'deviceMeter', //设备仪表
                    component: () => import('./views/manage/project/deviceMeter.vue')
                },
                {
                    path:'user' , //用户管理
                    component:() => import('./views/manage/system/user.vue')
                },
                {
                    path:'role', //角色管理
                    component:() => import('./views/manage/system/role.vue')
                }
            ]
        }
    ]
})