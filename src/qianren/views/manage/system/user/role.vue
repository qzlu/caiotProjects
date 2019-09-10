<template>
    <div class="height-100">
        <el-dialog class="zw-dialog role-config" title="权限修改" :visible.sync="show1" append-to-body width="560px">
            <ul class="tab-header clearfix">
                <li :class="{'active': tabIndex === 1,'l':true}" @click="tabIndex = 1"><div>PC功能点</div></li>
               <!--  <li :class="{'active': tabIndex === 2,'l':true}" @click="tabIndex = 2"><div>项目权限</div></li> -->
                <li class="l"></li>
            </ul>
            <div class="tab-content clearfix" v-show="tabIndex === 1">
                <tree-transfer
                    :data='menuData'
                    :data1='menuData'
                    :checkStrictly="false"
                    leftTitle='所有权限'
                    rightTitle='已选权限'
                    nodeKey="FGUID"
                    :defaultProps="defaultProps"
                    :filterNode="filterNode"
                    :defaultChecked="defaultCheckedMenu"
                     @check-change="checkChange"
                    ref="transfer"
                >
                </tree-transfer>
                <div class="submit">
                    <el-button class="zw-btn zw-btn-primary" @click="updateTRoleMenu()">确定</el-button>
                    <el-button class="zw-btn zw-btn-primary" @click="show1 = false">取消</el-button>
                </div>
            </div>
<!--             <div class="tab-content clearfix" v-show="tabIndex === 2">
                <tree-transfer
                    :data='projectList'
                    :data1='projectList'
                    :checkStrictly="false"
                    leftTitle='所有权限'
                    rightTitle='已选权限'
                    nodeKey="ProjectID"
                    :defaultProps="defaultProps1"
                    :filterNode="filterNode"
                    :defaultChecked="defaultCheckProject"
                     @check-change="checkChange1"
                    ref="transfer1"
                >
                </tree-transfer>
                <div class="submit">
                    <el-button class="zw-btn zw-btn-primary" @click="UpdateTRoleProject()">确定</el-button>
                    <el-button class="zw-btn zw-btn-primary" @click="show1 = false">取消</el-button>
                </div>
            </div> -->
        </el-dialog> 
        <Table
          ref='table'
          :tableLabel = 'tableLabel' 
          :getData='queryData' 
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
           <el-form slot="dialog" :model="addData" inline ref="form">
               <el-form-item label="角色名称" prop="FName" :rules="[{ required: true, message: '角色名称不能为空'}]">
                   <el-input v-model="addData.FName"></el-input>
               </el-form-item>
               <el-form-item label="角色简称" prop="FSimpleName" :rules="[{ required: true, message: '角色简称不能为空'}]">
                   <el-input v-model="addData.FSimpleName"></el-input>
               </el-form-item>
           </el-form>
           <template v-slot:row-operation="row">
                <span class="iconfont icon-System" title="权限"  @click="updateConfig(row)">
                    {{row.FName}}
                </span>
           </template>
        </Table>
    </div>
