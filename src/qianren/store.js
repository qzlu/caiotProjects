import Vue from 'vue'
import Vuex from 'vuex'
import {Post} from '@/request/api.js'
import router from './router.js'
Vue.use(Vuex)
/**
 * 递归遍历使得一级菜单的路由为其子菜单第一个页面
 */
const formatterMenu = function (data){
  data.forEach(menu => {
      if(menu.ListData&&menu.ListData.length>0){
          let children = menu.ListData[0]
          if(children.ListData&&children.ListData.length>0){
              menu.FURL = formatterMenu([children])[0].FFunctionURLAddress
          }else{
              menu.FURL = children.FURL
          }
      }
  })
  return data
}
const lazyLoad = function(path){
  return () => import(`@/${path}`)||import('@/qianren/views/404.vue')
}
//生成路由
const generaMenu = function(data,arr = []){
  arr = data.map(menu => {
      if(menu.FParentGUID =='00000000-0000-0000-0000-000000000000'){
          let children
          if(menu.ListData&&menu.ListData.length>0){
              children = generaMenu(menu.ListData,[])
          }
          if(menu.FMenuName == '用户管理'){
            children&&children.push(
                {
                  path:'/manage/roleDetail/:role',
                  component:() => import('@/user/roleDetail.vue'),
                  name:'roleDetail',
                  meta:{
                    name:'功能角色>分配权限'
                  }
                },
            )
          }
          return {
              path:menu.FURL||'/404',
              component:lazyLoad(menu.FComponent)||lazyLoad('qianren/views/404.vue'),
              /* redirect:menu.FURL, */
              children:children,
              meta:{
                name:menu.FMenuName,
                FGUID:menu.FGUID
              }
          }
      }else{
          return {
              path:menu.FURL||'/404',
              component:lazyLoad(menu.FComponent)||lazyLoad('qianren/views/404.vue'),
              children:menu.ListData&&menu.ListData.length>0?generaMenu(menu.ListData,[]):[],
              meta:{
                name:menu.FMenuName,
                FGUID:menu.FGUID
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
    menuData:[],
    formID:'3F2F8DAA-4396-46A4-953D-FCBACA4AF117'
  },
  mutations: {
  },
  actions: {
    /**
     * 获取用户菜单
     */
    getMenus({state}){
      return new Promise((resolve,reject) => {
        Post('QueryUsersMenuTree',{Ftype:1,FFormID:state.formID})
        .then((result) => {
          let menuData = result.FObject; //匹配路由名
          state.menuData = formatterMenu(menuData)
          resolve()
        }).catch((err) => {
          reject(err)
        });
      })
    },
    addRoute({state}){
      let menuData = state.menuData
      if(Array.isArray(menuData)){
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
          console.log(routers)
          router.addRoutes(routers)
      }
  }
  }
})