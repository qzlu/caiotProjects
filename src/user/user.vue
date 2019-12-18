<template>
    <div>
        <zw-table
         ref="table"
         :tableLabel="tableLabel"
         :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          @submit="addOrUpdate"
        >
            <el-form class="user-form" slot="dialog" :model='addData' ref='form' inline>
                <el-form-item label="用户姓名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                    <el-input v-model="addData.FContacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="FTelephone" :rules="FTelephoneRule">
                    <el-input v-model="addData.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="用户账号" prop="FUserName" :rules="FUserNameRule">
                    <el-input v-model="addData.FUserName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="FPassword">
                    <span style="margin-left:10px;">123456</span>
                </el-form-item>
                <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                    <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="管理角色" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                    <el-option v-for="(item,i) in userTypeList" :key="i" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.FUserType <= 2" label="管理集团" prop="FORGGroupGUIDStr" :rules="[{ required: true, message: '请选择'}]">
                  <el-select class="row" v-model="checkedBlock" multiple   placeholder="请选择集团">
                    <el-option v-for="(item,i) in blockList" :key="i" :value="item.FGUID" :label="item.FSimpleName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else  label="管理项目" prop="ProjectIDStr" :rules="[{ required: true, message: '请选择'}]"><!-- collapse-tags -->
                    <el-cascader
                      class="row"
                      v-model="checkedProject"
                      :options="projectList"
                      :props="props"
                      clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                </el-form-item>
                <div class="form-list">
                    <span class="label l">平台类型</span>
                    <ul>
                       <li v-for="item in formList" :key="item.FGUID">
                           <el-checkbox v-model="item.checked">{{item.FormName}}</el-checkbox>
                           <el-input v-model="item.nickName" type="text" maxlength="10" placeholder="自定义名称(少于十个字)"></el-input>
                        </li> 
                    </ul>
                </div>
                <div class="form-list group-list">
                    <span class="label l">组织架构</span>
                    <ul>
                        <li v-for="(group,i) in groupList" :key="i">
                            <el-select  v-model="group.department"   placeholder="选择部门">
                              <el-option v-for="(item,i) in departmentList" :key="i" :value="item.FGUID" :label="item.FDepartmentName"></el-option>
                            </el-select>
                            <el-select  v-model="group.job"   placeholder="选择岗位">
                              <el-option v-for="(item,i) in jobList" :key="i" :value="item.FGUID" :label="item.FJobName"></el-option>
                            </el-select>
                            <el-select  v-model="group.duty"   placeholder="选择职责">
                              <el-option v-for="(item,i) in dutyList" :key="i" :value="item.FGUID" :label="item.FDutyName"></el-option>
                            </el-select>
                        </li>
                        <li class="add-group">
                            <div @click="deleteGroup()" v-if="groupList.length>1">
                                <i class="el-icon-minus"></i>
                            </div>
                            <div @click="addGroup()">
                                <i class="iconfont icon-plus-s"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-form>
        </zw-table>
    </div>