</template>
<script>
import formatDate from '@/utils/formatDate.js'
import Table from '../../components/table.vue'
import {treeTransfer} from '@/components/index.js'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FName',
                    label: '角色名称',
                },
                {
                    prop: 'FUserCount',
                    label: '员工数量',
                },
                {
                    prop: 'FUserName',
                    label: '创建账号',
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '创建时间',
                },
            ],
            defaultAddData:{//新增默认参数
                FGUID:'',
                FName:'',
                FORGNodeGUID:'',
                FORGDepartmentGUID:'',
                FSimpleName:'',
                FDescription:'',
                FType:0,
            },
            addData:{ //新增参数
                FGUID:'',
                FName:'',
                FORGNodeGUID:'',
                FORGDepartmentGUID:'',
                FSimpleName:'',
                FDescription:'',
                FType:0,
            },
            show1:false,
            tabIndex:1,
            menuData:[],
            role:null,
            defaultCheckedMenu:[], //已选菜单数据，控制所有菜单的选中
            defaultProps:{
                children: 'list',
                label: 'FMenuName'
            },
        }
    },
    components:{
        Table,
        treeTransfer
    },
    computed:{
    },
    created(){
    },
    methods:{
        /**
         * 查询
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('/QueryPageTRole',param,true) 
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
        },
        /**
         * 新增或编辑
         */
        addOrUpdate(){
            this.$post('/AddOrUpdateTRole',{
                MTRole:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         */
        async deleteItem(item){
            return this.$post('/DeleteTRole',{FGUID:item.FGUID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportTRole',{SearchKey:that.filterText})
        },
        /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.IsExist == 1
        },
        /**
         * 递归树 查询已选中的
         * @param {Array} data Tree Data
         * @param {Array} result 结果
         */
        findExist(data,children,id,result = []){
            data.forEach(item => {
                if(item.IsExist == 1&&(!item[children]||!item[children].length)){
                    item[id] && result.push(item[id])
                } 
                if(item[children]){
                    this.findExist(item[children], children, id, result)
                }
            })
            return result
        },
        /**
         * 查询菜单权限
         * @param {type Numer} type 0:查询所有菜单 1：根据角色guid查询已有权限菜单
         */
        queryUsersMenuTree(){
            this.$post('/QueryTMenuTree',{
                FRoleGUID:this.role.FGUID,
            })
            .then(data =>{
                console.log(data);
                this.defaultCheckedMenu = []
                this.menuData = data.FObject||[]
                this.defaultCheckedMenu = this.findExist(this.menuData,'list','FGUID')
                console.log(this.defaultCheckedMenu);
                this.$nextTick(() => {
                    this.$refs.transfer.$refs.tree1.filter()
                })
            })
            .catch(error => {
                console.log(error);
            })
        },
        updateConfig(row){
            this.show1 = true
            this.role = row
            this.queryUsersMenuTree()
            /* this.queryTRoleBloc() */
        },
        /**
         * 菜单选择发生改变
         */
        checkChange(data,check){
            if(check){
                data.IsExist = '1'
            }else{
                data.IsExist = '0'
            }
            this.$refs.transfer.$refs.tree1.filter()
        },
        /**
         * 修改菜单权限
         * menuArr全√菜单
         * halfMenuArr 半选中菜单
         */
        updateTRoleMenu(){
            let menuArr = [], halfMenuArr = []
            menuArr = this.findTree(this.menuData,'list','FGUID')
            halfMenuArr = this.$refs.transfer.$refs.tree.getHalfCheckedNodes().map(item => item.FGUID)
            menuArr.push(...halfMenuArr)
            this.$post('/UpadteTRoleMenu',{
                FGUID:this.role.FGUID,
                IDStr:menuArr.join(',')
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.show1 = false
            })
            .catch(error => {
                console.log('错误',error);
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
            })
        },
    }
}
</script>
<style lang="scss">
.role-config{
    .el-dialog{
        .tab-header{
            position: relative;
            color: white;
            font-size: 14px;
            padding: 5px 6px;
            li{
                height: 25px;
                line-height: 25px;
                padding: 0 12px;
                cursor: pointer;
                border-bottom:1px solid#7EF7FE;
                opacity:0.5;
                background-color:rgba(20,107,214,0.22);
                background-clip:content-box;
                div{
                    padding: 0 12px;
                }
            }
            li.active{
                border:1px solid#7EF7FE;
                border-bottom: none;
                background:none
            }
            li:last-of-type{
                width: 100px;
                background:none
            }
        }
        .tab-content{
            padding: 20px 30px;
            .submit{
                text-align: right;
                .zw-btn{
                    margin-top: 26px;
                    color: #9EE5F3;
                    border:1px solid rgba(81, 128, 205, 0.82);
                    background: radial-gradient(#133E6B,#1E4F8F)
                }
            }
        }
    }
}
</style>