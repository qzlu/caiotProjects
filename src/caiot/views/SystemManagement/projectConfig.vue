<template>
    <div class="report project-config">
        <div class="header">
<!--             <span>项目名称</span>
            <el-select v-model="projectID"  value-key="ProjectID" filterable  placeholder="请选择">
              <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
            </el-select> -->
        </div>
        <div class="main">
            <ul v-for="(item,index) in arr" :key="index">
                <li  v-for="(obj,i)  in item" :key="i">
                    <div class="item l clearfix">
                        <router-link :to="{name:obj.FFunctionURLAddress}" >
                            <div @click="updateUProcessConfigState(obj,1)">
                                <div class="index l">
                                    {{obj.index}}
                                </div>
                                <img v-if="obj.FState == 2" class="l clearfix" src="../../static/image/project/icon_1.png" alt="">
                                <img v-if="obj.FState == 1" class="l clearfix" src="../../static/image/project/icon_2.png" alt="">
                                <img v-if="obj.FState == 0" class="l clearfix" src="../../static/image/project/icon_3.png" alt="">
                                <p class="state">{{obj.FStateName}}</p>
                            </div>
                        </router-link>
                        <div class="l project">
                            <router-link :to="{name:obj.FFunctionURLAddress}">
                                <p @click="updateUProcessConfigState(obj,1)">{{obj.ConfigName}}</p>
                            </router-link>
                            <button class="zw-btn" :disabled ='obj.FState == 0' @click="updateUProcessConfigState(obj,2)">完成</button>
                        </div>
                    </div>
                    <div :class="['icon','clearfix',{'horizontal':i!==item.length-1},{'veticel':i===item.length-1}]" v-if="obj.index != data.length">
                        <div class="circle"></div><div class="border"></div><div class="circle"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import _ from 'Lodash';
import {system} from '@/caiot/request/api.js';
export default {
    data(){
        return{
            data:[],
        }
    },
    computed:{
        arr(){
            return _.chunk(this.data,4)
        }
    },
    created(){
        this.queryData()
    },
    methods:{
        /**
         * 292.查询流程配置
         */
        queryData(){
            system({
                FAction:'QueryUProcessConfig',

            })
            .then(data => {
                this.data = data.FObject
                this.data.forEach((item,index) =>{
                    this.$set(item,'index',index+1)
                })
            })
            .catch(err => {})
        },
        /**
         * 293.修改流程配置状态
         */
        updateUProcessConfigState(row,state){
            if(row.FState == 2) return
            system({
                FAction:'UpdateUProcessConfigState',
                ID:row.ID,
                FState:state
            })
            .then(data => {
                if(state == 2){
                    this.queryData()
                }
            })
            .catch(err => {
                
            })
        }
    }
}
</script>
<style lang="scss">
$img-url:'../../static/image/';
.project-config{
    .header{
        text-align: left;
        span{
            font-size: 17px;
        }
        .el-input .el-input__inner {
            width: 160px;
            background: #042E74;
            border-color: #18406b;
            color: #f1f1f2;
        }
    }
    .main{
        margin-top: 50px;
        ul{
            display: flex;
            justify-content: space-between;
            li{
                position: relative;
                .item{
                    width: 308px;
                    height: 174px;
                    position: relative;
                    background: url(#{$img-url}project/bg_1.png);
                    .index{
                        width:22px;
                        height:22px;
                        line-height: 22px;
                        border:1px solid rgba(42,145,252,1);
                        border-radius:50%;
                        margin-left:15px;
                        margin-top: 14px;
                        color: #f1f1f2;
                    }
                    img{
                        margin-left: -20px;
                        margin-top: 20px;
                    }
                    .state{
                        position: absolute;
                        top: 100px;
                        left: 70px;
                        font-size: 18px;
                        color: #f1f1f2;
                    }
                    .project{
                        transform: translateY(50%);
                        p{
                            font-size: 18px;
                            margin-bottom: 23px;
                            color: #f1f1f2;
                        }
                        .zw-btn{
                            width:88px;
                            height:35px;
                            line-height: 35px;
                            background:rgba(18,79,179,1);
                            border-radius:6px;
                        }
                        .zw-btn[disabled='disabled']{
                            background: #999999;
                            cursor:not-allowed;                
                        }
                    }
                }
                .icon{
                    height: 12px;
                    line-height: 12px;
                    margin-left: 8px;
                    .circle{
                        width:12px;
                        height:12px;
                        border:1px solid rgba(42,145,252,1);
                        border-radius:50%;
                    }
                }
                .icon.horizontal{
                    float: left;
                    margin-top: 81px;
                    div{
                        float: left;
                    }
                    .border{
                        width:34px;
                        height:2px;
                        background:rgba(42,145,252,1);
                        margin-top: 5px;
                    }
                }
                .icon.veticel{
                    position: absolute;
                    left: 50%;
                    margin-left: -6px;
                    bottom: -26px;
                    .border{
                        width:2px;
                        height:34px;
                        background:rgba(42,145,252,1);
                        margin-left: 6px;
                    }
                }
            }
        }
        ul+ul{
            margin-top: 96px;
        }
        ul:nth-of-type(2){
            flex-direction: row-reverse;
            li{
                display: flex;
                flex-direction: row-reverse;
                .icon{
                    margin-left:0;
                    margin-right: 8px;
                }
            }
        }
    }
}
</style>
