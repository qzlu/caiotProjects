<template>
    <div class="user-main report">
        <!-- 新增或编辑用户弹框 -->
        <div class="config-dialog">
            <el-dialog  :title="title" :visible.sync="show" :close-on-click-modal='false' width="676" class="zw-dialog">
                <el-form :model='addFormData' ref='form' inline>
<!--                     <el-form-item label="用户名称" prop="FUserNickname" :rules="[{ required: true, message: '请输入用户名称'}]">
                        <el-input v-model="addFormData.FUserNickname"></el-input>
                    </el-form-item> -->
                    <el-form-item label="账号" prop="FUserName" :rules="FUserNameRule">
                        <el-input v-model="addFormData.FUserName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="FPassword">
                        <span style="margin-left:10px;">{{addFormData.FPassword}}</span>
                        <!-- <el-input v-model="addFormData.FPassword" :disabled="true"></el-input> -->
                    </el-form-item>
                    <el-form-item label="用户名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                        <el-input v-model="addFormData.FContacts"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephoneRule">
                        <el-input v-model="addFormData.FTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="addFormData.FRoleGUID"   placeholder="请选择角色">
                        <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="管理身份" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="addFormData.FUserType"   placeholder="请选择角色">
                        <!-- <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option> -->
<!--                         <el-option key="1" label="运营管理" :value="1"></el-option>
                        <el-option key="2" label="集团管理" :value="2"></el-option>
                        <el-option key="3" label="项目管理" :value="3"></el-option>
                        <el-option key="4" label="项目现场运维" :value="4"></el-option> -->
                        <el-option v-for="(item,i) in userType" :key="i" :value="item.id" :label="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                </el-form>
                <div class="submit">
                    <button class="zw-btn zw-btn-primary" @click="submit()">确定</button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="show1" width="560">
                <ul class="tab-header clearfix">
                    <li class="active l"><div>集团项目权限</div></li>
                    <li class="l"></li>
                    <!-- <div class="border">
                    
                    </div> -->
                </ul>
                <div class="tab-content clearfix">
                    <tree-transfer
                    ref="transfer"
                    :data="projectList"
                    :data1="userProject"
                    leftTitle="所有权限"
                    rightTitle="已选权限"
                    nodeKey="ProjectID"
                    nodeKey1="ProjectID"
                    :defaultChecked="defaultChecked"
                    @check-change="checkChange"
                    :defaultProps="defaultProps"
                    >
                    </tree-transfer>
                    <div class="submit">
                        <button class="zw-btn zw-btn-primary" @click="updateUserProject()">确定</button>
                    </div>
                </div>
            </el-dialog>
        </div>
        <ul class="user-head clearfix report-header">
            <li class="l" @click="add"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l" @click ="exportFile()"><button class="zw-btn zw-btn-export">导出</button></li>
            <li class="l" @click="pageIndex=1;filterText = '';queryData()"><button class="zw-btn zw-btn-refrest">刷新</button></li>
            <li class="r">
                <el-input class="search-input" v-model="filterText" placeholder="搜索用户关键字">
                     <i class="el-icon-search" slot="suffix"></i>
                </el-input>
                <button class="zw-btn zw-btn-primary" @click="filterText = '' ">重置</button>
            </li>
        </ul>
        <div class="role-table">
            <el-table
               :data="tableData"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column
                 v-for="item in tableLabel"
                 show-overflow-tooltip
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 width="250"
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="user-operation">
                        <span @click="queryUsersProject(scoped.row)">权限</span>
                        <span @click="deleteUser(scoped.row)">删除</span>
                        <span @click="updateUser(scoped.row)">编辑</span>
                        <span @click="resetUsers(scoped.row)">初始化</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {system,project} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {treeTransfer} from '@/caiot/zw-components/index'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
export default {
    mixins:[table],
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
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop: 'FContacts',
                    label: '用户名'
                },
                {
                    prop: 'FUserName',
                    label: '账号'
                },
                {
                    prop: 'FName',
                    label: '所属角色'
                },
                {
                    prop: 'ProjectName',
                    label: '所属项目',
                    width:400
                },
                {
                    prop: 'FCreateUser',
                    label: '创建人',
                },
                {
                    prop: 'FCreateTime',
                    label: '创建时间',
                    width:'160'
                },
