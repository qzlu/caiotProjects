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
                    component:() => import('./views/shuziYy/index.vue'),//数字应急页面
                    meta:{
                        title:'数字应急云平台'
                    }
                },
                {
                    path:'index/:formID',
                    component:() => import('./views/xiaofang/index.vue'), //数字消防页面
                    meta:{
                        title:'数字消防'
                    }
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
            redirect:'/manage/alarmList',
            children:[
                /************************************告警管理 ********************************************/
                {
                    path:'alarmList', //告警管理（告警列表）
                    component:() => import('./views/manage/alarm/alarmList.vue')
                },
                {
                    path:'alarmConfig', //告警管理（告警配置）
                    component:() => import('./views/manage/alarm/alarmConfig.vue')
                },

                /************************************项目管理 ********************************************/
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
                    path:'deviceMaping', //设备映射
                    component: () => import('./views/manage/project/deviceMaping.vue')
                },
                /************************************系统管理 ********************************************/
                {
                    path:'UserManagement' , //用户管理
                    component:() => import('./views/manage/system/user.vue')
                },
                {
                    path:'role', //角色管理
                    component:() => import('./views/manage/system/role.vue')
                },

                /************************************通用配置 ********************************************/
                {
                    path:'meterType', //仪表类型
                    component:() => import('./views/manage/config/meterType.vue')
                },
                {
                    path:'meterModel',//仪表型号
                    component:() => import('./views/manage/config/meterModel.vue')
                },
                {
                    path:'MeterProto', //仪表协议
                    component: () => import('./views/manage/config/meterProto.vue')
                },
                {
                    path:'protocol', //协议解析
                    component: () => import('./views/manage/config/protocol.vue')
                },
                {
                    path:'deviceType', //设备类型
                    component: () => import('./views/manage/config/deviceType.vue')
                },
                {
                    path:'alarmType', //告警类型
                    component: () => import('./views/manage/config/alarmType.vue')
                },
                {
                    path:'dataItem', //数据标识
                    component: () => import('./views/manage/config/dataItem.vue')
                },
                /************************************通用配置 ********************************************/
                {
                    path:'workList',//工单列表
                    component: () => import('./views/manage/taskManage/workList.vue')
                },
            ]
        }
    ]
})