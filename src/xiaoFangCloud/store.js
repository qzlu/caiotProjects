import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    projectId:0,
    FContacts:'',
    userType:null,
    projectName:'',
    routeList:JSON.parse(sessionStorage.getItem('cacheRoute'))||[],
    projectList:JSON.parse(sessionStorage.getItem('projectList'))||[]
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
    }
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
    }
  }
})