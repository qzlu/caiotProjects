<template>
    <div class="height-100 user-info">
        <div class="l left-side">
            <div class="filter-box">
                <el-input
                  placeholder="请输入"
                  v-model="filterText">
                  <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </div>
            <div class="tree-content">
                <el-scrollbar>
                    <el-tree
                       ref="tree"
                       :data="treeData"
                       :props="treeProp"
                       default-expand-all
                       node-key='FGUID'
                       highlight-current
                       :expand-on-click-node='false'
                       @node-click = 'clickNode'
                       :filter-node-method="filterNode"
                    >
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <Table
               ref="table"
              :tableLabel="tableLabel"
              :getData='queryData'
              :filter='false'
              @beforeAdd = 'beforeAdd'
              @editItem = 'editItem'
              :disabledAdd="disabledAdd"
              :deleteRow = 'deleteItem'
              @submit="addOrUpdate"
            >
                <el-form slot="dialog" :model="addData" inline ref="form">
                    <el-form-item label="所属部门">
                        <el-input readonly v-model="currentNode.FORGName"></el-input>
                    </el-form-item>
                    <el-form-item label="员工编码" prop="FUserCode" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FUserCode"></el-input>
                    </el-form-item>
                    <el-form-item label="员工账号" prop="FUserName" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FUserName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码"  prop="FPassword" :rules="[{ required: true, message: '请输入'}]">
                        <el-input  show-password v-model="addData.FPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="员工姓名" prop="FContacts" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FContacts"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="FTelephone" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="员工岗位" prop="FORGJobGUID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.FORGJobGUID">
                            <el-option v-for="item in jobList" :key="item.FGUID" :value="item.FGUID" :label="item.FJobName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="员工职责" prop="FORGDutyGUID">
                        <el-select v-model="addData.FORGDutyGUID">
                            <el-option v-for="item in dutyList" :key="item.FGUID" :value="item.FGUID" :label="item.FDutyName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请输入'}]">
                        <el-select v-model="addData.FRoleGUID">
                            <el-option v-for="item in roleList" :key="item.FGUID" :value="item.FGUID" :label="item.FName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理角色">
                        <el-cascader
                            ref="role"
                            v-model="selectRole"
                            :options="roleTree"
                            :props="{ multiple: true, checkStrictly: true,children:'ListData',label:'FORGName',value:'FGUID' }"
                            collapse-tags
                            clearable>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="账号类型" prop="FUserType" :rules="[{ required: true, message: '请输入'}]">
                        <el-select v-model="addData.FUserType">
                            <el-option v-for="item in userType" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </Table>
        </div>
    </div>
