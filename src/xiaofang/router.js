import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/Home.vue'
import Login from './views/Login.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login //掌上应急登录页
    },
    {
      path: '/',
      name: 'home',
      component: Home //掌上应急首页
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('./views/manageSystem/index.vue'), //后台管理系统
      redirect:'/system/projectManage',
      children:[
        {
          path: 'projectManage',
          name: 'projectManage',
          component: () => import('./views/manageSystem/projectManage/index.vue'), //项目管理
          redirect:'/system/projectManage/deviceManage',
          children:[
            {
              path:'deviceManage',
              name:'deviceManage',
              component: () => import('./views/manageSystem/projectManage/deviceManage.vue') //设备管理
            },
            {
              path:'buildingManage',
              name:'buildingManage',
              component: () => import('./views/manageSystem/projectManage/buildingManage.vue') //楼宇管理
            },
            {
              path:'project',
              name:'project',
              component: () => import('./views/manageSystem/projectManage/project.vue') //楼宇管理
            },
          ]
        },
        {
          path:'fireManage',
          name: 'fireManage',
          component: () => import('./views/manageSystem/fireManage/index.vue'), //火警管理
          redirect:'/system/fireManage/',
          children:[
            {
              path:'/',
              name:'fireRecord',
              component: () => import('./views/manageSystem/fireManage/fireRecord.vue')
            }
          ]
        }
      ]
    },
    {
      path:'*',
      name:'*',
      component: () => import('./views/404.vue')
    }
  ]
})
