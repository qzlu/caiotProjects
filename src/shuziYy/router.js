import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/xiaoFangCloud/views/layout.vue'
import notAllowed from '@/xiaoFangCloud/views/403.vue'
Vue.use(Router)
export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/login',
            name: 'login',
            component: () => import('@/shuziYy/views/login/login.vue') //数字消防云平台
        },
        {
            path:'',
            component: Index, 
            children:[
                {
                    path:'/',
                    name:'block',
                    component:() => import('@/xiaoFangCloud/views/shuziYy/index.vue'),//数字应急页面
                    meta:{
                        title:'数字应急云平台'
                    }
                },
                {
                    path:'index/:formID',
                    name:'system',
                    component:() => import('@/xiaoFangCloud/views/xiaofang/index.vue'), //数字消防页面
                    meta:{
                        title:'数字消防'
                    }
                },
                {
                    path:'indexItem/:formID',
                    name:'indexItem',
                    component: () => import('@/xiaoFangCloud/views/xiaofang/indexItem.vue') //项目页面（数字消防）
                },
                {
                    path:'/deviceDetaile/:formID/:id',
                    name:'/deviceDetaile',
                    component: () => import('@/xiaoFangCloud/views/xiaofang/deviceDetaile.vue') //设备详情（数字消防）
                }
            ]
        },
        {
            path:'/manage',
            component:() => import('@/xiaoFangCloud/views/manage/layout/index.vue'),
            redirect:'/manage/alarmList',
            children:[
                /************************************告警管理 ********************************************/
                {
                    path:'alarmList', //告警管理（告警列表）
                    component:() => import('@/xiaoFangCloud/views/manage/alarm/alarmList.vue'),
                    meta:{
                        name:'实时告警'
                    }
                },
                {
                    path:'alarmConfig', //告警管理（告警配置）
                    component:() => import('@/xiaoFangCloud/views/manage/alarm/alarmConfig.vue'),
                    meta:{
                        name:'告警配置'
                    }
                },

                /************************************项目管理 ********************************************/
                {
                    path:'projectInfo', //项目信息
                    component:() => import('@/xiaoFangCloud/views/manage/project/projectInfo.vue'),
                    meta:{
                        name:'项目概览'
                    }
                },
                {
                    path:'AreaInfo', //区域信息
                    component:() => import('@/xiaoFangCloud/views/manage/project/areaInfo.vue'),
                    meta:{
                        name:'区域信息'
                    }
                },
                {
                    path:'gatewayInfo', //网关信息
                    component:() => import('@/xiaoFangCloud/views/manage/project/gatewayInfo.vue'),
                    meta:{
                        name:'网关信息'
                    }
                },
                {
                    path:'deviceInfo', //设备台账
                    component:() => import('@/xiaoFangCloud/views/manage/deviceInfo.vue'),
                    meta:{
                        name:'设备台账'
                    }
                },
                {
                    path:'meterInfo', //仪表信息
                    component:() => import('@/xiaoFangCloud/views/manage/project/meterInfo.vue'),
                    meta:{
                        name:'仪表信息'
                    }
                },
                {
                    path:'deviceMeter', //设备仪表
                    component: () => import('@/xiaoFangCloud/views/manage/project/deviceMeter.vue'),
                    meta:{
                        name:'设备仪表'
                    }
                },
                {
                    path:'deviceMaping', //设备映射
                    component: () => import('@/xiaoFangCloud/views/manage/project/deviceMaping.vue'),
                    meta:{
                        name:'设备映射'
                    }
                },
                {
                    path:'SystemType', //系统分类
                    component: () => import('@/xiaoFangCloud/views/manage/system/SystemType.vue'),
                    meta:{
                        name:'系统分类'
                    }
                },
                /************************************系统管理 ********************************************/
                {
                    path:'UserManagement' , //用户管理
                    component:() => import('@/xiaoFangCloud/views/manage/system/user.vue'),
                    meta:{
                        name:'用户管理'
                    }
                },
                {
                    path:'role', //角色管理
                    component:() => import('@/xiaoFangCloud/views/manage/system/role.vue'),
                    meta:{
                        name:'角色管理'
                    }
                },
                {
                    path:'Block' , //集团信息
                    component:() => import('@/xiaoFangCloud/views/manage/system/block.vue'),
                    meta:{
                        name:'集团信息'
                    }
                },
                {
                    path:'ProjectConfig', //项目信息
                    component:() => import('@/xiaoFangCloud/views/manage/system/projectConfig.vue'),
                    meta:{
                        name:'项目信息'
                    }
                },
                /************************************通用配置 ********************************************/
                {
                    path:'meterType', //仪表类型
                    component:() => import('@/xiaoFangCloud/views/manage/config/meterType.vue'),
                    meta:{
                        name:'仪表类型'
                    }
                },
                {
                    path:'meterModel',//仪表型号
                    component:() => import('@/xiaoFangCloud/views/manage/config/meterModel.vue'),
                    meta:{
                        name:'仪表型号'
                    }
                },
                {
                    path:'MeterProto', //仪表协议
                    component: () => import('@/xiaoFangCloud/views/manage/config/meterProto.vue'),
                    meta:{
                        name:'仪表协议'
                    }
                },
                {
                    path:'protocol', //协议解析
                    component: () => import('@/xiaoFangCloud/views/manage/config/protocol.vue'),
                    meta:{
                        name:'协议解析'
                    }
                },
                {
                    path:'deviceType', //设备类型
                    component: () => import('@/xiaoFangCloud/views/manage/config/deviceType.vue'),
                    meta:{
                        name:'设备类型'
                    }
                },
                {
                    path:'alarmType', //告警类型
                    component: () => import('@/xiaoFangCloud/views/manage/config/alarmType.vue'),
                    meta:{
                        name:'告警类型'
                    }
                },
                {
                    path:'dataItem', //数据标识
                    component: () => import('@/xiaoFangCloud/views/manage/config/dataItem.vue'),
                    meta:{
                        name:'数据标识'
                    }
                },
                /************************************通用配置 ********************************************/
                {
                    path:'workList',//工单列表
                    component: () => import('@/xiaoFangCloud/views/manage/taskManage/workList.vue'),
                    meta:{
                        name:'工单列表'
                    }
                },
            ]
        },
        {
            path:'/403',
            component:notAllowed
        }
    ]
})