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
/*         {
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
                },
                {
                    path:'/alarm', //告警管理
                    component: () => import('./views/alarm/alarmCount.vue')
                },
                {
                    path:'/energy', //能源管理
                    component: () => import('./views/energy/energyCount.vue')
                },
                {
                    path:'manage',
                    component:() => import('@/user/index.vue'),
                    meta:{
                      name:"用户管理"
                    },
                    children:[
                      {
                        path:'user',
                        component:() => import('@/user/user.vue'),
                        meta:{
                          name:'用户管理',
                          formList:['05F1CE35-D4A6-40F9-818A-F8BB219E5A5D','05F1CE35-D4A6-40F9-818A-F8BB219E5A5D']
                        }
                      },
                      {
                        path:"role",
                        component:() => import('@/user/role.vue'),
                        meta:{
                          name:'功能角色',
                          formList:['775635D2-7B86-44B6-BEEB-D622BA572894','775635D2-7B86-44B6-BEEB-D622BA572894']
                        }
                      },
                      {
                        path:'/:id/manage/roleDetail/:roleId',
                        component:() => import('@/user/roleDetail.vue'),
                        name:'roleDetail',
                        meta:{
                          name:'功能角色>分配权限'
                        }
                      },
                      {
                        path:'group',
                        component:() => import('@/user/group.vue'),
                        meta:{
                          name:'组织架构'
                        }
                      },
                      {
                        path:'organizational',
                        component:() => import('@/user/framework.vue'),
                        meta:{
                          name:'行政架构'
                        }
                      },
                      {
                        path:'ProjectManagement',
                        component:() => import('@/user/projectInfo.vue'),
                        meta:{
                          name:'项目信息'
                        }
                      },
                      {
                        path:'block',
                        component:() => import('@/user/block.vue'),
                        meta:{
                          name:'集团信息'
                        }
                      }
                    ],
                }
            ]
        }, */
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