</template>
<script>
import Table from '../components/table.vue'
const param = {
    PageIndex:1,
    PageSize:1000,
    SearchKey:''
}
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
export default {
    data(){
        return{
            filterText:'',
            tableLabel:[
                {
                    prop: 'FUserCode',
                    label: '员工编码',
                },
                {
                    prop: 'FUserName',
                    label: '员工账号',
                },
                {
                    prop: 'FContacts',
                    label: '员工姓名',
                },
                {
                    prop: 'FJobName',
                    label: '岗位',
                },
                {
                    prop: 'FDutyName',
                    label: '职责',
                },
                {
                    prop: 'FORGName',
                    label: '管理角色',
                },
                {
                    prop: 'TRoleName',
                    label: '功能角色',
                },
            ],
            treeData:[],
            treeProp:{
                children:'ListData',
                label:'FORGName'
            },
            defaultAddData:{ //新增默认数据
            },
            addData:{
                FGUID:'',             //唯一ID
                FORGNodeGUID:'',      //组织架构GUID
                FORGDepartmentGUID:'',//组织部门GUID
                FUserName:'',        //用户名
                FPassword:'',        //密码
                FUserNickname:'',    //用户别称
                FDescribe:'',        //说明
                FCreateTime:'',      //创建时间
                FUserType:'',        //用户类型
                FCreatorGUID:'',     //创建者GUID
                FLastUpdateTime:'',  //修改日期
                FUpdateBy:'',        //修改人
                FState:'',           //状态
                FContacts:'',        //联系人
                FTelephone:'',       //联系电话
                FEMailAddress:'',    //邮箱
                FIMG:'',             //用户头像
                FRoleGUID:'',        //角色ID
                FORGNodeGUIDStr:'',  //组织guid 多个用逗号隔开
                FORGDutyGUID:'',     //职责GUID
                FORGJobGUID:'',      //岗位GUID
                FUserCode:'',        //用户编码
            },     
            jobList: [], //所有岗位
            dutyList: [], //所有职责
            roleList: [], //所有管理角色
            currentNode:{}, //当前选中节点
            userType:userType.slice(sessionStorage.getItem('FUserType')),
            roleTree:[], //管理角色
            selectRole:[] //所选择的管理角色
        }
    },
    components:{
        Table
    },
    computed:{
        disabledAdd(){
            let value = this.currentNode.FGUID?false:true
            return value
        }
    },
    watch:{
        filterText(val){
            this.$refs.tree.filter(val);
        },
    },
    created(){
        this.defaultAddData = JSON.parse(JSON.stringify(this.addData))
        this.queryTreeData()
        this.queryJob()
        this.queryDuty()
        this.queryRole()
        this.queryTUserNodeTree()
    },
    methods:{
        /**
         * 查询左边树形数据
         */
        queryTreeData(){
            this.$post('/QueryTORGNodeTree',{
                FNodeType:'3'
            })
            .then((result) => {
                this.treeData = result.FObject||[]
                if(this.treeData[0]){
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentNode(this.treeData[0])
                        this.currentNode = this.treeData[0]
                        this.$refs.table.queryData()
                    })
                }
            }).catch((err) => {
                
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.FORGName.indexOf(value) !== -1;
        },
        /**
         * 选中节点的时候
         * @param 选中的节点
         */
        clickNode(node){
            console.log(node);
            this.currentNode = node
            this.$refs.table.queryData()
        },
        /**
         * 查询用户信息
         */
        queryData(that){
            let param = {
                FGUID: this.currentNode.FGUID,
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:''
            }
            if(this.currentNode.FGUID){
                return this.$post('/QueryPageTUsers',param,true)
            }else{
                return null
            }
        },
        /**
         * 获取所有的岗位
         */
        queryJob(that){
            this.$post('/QueryPageTORGJob',param)
            .then((result) => {
                this.jobList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 获取所有的职责
         */
        queryDuty(that){
            this.$post('/QueryPageTORGDuty',param)
            .then((result) => {
                this.dutyList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 获取所有的角色
         */
        queryRole(that){
            this.$post('/QueryPageTRole',param)
            .then((result) => {
                this.roleList = result.FObject.Data || []
            }).catch((err) => {
                
            }); 
        },
        /**
         * 树状管理角色children 为 0 时去掉这个值
         */
        forMatteTreeData(data){
            data.forEach(element => {
                if(element.ListData.length === 0){
                    delete element.ListData
                }else{
                    this.forMatteTreeData(element.ListData)
                }
            });
            return data
        },
        /**
         * 用户管理—查询树状管理角色
         */
        queryTUserNodeTree(){
            this.$post('/QueryTUserNodeTree')
            .then((result) => {
                console.log(result)
                let data = result.FObject||[]
                this.roleTree = this.forMatteTreeData(data)

            }).catch((err) => {
                
            });
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
            console.log(row)
            this.selectRole = []
        },
        /**
         * 新增或修改用户
         */
        async addOrUpdate(){
            let roleList = this.$refs.role.getCheckedNodes().map(item => item.value)||[]
            this.addData.FORGNodeGUIDStr = roleList.join(',')
            this.addData.FORGNodeGUID = this.currentNode.FGUID
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.$post('/AddOrUpdateTUsers',{
                MTUsers:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除用户
         */
        deleteItem(row){
            return this.$post('/DeleteTUsers',{FGUID:row.FGUID})
        },
/*         exportFile(){

        } */
    }
}
</script>
<style lang="scss">
.user-info{
    padding-top: 16px;
    .left-side{
        width: 394px;
        border:1px solid rgba(35,159,221,1);
        border-radius:10px;
        background: rgba($color: #1C385D, $alpha: 0.6);
        .filter-box{
            height: 94px;
            padding: 0 20px;
            border-bottom: 2px solid #2DA0CB;
            .el-input{
                margin-top: 30px;
                &__inner{
                    height:46px;
                    border:2px solid #33C4F1;
                    border-radius:10px;
                    background: #092D53;
                    color: #C7FEFF;
                }
            }
            .el-input__suffix{
                top: 6px;
                right: 10px;
                font-size: 24px;
                color: #ffffff
            }
        }
        .tree-content{
            height: 750px;
            padding-bottom: 10px;
            .el-tree{
                margin-top: 20px;
                background: none;
                /* padding-left: 20px; */
                .el-input__inner{
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #C7FEFF
                }
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:rgba(51,196,241,0.36);
                    }
                }
                &-node__content{
                    height: 40px;
                    line-height: 40px;
                    span{
                        font-size: 16px;
                        color: #C7FEFF
                    }
                    .el-tree-node__expand-icon.is-leaf{
                        color: transparent
                    }
                }
                &-node__content:hover {
                    background:rgba(51,196,241,0.36);
                }
            }
            .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background:rgba(51,196,241,0.36);
            }
        }
    }
    .main{
        margin-left: 420px;
    }
}
</style>