</template>
<script>
import zwTable from '../component/table.vue'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
const groupItem = {
    department:'',
    job:'',
    duty:''
}
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
                    prop: 'FContacts',
                    label: '用户姓名'
                },
                {
                    prop: 'FTelephone',
                    label: '手机号码'
                },
                {
                    prop: 'FUserName',
                    label: '用户账号'
                },
                {
                    prop: 'TRoleName',
                    label: '功能角色'
                },
                {
                    prop: 'FUserType',
                    label: '账号类型',
                    formatter:row => userType[row.FUserType].name
                },
            ],
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
                ProjectIDStr:'',
                FDepartmentStr:'',
                FDutyStr:'',
                FJobStr:'',
                FTFormStr:'',
                FTUserStr:'',
                FORGGroupGUIDStr:''
            },
            param:{
                SearchKey:"",
                PageIndex:1,
                PageSize:1000000
            },
            userTypeList:userType.slice(sessionStorage.getItem('FUserType')||0),
            userType:sessionStorage.getItem('FUserType'),
            FUserNameRule: [{required: true, validator: validateUserName}],//用户名规则
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            blockList:[], //所有集团
            formList:[], //平台列表
            departmentList:[], //部门列表
            jobList:[],
            dutyList:[],
            props:{
                multiple: true,
            },
            projectList:[],
            checkedProject:[],
            groupList:[{...groupItem}],
            checkedBlock:[]
        }
    },
    components:{
        zwTable
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
        this.queryRoleData()
        this.queryProject()
        this.queryBlock()
        this.queryTUserDepartment()
            .then((result) => {
                this.departmentList = result.FObject || []
            }).catch((err) => {
            });
        this.queryJob()
            .then((result) => {
                this.jobList = result.FObject || []
            }).catch((err) => {

            });
        this.queryDuty()
            .then((result) => {
                this.dutyList = result.FObject || []
            }).catch((err) => {
                
            });
    },
    methods:{
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
            return this.$post('QueryPageTUsers',param,true)
        },
        /**
         * 平台管理—查询用户平台信息
         */
        queryTUserForm(type = '1',user = ''){
          return this.$post('QueryTUserForm',{FType:type,FUserGuid:user})

        },
        /**
         * queryRoleData 分页查询查询角色
         * 
         */
        queryRoleData() {
            this.$post('QueryPageTRole',this.param)
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
            this.$post('QueryPageDTORGGroup',this.param)
            .then((result) => {
                this.blockList = result.FObject.Data || []
                console.log(this.blockList)
            }).catch((err) => {
                
            });
        },
        /**
         * 查询用户部门列表
         */
        queryTUserDepartment(type = 1,user = ''){
            return this.$post('QueryTUserDepartment',{Ftype:type,FUserGuid:user})
        },
        /**
         * 查询用户岗位列表
         */
        queryJob(type = 1,user = ''){
            return this.$post('QueryTUserJob',{Ftype:type,FUserGuid:user})
        },
        /**
         * 获取所有的职责
         */
        queryDuty(type = 1,user = ''){
            return this.$post('QueryTUserDuty',{Ftype:type,FUserGuid:user})
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
            this.$post('QueryTORGProjectList',{FGUID:""})
            .then((result) => {
                let data = result.FObject||[]
                this.projectList = this.formatterTreeData(data)
            }).catch((err) => {
                
            });
        },
        addGroup(){
            this.groupList.push({...groupItem})
        },
        deleteGroup(){
            this.groupList.pop()
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.groupList = [{...groupItem}]
           this.checkedProject = []
           this.checkedBlock = []
           this.queryTUserForm()
            .then((result) => {
            let data = result.FObject || []
            this.formList = data.map(item => {
                return {
                    ...item,
                    checked:false,
                    nickName:''
                }
            })
          }).catch((err) => {
          
          });
        },
        /**
         * 403.用户管理-查询用户部门岗位职责
         */
        queryTUserJobDutyDepartment(user){
            this.$post('QueryTUserJobDutyDepartment',{FUserGuid:user})
            .then((result) => {
                let data = result.FObject || []
                if(data.length == 0){
                    this.groupList = [...groupItem]
                }else{
                    this.groupList = data.map(item => {
                        return {
                            department:item.TORGDepartmentGUID,
                            job:item.FORGJobGUID,
                            duty:item.FORGDutyGUID
                        }
                    })
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 编辑
         */
        async editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
            //项目联级选择器已选中值
            this.checkedProject = []
            let projectList = row.FProjectID?row.FProjectID.split(','):[]
            projectList.forEach(id => {
                this.projectList.forEach(project =>{
                    let isExit = project.children.find(item => item.projectID == id)
                    if(isExit){
                        this.checkedProject.push([project.value,id])
                    }
                })
            })
            this.checkedBlock = []
            this.queryTUserForm(2,row.FGUID)
            .then((result) => {
                let formList = result.FObject || []
                this.formList = formList.map(item => {
                    return {
                        ...item,
                        checked:item.IsExit == 1?true:false,
                        nickName:item.FUserFormName
                    }
                })
            }).catch((err) => {
            });
            this.queryTUserJobDutyDepartment(row.FGUID)
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            let projects = this.checkedProject.map(item => item[1])
            this.addData.ProjectIDStr = projects.join(',')
            let checkedForm = this.formList.filter(item => item.checked)
            this.addData.FTFormStr = checkedForm.map(item => `${item.FGUID}_${item.nickName}`).join(',')
            this.addData.FTUserStr = this.groupList.map(item => {
                return `${item.department}_${item.job}_${item.duty}`
            }).join(',')
            this.addData.FORGGroupGUIDStr = this.checkedBlock.join(',')
            console.log(this.addData.FORGGroupGUIDStr);
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.$post('AddOrUpdateTUsers',{
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
            return this.$post('DeleteTUsers',{FGUID:item.FGUID})
        },
    }
}
</script>
<style lang="scss">
    .zw-dialog{
        .el-dialog{
            .el-form{
                .form-list{
                    min-height: 50px;
                    margin-bottom: 12px;
                    ul{
                        width: 514px;
                        margin-left: 100px;
                        position: relative;
                        top: -10px;
                        li{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .el-input{
                                width: 300px;
                            }
                        }
                        li+li{
                            margin-top: 10px;
                        }
                    }
                }
                .form-list.group-list{
                    ul{
                        li{
                            .el-input{
                                width: 164px;
                            }
                            .el-select+.el-select{
                                margin-left: 10px;
                            }
                        }
                        li.add-group{
                            justify-content: center;
                            color: #9EE5F3;
                            font-size: 16px;
                            >div{
                                width:50px;
                                height:42px;
                                line-height: 42px;
                                text-align: center;
                                border:1px dotted rgba(158, 229, 243, 0.27);
                                border-radius:2px;
                                cursor: pointer;
                                i{
                                    margin-right: 4px;
                                }
                            }
                            div+div{
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>