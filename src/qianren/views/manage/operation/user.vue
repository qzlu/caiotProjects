<template>
    <div class="height-100 user-info">
        <div class="l left-side" v-if="userType != 1">
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
        <div :class="['main',{'margin0':userType == 1}]">
            <Table
              ref="table"
              :tableLabel="tableLabel"
              :getData="queryData"
              @beforeAdd = 'beforeAdd'
              @editItem = 'editItem'
              :deleteRow = 'deleteItem' 
              @submit="addOrUpdate"
            >
                    <el-form slot="dialog" :model='addData' ref='form' inline>
                        <el-form-item label="账号" prop="FUserName" :rules="FUserNameRule">
                            <el-input v-model="addData.FUserName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="FPassword">
                            <span style="margin-left:10px;">123456</span>
                        </el-form-item>
                        <el-form-item label="用户名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                            <el-input v-model="addData.FContacts"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephoneRule">
                            <el-input v-model="addData.FTelephone"></el-input>
                        </el-form-item>
                        <el-form-item label="员工岗位" v-if="userType != 1" prop="FORGJobGUID" :rules="[{ required: true, message: '请选择'}]">
                            <el-select v-model="addData.FORGJobGUID">
                                <el-option v-for="item in jobList" :key="item.FGUID" :value="item.FGUID" :label="item.FJobName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="员工职责" v-if="userType != 1" prop="FORGDutyGUID">
                            <el-select v-model="addData.FORGDutyGUID">
                                <el-option v-for="item in dutyList" :key="item.FGUID" :value="item.FGUID" :label="item.FDutyName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                          <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                            <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="管理身份" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                          <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                            <el-option v-for="(item,i) in userTypeList" :key="i" :value="item.id" :label="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item v-if="userType == 1" label="所属集团" prop="FORGGroupGUID" :rules="[{ required: true, message: '请选择'}]">
                          <el-select v-model="addData.FORGGroupGUID"   placeholder="请选择集团">
                            <el-option v-for="(item,i) in blockList" :key="i" :value="item.FGUID" :label="item.FSimpleName"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="项目权限" prop="FORGGroupGUID" :rules="[{ required: true, message: '请选择'}]">
                            <el-cascader
                              v-model="checkedProject"
                              :options="projectList"
                              :props="props"
                              collapse-tags
                              clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-form>
            </Table>
        </div>
    </div>
</template>
<script>
import Table from '../components/table.vue'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
export default {
    data(){
        const validateUserName = (rule,value,callback) => {  
 			var uPattern = /^[a-zA-Z0-9_]{3,16}$/;
	        if(!value) {
	            return callback(new Error('请输入用户名'));
	          }
	        else if(value&& uPattern.test(value)){
	         	callback();
	        } else{
	        	callback(new Error('请输入(3~10)位字母、数字、_'));
	        }
        };
        const phoneNumbre = (rule, value, callback) => {
            var isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;//手机号码
            var isMob= /^([0-9]{3,4}-)?[0-9]{7,8}$/;// 座机格式
            if(isMob.test(value)||isPhone.test(value)){
                callback();
            }
            else{
               callback(new Error('请输入正确的电话号码'));
            }
        }
        return{
            filterText:'',
            tableLabel:[
                {
                    prop: 'FUserCode',
                    label: '员工编码'
                },
                {
                    prop: 'FUserName',
                    label: '员工账号'
                },
                {
                    prop: 'FContacts',
                    label: '员工姓名'
                },
                {
                    prop: 'TRoleName',
                    label: '角色名称'
                },
                {
                    prop: 'FGroupName',
                    label: '所属集团',
                },
                {
                    prop:'ProjectName',
                    label: '所属项目',
                    width:400
                }
            ],
            userTypeList:userType.slice(sessionStorage.getItem('FUserType')),
            userType:sessionStorage.getItem('FUserType'),
            treeData:[],
            treeProp:{
                children:'ListData',
                label:'FORGName'
            },
            props:{
                multiple: true,
            },
            roleList:[], //角色
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                FGUID:'',
                FORGGroupGUID:'',
                FORGDepartmentGUID:'',
                FUserName:'',
                FPassword:'123456',
                FUserNickname:'',
                FUserType:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FRoleGUID:'',
                FORGDutyGUID:'',
                FORGJobGUID:'',
                FUserCode:'',
                ProjectIDStr:''
            },
            FUserNameRule: [{required: true, validator: validateUserName}],//用户名规则
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            blockList:[], //所有集团
            param:{
                SearchKey:"",
                PageIndex:1,
                PageSize:1000000
            },
            currentNode:{}, //当前选中节点
            jobList:[],
            dutyList:[],
            projectList:[],
            checkedProject:[]
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
        this.queryRoleData()
        this.queryBlock()
        this.queryProject()
        if(this.userType != 1){
            this.queryTreeData()
            this.queryJob()
            this.queryDuty()
        }
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
            }).catch((err) => {
                
            });
        },
        /**
         * 查询数据
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                FGUID:'',
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('/QueryPageTUsers',param,true)
        },
        /**
         * queryRoleData 分页查询查询角色
         * 
         */
        queryRoleData() {
            this.$post('/QueryPageTRole',this.param)
            .then(result => {
                this.roleList = result.FObject.Data || []
            })
            .catch(err => {

            })
        },
        /**
         * 获取所有集团
         */
        queryBlock(){
            this.$post('/QueryPageDTORGGroup',this.param)
            .then((result) => {
                this.blockList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        formatterTreeData(arr,result = []){
            if(!Array.isArray(arr)||arr.length==0){
                result = []
            }else{
                result = arr.map(item => {
                    if(item.ListData&&item.ListData.length>0){
                        return {
                            label:item.FGroupName,
                            value:item.FGUID,
                            children:this.formatterTreeData(item.ListData)
                        }
                    }else{
                        return {
                            label:item.FProjectName,
                            value:item.ProjectID,
                            projectID:item.ProjectID
                        }
                    }
                })
            }
            return result
        },
        queryProject(){
            this.$post('/QueryTORGProjectList')
            .then((result) => {
                let data = result.FObject||[]
                this.projectList = this.formatterTreeData(data)
                console.log(this.projectList);
            }).catch((err) => {
                
            });
        },
        /**
         * 获取所有的岗位
         */
        queryJob(that){
            this.$post('/QueryPageTORGJob',this.param)
            .then((result) => {
                this.jobList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 获取所有的职责
         */
        queryDuty(that){
            this.$post('/QueryPageTORGDuty',this.param)
            .then((result) => {
                this.dutyList = result.FObject.Data || []
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
            this.currentNode = node
            this.$refs.table.queryData()
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.checkedProject = [] 
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
            //项目联级选择器已选中值
            this.checkedProject = []
            let projectList = row.FProjectID.split(',')
            projectList.forEach(id => {
                this.projectList.forEach(project =>{
                    let isExit = project.children.find(item => item.projectID == id)
                    if(isExit){
                        this.checkedProject.push([project.value,id])
                    }
                })
            })
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            let projects = this.checkedProject.map(item => item[1])
            this.addData.ProjectIDStr = projects.join(',')
            this.$post('/AddOrUpdateTUsers',{
                MTUsers:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         */
        deleteItem(item){
            return this.$post('/DeleteTUsers',{FGUID:item.FGUID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportDTORGGroup',{SearchKey:that.filterText})
        }
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
        height: 100%;
        margin-left: 420px;
    }
    .main.margin0{
        margin-left: 0;
    }
}
</style>