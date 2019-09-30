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
        },
        {
            path:'/manage', //后台管理系统
            component:() => import('./views/manage/layout/index'),
            children:[
                {
                    path:'system', //系统管理
                    component:() => import('./views/manage/system/index'),
                    children:[
                        {
                            path:'organizational', //组织管理
                            component: () => import('./views/manage/system/organizational/index'),
                            children:[
                                {
                                    path:'', //行政架构
                                    component: () => import('./views/manage/system/organizational/framework')

                                },
                                {
                                    path:'group', //组织架构
                                    component: () => import('./views/manage/system/organizational/group'),
                                },
                                {
                                    path: 'projectInfo',
                                    component: () => import('./views/manage/system/organizational/projectInfo')
                                }
                            ]
                        },
                    ]
                },
                {
                    path:'operation',
                    component:() => import('./views/manage/layout/common.vue'),
                    children:[
                        {
                            path:'block', //集团信息
                            component: () => import('./views/manage/operation/block.vue')
                        },
                        {
                            path:'signInfo', //工单配置（签到信息）
                            component: () => import('./views/manage/operation/signInfo.vue')
                        },
                        {
                            path:'alarmConfig',//告警配置
                            component: () => import('./views/manage/operation/alarmConfig.vue')
                        },
                        {
                            path:'paramConfig',//参数配置
                            component: () => import('./views/manage/operation/paramConfig.vue')
                        },
                        {
                            path:'energyType',//能源类型
                            component: () => import('./views/manage/operation/energyType.vue')
                        },
                        {
                            path:'deviceType',//能源类型
                            component: () => import('./views/manage/operation/deviceType.vue')
                        },
                        {
                            path:'alarmType',//能源类型
                            component: () => import('./views/manage/operation/alarmType.vue')
                        },
                        {
                            
                            path:'user',
                            name:'用户管理',
                            component: () => import('./views/manage/operation/user.vue')

                        },
                        {
                            path:'role',
                            name:'角色管理',
                            component: () => import('./views/manage/system/user/role')
                        }

                    ]
                },
                {
                    path:'inspecttionStandard/:id', //巡检标准
                    component:() => import('./views/manage/InspectionStandard.vue')
                },
                {
                    path:'maintenanceStandard/:id', //保养标准
                    component:() => import('./views/manage/MaintenanceStandard.vue')
                }
            ]
        }
    ]
})