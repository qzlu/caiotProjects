import Vue from 'vue'
import Vuex from 'vuex'
import {post} from './request/http.js'
import router from './router.js'
Vue.use(Vuex)
/**
 * 递归遍历使得一级菜单的路由为其子菜单第一个页面
 */
const formatterMenu = function (data){
  data.forEach(menu => {
      if(menu.FChildMenu&&menu.FChildMenu.length>0){
          let children = menu.FChildMenu[0]
          if(children.FChildMenu&&children.FChildMenu.length>0){
              menu.FURL = formatterMenu([children])[0].FFunctionURLAddress
          }else{
              menu.FURL = children.FURL
          }
      }
  })
  return data
}
const lazyLoad = function(path){
  return () => import(`@/qianren/views${path}`)
}
//生成路由
const generaMenu = function(data,arr = []){
  arr = data.map(menu => {
      if(menu.FChildMenu&&menu.FChildMenu.length>0){
          generaMenu(menu.FChildMenu,)
      }
      if(menu.FMenuLevle == 1&&menu.FMenuType == 7){
          let children
          if(menu.FChildMenu&&menu.FChildMenu.length>0){
              children = generaMenu(menu.FChildMenu,[])
          }
          return {
              path:'/'+menu.FFunctionURLAddress,
              component:lazyLoad(menu.FComponent||'/404.vue'),
              redirect:menu.FURL,
              children:children,
          }
      }else{
          return {
              path:menu.FURL,
              component:lazyLoad(menu.FComponent||'/404.vue'),
              children:menu.FChildMenu&&menu.FChildMenu.length>0?generaMenu(menu.FChildMenu,[]):[],
              meta:{
                name:menu.FMenuName
              }
          }
      }
  })
  return arr
}
export default new Vuex.Store({
  state: {
    token:null,
    projectId:0,
    FContacts:'',
    userType:null,
    projectName:'',
  },
  mutations: {
  },
  actions: {
    /**
     * 获取用户菜单
     */
    getMenus(){
      return new Promise((resolve,reject) => {
        post('/QueryUsersMenu')
        .then((result) => {
          let menuData = result.FObject; //匹配路由名
          let menuList = formatterMenu(menuData)
          let menus = menuList.filter(item => item.FMenuType == 7)
          let systemMenu = menuList.filter(item => item.FMenuType != 7)
          menus&&sessionStorage.setItem('menuData',JSON.stringify(menus))
          systemMenu&&sessionStorage.setItem('systemMenu',JSON.stringify(systemMenu))
          resolve()
        }).catch((err) => {
          reject(err)
        });
      })
    },
    addRoute(){
      let menuData = JSON.parse(sessionStorage.getItem('menuData'))||[]
      let systemMenu = JSON.parse(sessionStorage.getItem('systemMenu'))||[]
      if(Array.isArray(menuData)&&menuData.length>0){
          let homeRoutes = generaMenu(menuData)
          let routers = [
              {
                  path: '/',
                  name: 'home',
                  component: () => import('@/qianren/views/home'),
                  redirect: `${homeRoutes[0]?homeRoutes[0].path:""}`,//子路由设置默认页
                  children: homeRoutes
              }
          ]
          router.addRoutes(routers)
      }
      if(Array.isArray(systemMenu)&&systemMenu.length>0){
          let manageRoutes = generaMenu(systemMenu)
          let routers = [
              {
                  path: '/manage',
                  component: () => import('@/qianren/views/manage/layout/index.vue'),
                  redirect: `${manageRoutes[0]?manageRoutes[0].path:''}`,
                  children:manageRoutes
              }
          ]
          router.addRoutes(routers)
      }
  }
  }
})