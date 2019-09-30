import Vue from 'vue'
import Vuex from 'vuex'
import {project, system} from '@/caiot/request/api.js';
Vue.use(Vuex)
const store = new Vuex.Store({
    state: { 
      projectList:[], //所有项目
      areaList:[], //所有区域
      orderUser:[]
    },
    mutations: {
        /**
         * 获取所有项目
         */
        getProject(state){
            project({
                FAction: "GetProject"
            })
            .then((data) => {
                state.projectList = data.FObject
            }).catch((err) => {
                
            });
        },
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
        }
    }
})
export default store