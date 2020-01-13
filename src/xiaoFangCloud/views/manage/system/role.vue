<template>
    <div class="report">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow="deleteItem"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model='addData' ref='form' inline>
                <el-form-item label="角色全称" prop="FName" >
                    <el-input v-model="addData.FName"></el-input>
                </el-form-item>
                <el-form-item label="角色简称" prop="FSimpleName" >
                    <el-input v-model="addData.FSimpleName"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="FOtherRoleName" >
                    <el-input v-model="addData.FOtherRoleName"></el-input>
                </el-form-item>
                <el-form-item label="角色类型" prop="FType" >
                    <el-select v-model="addData.FType"   placeholder="请选择角色类型">
                      <el-option v-for="(item,i) in userType" :key="i" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <li class="l" slot="operation" @click="importRole()" ><el-button type='primary'><i class="el-icon-download"></i>导入角色</el-button></li>
            <template slot="row-operation" slot-scope="scoped">
                <span @click="updateConfig(scoped.row)">权限</span>
            </template>
        </Table>
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
            <div class="tab-content clearfix" v-show="tabIndex === 2">
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
            </div>
        </el-dialog> 
    </div>
</template>
<script>
import {System} from '@/xiaoFangCloud/request/api.js';
import {treeTransfer} from '@/components/index.js'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
import Table from '../layout/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FName',
                    label: '角色名称'
                },
                {
                    prop: 'FSimpleName',
                    label: '角色简称'
                },
                {
                    prop: 'FOtherRoleName',
                    label: '角色编码'
                },
                {
                    prop: 'CreatorBy',
                    label: '创建人'
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '最后修改时间'
                }
            ],
            //新增角色默认数据
            defaultData:{
                FGUID:"00000000-0000-0000-0000-000000000000",
                FName:'',
                FSimpleName:'',
                FType:'',
                FDescription:'',
                FOtherRoleName:''
            },
            //新增角色数据
            addData:{
            },
            show1:false,
            tabIndex:1,
            menuData:[],
            defaultCheckedMenu:[], //已选菜单数据，控制所有菜单的选中
            defaultProps:{
                children: 'list',
                label: 'FMenuName'
            },
            defaultProps1:{
                children: 'Data',
                label: 'Name'
            },
            defaultCheckProject: [], //已有权限的项目
            role:null,
            projectList:[],
            userType:userType.slice(sessionStorage.getItem('FUserType')),
        }
    },
    components:{ 
        treeTransfer,
        Table
    },
    created(){

    },

    mounted(){
    },
    methods:{
        /**
         * 分页查询角色
         */
        queryData(data){
            return System({
                FAction:'QueryPageTRole',
                ...data
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = {...this.defaultData}
        },
        /**
         * 编辑角色
         */
        editItem(item){
            this.addData = {...this.defaultData}
            for(let key in this.addData){
                this.addData[key] = item [key]?item [key]:''
            }
        },
        /**
         * 新增或修改角色
         */
        addOrUpdate(){
            return System({
                FAction:'AddOrUpdateTRole',
                tRole:this.addData
            },true)
        },
        /**
         * 删除用户
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteTRole',
                RoleID:row.FGUID
            })
        },
        updateConfig(row){
            this.show1 = true
            this.role = row
            this.queryUsersMenuTree()
            this.queryTRoleBloc()
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
            System({
                FAction:'QueryUsersMenuTree',
                FRoleGUID:this.role.FGUID,
                FmenuLevle:0
            })
            .then(data =>{
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
        /**
         * 查询项目权限
         */
        queryTRoleBloc(){
            System({
                FAction:'QueryTRoleBloc',
                FGUID:this.role.FGUID,
            })
            .then((data) => {
                console.log(data);
                this.projectList = data.FObject||[]
                this.defaultCheckProject = this.findExist(this.projectList,'Data','ProjectID')
                console.log(this.defaultCheckProject)
                this.$nextTick(() => {
                    this.$refs.transfer1.$refs.tree1.filter()
                })
            }).catch((err) => {
                
            });
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
         * 项目选择发生改变
         */
        checkChange1(data,check){
            if(check){
                data.IsExist = '1'
            }else{
                data.IsExist = '0'
            }
            this.$refs.transfer1.$refs.tree1.filter()
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
            System({
                FAction:'AddTRoleMenu',
                FRoleGUID:this.role.FGUID,
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
        /**
         * 修改项目权限
         */
        UpdateTRoleProject(){
            let projectArr = this.findTree(this.projectList, 'Data', 'ProjectID')
            System({
                FAction: 'UpdateTRoleProject',
                FGUID:this.role.FGUID,
                IDStr:projectArr.join(',')
            })
            .then((data) => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.show1 = false
            }).catch((err) => {
                console.log('错误',error);
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
            });
        },
                /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.IsExist == 1
        },
        /**
         * 循环树形结构
         */
        findTree(data,children,id,arr = []){
            data.forEach(item => {
                if(item.IsExist&&item.IsExist==1){
                    item[id]&&arr.push(item[id])
                }
                if(item.IsExist&&item[children]){
                    this.findTree(item[children],children,id,arr)
                }
                if(!item.IsExist){
                    if(item[children]) this.findTree(item[children],children,id,arr)
                }
            })
            return arr
        },
        /**
         * 导入角色
         */
        importRole(){
            System({
                FAction:'ImportXHRoles'
            })
            .then((data) => {
                if(data.FObject){
                    this.$message({
                      type: 'success',
                      message: '导入成功!'
                    });
                    this.queryData()
                }
            }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: '导入失败!'
                });
            });
        }
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