import Vue from 'vue'
import Vuex from 'vuex'
import {Project} from './request/api.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    projectId:0,
    FContacts:'',
    userType:null,
    projectName:'',
    routeList:JSON.parse(sessionStorage.getItem('cacheRoute'))||[],
    projectList:JSON.parse(sessionStorage.getItem('projectList'))||[],
    sysTemList:[] //平台类型，数字消防，数字电梯等
  },
  mutations: {
    addRoute(state,item){
      let isExist = state.routeList.some((route)=> route.FGUID === item.FGUID)
      !isExist&&state.routeList.push(item)
      sessionStorage.setItem('cacheRoute',JSON.stringify(state.routeList))
    },
    deleteRoute(state,index){
      state.routeList.splice(index,1)
      sessionStorage.setItem('cacheRoute',JSON.stringify(state.routeList))
    },
    clearRoute(state){
      sessionStorage.removeItem("cacheRoute")
      state.routeList = []
    },
    /**
     * 获取平台列表
     */
    querySForm(state){
      Project({
          FAction:'QuerySForm'
      })
      .then((data) => {
          state.sysTemList = data.FObject
      }).catch((err) => {
      });
    },
  },
  actions: {
    addRoute({commit},item){
      commit('addRoute',item)
    },
    deleteRoute({commit},index){
      commit('deleteRoute',index)
    },
    clearRoute({commit}){
      commit('clearRoute')
    },
    querySForm({commit}){
      commit('querySForm')
    }
  }
})