/*                 {
                    prop: 'FPassword',
                    label: '密码'
                } */
            ],
            show1:false,
            defaultChecked:[],
            userProject:[],
            defaultProps: { //
                children: 'data',
                label: 'ShortName'
            },
            activeUser:null, 
            roleList:null, // 新增或修改弹框中的角色列表
            //新增用户默认数据
            defaultFormData:{
                FGUID:'',
                FUserName:'',
                FPassword:'123456',
                FUserNickname:null,
                FUserType:'',
                FState:1,
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FRoleGUID:null
            },
            //新增或修改用户数据
            addFormData:{
                FGUID:'',
                FUserName:'',
                FPassword:'123456',
                FUserNickname:null,
                FUserType:'',
                FState:1,
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FRoleGUID:null
            },
            userType:userType.slice(localStorage.getItem('FUserType')),
            title:'新增', //新增或修改用户弹框标题
            show:false, //控制新增弹框是否显示
            type:0,  // 0 :新增用户 1：修改用户
            FUserNameRule: [{required: true, validator: validateUserName}],//用户名规则
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
        }
    },
    components:{
        treeTransfer
    },
    watch:{
        filterText(){
            clearTimeout(timer)
            var timer = setTimeout(() => {
                this.queryData()
            },500)
        },
        show1(val){
            if(!val){
                this.$refs.transfer.$refs.tree.setCheckedNodes([])
            }
        }
    },
    computed:{
        projectList(){
            return this.$store.state.projectList
        }
    },
    created(){
        this.queryData()
        this.queryRoleData()
    },
    mounted(){

    },
    methods:{
        /**
         * queryRole 分页查询查询用户
         * @param {type String} userName 用户名
         * @param {type Number} pageIndex 页码
         */
        queryData() {
            system({
                FAction:"QueryPageTUsers",
                FUserName:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10,
                ProjectID:localStorage.getItem("projectid")
            })
            .then(data => {
                console.log(data)
                this.total = data.FObject.Table[0].Count
                this.tableData = data.FObject.Table1
                this.tableData.forEach(item => {
                    item.ProjectName = item.ProjectName.replace(/,$/,'')
                })
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * queryRoleData 分页查询查询角色
         * @param {type Number} pageIndex 页码
         */
        queryRoleData(pageIndex = 1) {
            system({
                FAction:"QueryPageDataByTRole",
                FName:"",
                PageIndex:pageIndex,
                PageSize:1000000
            })
            .then(data => {
                this.roleList = data.FObject.Table1
            })
            .catch(err => {

            })
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * add 点击新增按钮
         */
        add(){
            this.title = '新增'
            this.type = 0
            this.show = true,
            this.addFormData = Object.assign({},this.defaultFormData)
        },
        /**
         * updateUser 编辑用户
         */
        updateUser(item) {
            this.title = '修改'
            this.show = true
            this.type = 1
            for(let key in this.addFormData){
                this.addFormData[key] = item [key]?item [key]:''
            }
            this.addFormData.FPassword = '123456'
            this.addFormData.FState = 1
        },
        /**
         * resetUsers 初始化
         */
        async resetUsers(item){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要初始化${item.FUserName}`,'初始化密码'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            this.type = 1
            for(let key in this.addFormData){
                this.addFormData[key] = item [key]?item [key]:''
            }
            this.addFormData.FPassword = '123456'
            this.addFormData.FState = 1
            this.addUser()
        },
        async submit(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.addUser()
        },
        /**
         * addUser 新增或修改用户
         * 
         */
        addUser(){
            this.addFormData.FUserNickname =  this.addFormData.FContacts
            system({
                FAction:this.type?'UpdateTUsers':'AddTUsers',
                FRoleGUID:this.addFormData.FRoleGUID,
                mTUsers:this.addFormData
            })
            .then(data => {
                this.show = false
                this.queryData()
                this.$message({
                  type: 'success',
                  message: this.type?'修改成功！':'新增成功！'
                });
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: error
                });
            })
        },
        /**
         * 399.获取指定账号管理项目
         */
        queryUsersProject(row){
            this.activeUser = row
            this.defaultChecked = []
            project({
                FAction:'QueryUsersProject',
                FUserGuid:row.FGUID
            })
            .then((result) => {
                this.userProject = result.FObject
                this.defaultChecked = this.userProject.map(item => item.ProjectID)
                this.show1 = true
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 项目集团关系树形节点选择发生改变触发
         */
        checkChange(data,check){
            if(check){
                let isExit = this.userProject.find(item => item.ProjectID == data.ProjectID)
                if(!isExit){
                    this.userProject.push({
                        ProjectID:data.ProjectID,
                        ShortName:data.ShortName
                    })
                }
            }else {
                this.userProject = this.userProject.filter(item => item.ProjectID != data.ProjectID)
            }
        },
        /**
         * 修改用户项目权限
         */
        updateUserProject(){
            if(this.userProject.length == 0){
                this.$message({
                  type: 'warning',
                  message: '请选择项目!'
                });
                return
            }
            let idStr = this.userProject.map(item => item.ProjectID).join(',')
            this.show1 = false
            project({
                FAction:'UpdateUsersProject',
                FUserGuid:this.activeUser.FGUID,
                FProjectIDStr:idStr
            })
            .then((result) => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
            }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
            });
        },
        /**
         * deleteUser 删除用户
         * @param {type Object} user 用户
         */
        async deleteUser(user){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${user.FUserName}`,'删除用户'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            system({
                FAction:'DeleteTUsers',
                FGUID:user.FGUID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            system({
                FAction:'QueryExportTUsers',
                FUserName:this.filterText,
                FName:''
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '导出失败!请重试'
                });
            })
        }   
        
    }
}
</script>
<style lang='scss'>
$img-url:'../../static/image/';
.user-main{
    .user-head{
        li:last-of-type{
           width: auto;
           position: relative;
        }
        .zw-btn{
            margin-left: 10px;
        }
    }
    .user-operation{
        span{
            cursor: pointer;
        }
        span:nth-of-type(2){
            margin: 0 20px;  
        }
    }
    // 新增或编辑弹框样式
    .config-dialog{
        .el-dialog{
            width: 676px;
            height: 528px;
            box-sizing: border-box;
            background: url('#{$img-url}admin/btn3.png') center no-repeat;
            text-align: left;
            padding-left: 48px;
            &__title{
                color: #F1F1F2;
                font-size: 17px;
                font-weight:400;
            }
            &__headerbtn{
                right: 40px;
                .el-dialog__close{
                    color: #9FC1FD;
                    font-size: 16px;
                }
            }
            .el-form{
                &-item{
                    .el-form-item__label{
                        width: 80px;
                        color: #F1F1F2;
                    }
                    .el-input{
                        width: 165px;
                        .el-input__inner{
                            background: #05679E;
                            border-color: #18406B;
                            color: #F1F1F2;
                        }
                    }
                }
                &-item:nth-of-type(2n){
                    margin-left: 30px;
                }
            }
            .submit{
                text-align: center;
                margin-top: 37px;
            }
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
                .zw-btn{
                    margin-top: 26px;
                }
            }
        }
    }
}
</style>
