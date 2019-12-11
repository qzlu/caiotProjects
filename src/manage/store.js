import Vue from 'vue'
import Vuex from 'vuex'
import {Post} from '@/request/api.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    projectId:0,
    FContacts:'',
    userType:null,
    projectName:'',
    mainDBTORGLevel: [] //行政架构等级
  },
  mutations: {
    /**
     * 229.行政架构等级--查询行政架构等级
     * @param {*} state 
     */
    queryMainDBTORGLevel(state){
      Post('/QueryMainDBTORGLevel')
      .then((result) => {
        console.log(result);
        state.mainDBTORGLevel = result.FObject
      }).catch((err) => {
        
      });
    }
  },
  actions: {
    queryMainDBTORGLevel({commit}){
      commit('queryMainDBTORGLevel')
    }
  }
})