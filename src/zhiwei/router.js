import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/home'
import manage from './views/manage/layout/index'
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
            redirect:'/manage',
            children:[

            ]
        },
        {
            path:'/manage', //后台管理系统
            component:manage/* () => import('./views/manage/layout/index') */,
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
                        {
                            path:'user',//用户管理
                            component: () => import('./views/manage/system/user/index'),
                            children:[
                                {
                                    path:'',
                                    name:'用户信息',
                                    component: () => import('./views/manage/system/user/userInfo')
                                },
                                {
                                    path:'role',
                                    name:'功能角色',
                                    component: () => import('./views/manage/system/user/role')
                                }
                            ]

                        }
                    ]
                }
            ]
        }
    ]
})