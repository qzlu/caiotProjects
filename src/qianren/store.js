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
  },
  mutations: {
  },
  actions: {
  }
})