import Vue from 'vue'
import Vuex from 'vuex'
import {project, system} from '@/caiot/request/api.js';
import * as comm from "../assets/js/pro_common";
import router from "../router/index"
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
    return () => import(`@/caiot/views/${path}`)
}
let detail = [{
    path: 'detail_info/:id/:SingleType', //实时监测详情页
    name: 'detail_info',
    component: () => import('@/caiot/views/monitoring/detail_info'),
    meta: {
        title: '千仞云平台',
        requireAuth: true,
    },
},
{
    path: 'detail_info_list/:id/:PossionID/:getalldata/',//详情页-详细列表
    name: 'detail_info_list',
    component: () => import('@/caiot/views/monitoring/detail_info_List.vue'),
    meta: {
        title: '千仞云平台',
        requireAuth: true,
    },
},
]
//生成路由
const generaMenu = function(data,arr = []){
    arr = data.map(menu => {
        if(menu.FChildMenu&&menu.FChildMenu.length>0){
            generaMenu(menu.FChildMenu,)
        }
        if(menu.FMenuLevle == 1){
            let children
            if(menu.FChildMenu&&menu.FChildMenu.length>0){
                children = generaMenu(menu.FChildMenu,[])
                if(menu.FMenuName == '项目态势'){
                    children.push(
                        {
                            path: 'deviceControl',
                            name: 'deviceControl', //设备管控
                            component: () => import('@/caiot/views/ProjectOverview/deviceControl.vue'),
                            meta: {
                                title: '千仞云平台',
                                requireAuth: true,
                            },
                        }
                    )
                }
                if(menu.FMenuName == '实时监测'){
                    children.push(...detail)
                }
                if(menu.FMenuName == '设备管理'){
                    children.push(
                        {
                            path: 'DeviceInfo/:deviceID',   //设备详情
                            name: 'DeviceInfo',
                            component: () => import('@/caiot/views/DeviceManagement/deviceInfo.vue'),
                            meta: {
                                title: '千仞云平台',
                                requireAuth: true,
                            },
                        },
                    )
                }
            }
            return {
                path:'/'+menu.FFunctionURLAddress,
                name:menu.FFunctionURLAddress,
                component:lazyLoad(menu.FComponent||'common.vue'),
                redirect:menu.FURL,
                children:children,
                meta: {
                    title: '千仞云平台',
                    requireAuth: true,
                },
            }
        }else{
            return {
                path:menu.FURL,
                name:menu.FFunctionURLAddress,
                component:lazyLoad(menu.FComponent||'common.vue'),
                children:menu.FChildMenu&&menu.FChildMenu.length>0?generaMenu(menu.FChildMenu,[]):[],
                meta: {
                    title: '千仞云平台',
                    requireAuth: true,
                },
            }
        }
    })
    return arr
}
const store = new Vuex.Store({
    state: { 
      projectList:[], //所有项目
      areaList:[], //所有区域
      orderUser:[],
      menuData:JSON.parse(localStorage.getItem('menuData'))||[], //主页菜单
      systemMenu:localStorage.getItem('systemMenu') != "undefined"?JSON.parse(localStorage.getItem('systemMenu')):[] //后台管理菜单
    },
    mutations: {
        /**
         * 66.获取所有区域
         * @param {*} state 
         */
        queryUAreaList(state){
            system({
                FAction:'QueryUAreaList'
            })
            .then(data => {
                state.areaList  = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 356.查询工单转单账户列表
         */
        queryOrderTUsers(state){
            system({
                FAction:'QueryOrderTUsers',
                FType:1
            })
            .then((data) => {
                state.orderUser = data.FObject
            }).catch((err) => {
                
            });
        }
    },
    actions:{
        queryOrderTUsers({commit}){
            commit('queryOrderTUsers')
        },
        /**
         * 根据token获取用户信息
         */
        tokenLogin(){
            return new Promise((resolve,reject) => {
                system({
                    FAction:'TokenLogin'
                })
                .then((result) => {
                    let userInfo = result.FObject[0]||{}
                    localStorage.setItem("FUserType",userInfo.FUserType)//用户管理角色
                    localStorage.setItem("logo",userInfo.BlocLogo)
                    localStorage.setItem("formName",userInfo.PlatformName)
                    localStorage.setItem("BlocName",userInfo.BlocName)
                    localStorage.setItem(
                      "FUserNickname",
                      userInfo.FUserNickname
                    ); //用户别名，每个账号都有个中文名
                    resolve()
                }).catch((err) => {
                    reject(err)
                });
            })
        },
        /**
         * 获取所有项目
         */
        getProject({state}){
            return new Promise((resolve,reject) => {
                project({
                    FAction: "GetProject"
                })
                .then((data) => {
                    state.projectList = data.FObject
                    resolve(state.projectList)
                }).catch((err) => {
                    reject(err)
                });
            })
        },
        /**
         * 获取菜单列表
         */
        getMenu({state}){
            return new Promise((resolve,reject) => {
                system({
                    FAction: "QueryUsersMenu"
                })
                .then(data => {
                    let menuData = comm.ChangeRouterVal(data.FObject); //匹配路由名
                    let menuList = formatterMenu(menuData)
                    state.menuData = menuList.filter(item => item.FMenuType == 5)
                    let systemMenu = menuList.filter(item => item.FMenuType != 5)
                    state.systemMenu = systemMenu[0]?systemMenu[0].FChildMenu:''
                    if(Array.isArray(state.menuData)){
                        localStorage.setItem('menuData',JSON.stringify(state.menuData))
                    }
                    if(Array.isArray(state.systemMenu)){
                        localStorage.setItem('systemMenu',JSON.stringify(state.systemMenu))
                    }
                    resolve(state.menuData[0])
                })
                .catch(error => {
                  reject(error)
                });
            })
        },
        addRoute(){
            let menuData,systemMenu
            try {
                menuData = JSON.parse(localStorage.getItem('menuData'))||[]
            } catch (error) {
                menuData = []
            }
            try {
                systemMenu = JSON.parse(localStorage.getItem('systemMenu'))||[]
            } catch (error) {
                systemMenu = []
            } 
            if(Array.isArray(menuData)&&menuData.length>0){
                let homeRoutes = generaMenu(menuData)
                let routers = [
                    {
                        path: '/',
                        name: 'home',
                        component: () => import('@/caiot/views/home'),
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
                        component: () => import('@/caiot/views/manage/layout/index.vue'),
                        redirect: `${manageRoutes[0]?manageRoutes[0].path:''}`,
                        children:manageRoutes
                    }
                ]
                router.addRoutes(routers)
            }
        }
    }
})
export default store