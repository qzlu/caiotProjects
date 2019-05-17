import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/Home.vue'
import Login from './views/Login.vue';
import Caiot from './views/home/caiot.vue'
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
      path: '/test1',
      component: () => import('./views/home/test.vue')
    },
    {
      path: '/',
      name: 'caiot',
      component:Caiot
    },
    {
      path: '/home',
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
              component: () => import('./views/manageSystem/fireManage/fireRecord.vue') //火警记录
            },
            {
              path:'helpRecord',
              name:'helpRecord',
              component: () => import('./views/manageSystem/fireManage/helpRecord.vue') //求助记录
            }
          ]
        },
        {
          path:'systemMange',
          name:'systemMange',
          component: () => import('./views/manageSystem/system/index.vue'), //系统管理
          redirect:'/system/systemMange/',
          children:[
            {
              path:'/',
              name:'user',
              component: () => import('./views/manageSystem/system/user.vue')
            },
            {
              path:'role',
              name:'role',
              component: () => import('./views/manageSystem/system/role.vue')
            },
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
