<template>
    <div class="group height-100">
        <header>
            <ul class="clearfix">
                <li :class="['l',{active:active == i}]" v-for="(item,i) in tabArr" :key="i" @click="changeTab(i)">
                    {{item}}
                </li>
            </ul>
        </header>
        <div class="height-100 group-content">
            <div class="group-left-side" v-if="active != 2">
                <Tree :treeData="treeData" :treeProp="treeProp"></Tree>
            </div>
            <div class="group-main" :style="tableWidth"> 
                <component :is="componentId" @loadDepartment="queryDepartmentData()" @loadJob = "queryFORGGroupTORGJobTree()"></component>
            </div>
        </div>
    </div>
</template>
<script>
import departments from './departments'
import station from './station'
import duty from './duty'
import Tree from '../component/tree.vue'
export default {
    data(){
        return{
            tabArr:['部门信息','岗位信息','职责信息'],
            active:sessionStorage.getItem('groupActiveIndex')||0,
            tabList:['departments','station','duty'],
            treeData:[],
            treeProp:{
                children:'ListData',
                label:'FAreaName'
            }
        }
    },
    components:{
        departments,
        station,
        duty,
        Tree
    },
    computed:{
        componentId(){
            return this.tabList[this.active]
        },
        tableWidth(){
            if(this.active == 2){
                return {
                    width: '100%'
                }
            }
        }
    },
    created(){
        /* this.$store.dispatch('queryMainDBTORGLevel') */
    },
    methods:{
        /**
         * 部门左边树形
         */
        queryDepartmentData(){
            this.$post('QueryFORGGroupTORGDepartmentTree')
            .then((result) => {
               /*  console.log(result); */
                this.treeData = result.FObject || []
                console.log(this.treeData);
            }).catch((err) => {
                
            });
        },
        /**
         * 岗位左边树形
         */
        queryFORGGroupTORGJobTree(){
            this.$post('QueryFORGGroupTORGJobTree')
            .then((result) => {
                this.treeData = result.FObject || []
                console.log(this.treeData);
            }).catch((err) => {
                
            });
        },
        changeTab(index){
            this.active = index
            sessionStorage.setItem('groupActiveIndex',index)
        }
    }
}
</script>
<style lang="scss">
.group{
    margin-top:-48px;
    box-sizing:border-box;
    header{
        position: relative;
        height: 48px;
        .name{
            position: absolute;
            left: 14px;
            bottom: 10px;
            font-size: 22px;
            color: #9EE5F3
        }
        ul{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            li{
                width:187px;
                height:48px;
                line-height: 48px;
                border:1px solid rgba(143,156,191,1);
                box-sizing: border-box;
                font-size: 20px;
                cursor: pointer;
            }
            li.active{
                background: rgba($color: #2A91FC, $alpha: .59)
            }
            li:nth-of-type(2){
                border-left: none;
                border-right: none;
            }
        }
    }
    .group-content{
        display: flex;
        justify-content: space-between;
        .group-left-side{
            width:333px;
            height:100%;
            box-sizing: border-box;
            padding-top: 20px;
        }
        .group-main{
            width: 1200px;
        }
    }
}
</style>