<template>
    <div class="report user">
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
                <el-form-item label="用户姓名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                    <el-input v-model="addData.FContacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="FTelephone" :rules="FTelephoneRule">
                    <el-input v-model="addData.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="用户账号" prop="FUserName" :rules="[{ required: true, message: '请输入账号'}]">
                    <el-input v-model="addData.FUserName"></el-input>
                </el-form-item>
                <el-form-item label="密码" >
                    <el-input readonly value="123456"></el-input>
                </el-form-item>
                <el-form-item label="第三方账号" prop="FOtherAccount">
                    <el-input v-model="addData.FOtherAccount"></el-input>
                </el-form-item>
                <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                    <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="管理角色" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                    <el-option v-for="(item,i) in userType" :key="i" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.FUserType == 5" label="监管单位" prop="RegulatoryID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addData.RegulatoryID" >
                        <el-option v-for="item in regulatoryList" :key="item.ID" :value="item.ID" :label="item.Name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="所属集团" prop="BlocID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addData.BlocID" >
                        <el-option v-for="item in blockList" :key="item.BlocID" :value="item.BlocID" :label="item.ShortName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警通知">
                    <el-checkbox-group v-model="noticeList">
                        <el-checkbox label="1">电话</el-checkbox>
                        <el-checkbox label="2">短信</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <template slot="row-operation" slot-scope="scoped">
                    <span title="初始化" @click="resetUser(scoped.row)">初始化</span>
                    <span @click="queryTRoleBloc(scoped.row)">权限</span>
            </template>
        </Table>
        <el-dialog class="zw-dialog role-config" title="权限修改" :visible.sync="show1" append-to-body width="560px">
            <ul class="tab-header clearfix">
                <li class="active l"><div>项目权限</div></li>
                <li class="l"></li>
            </ul>
            <div class="tab-content clearfix">
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
            </div>
            <div slot="footer">
                <el-button class="zw-btn zw-btn-primary" @click="show1 = false">取消</el-button>
                <el-button class="zw-btn zw-btn-primary" @click="UpdateTRoleProject()">确定</el-button>
            </div>
        </el-dialog> 
    </div>
</template>
<script>
import {System} from '@/xiaoFangCloud/request/api.js';
import {treeTransfer} from '@/components/index.js'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'},{id:5,name:'监管单位'}]
import Table from '../layout/table.vue'
const param = {
    PageIndex:1,
    PageSize:1000,
    SearchKey:''
}
export default {
    data(){
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
                    prop: 'FContacts',
                    label: '用户姓名',
                    width:120
                },
                {
                    prop: 'FUserName',
                    label: '用户账号'
                },
                {
                    prop: 'FTelephone',
                    label: '手机号码'
                },
                {
                    prop: 'FOtherAccount',
                    label: '第三方账号',
                },
                {
                    prop: 'RoleName',
                    label: '功能角色'
                },
                {
                    prop: 'RBName',
                    label: '所属集团/监管单位',
                },
            ],
            roleList:[],
            userType:userType.slice(sessionStorage.getItem('FUserType')),
            defaultData:{
                FUserName:'',
                FUserNickname:'',
                FUserType:4,
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FIdentityID:'',
                FGender:null,
                FIsOwners:0,
                FRoleGUID:'',
                FGUID:'00000000-0000-0000-0000-000000000000',
                FDescribe:'',
                FOtherAccount:'',
                RegulatoryID:'',
                BlocID:'',
                FNotice:''
            },
            addData:{
            },
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            show1:false,
            projectList:[],
            defaultProps1:{
                children: 'Data',
                label: 'Name'
            },
            defaultCheckProject: [], //已有权限的项目
            blockList:[],
            regulatoryList:[],
            noticeList:['1','2'],
        }
    },
    components:{
        treeTransfer,
        Table
    },
    created(){

    },
    mounted(){
        this.queryRole()
        this.queryTORGGroupList()
        this.queryPageURegulatory()
        /* this.queryProject() */
    },
    methods:{
        /**
         * 分页查询用户
         */
        queryData(data){
            return System({
                FAction:'QueryPageTUsers',
                ...data
            })
        },
        queryRole(){
            System({
                FRouteName:'System',
                FAction:'QueryPageTRole',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.roleList = data.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * —查询集团列表
         */
        queryTORGGroupList(){
           System({
               FAction:'QueryPageUBloc',
               ...param
           })
            .then((result) => {
                this.blockList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 查询监管单位
         */
        queryPageURegulatory(){
            System({
               FAction:'QueryPageURegulatory',
               ...param
            })
            .then((result) => {
                this.regulatoryList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 获取项目列表
         */
        queryProject(){
            System({
                FAction:'QuerUsersProject'
            })
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = {...this.defaultData}
        },
        /**
         * 编辑用户
         */
        editItem(item){
            this.addData = {...this.defaultData}
            for(let key in this.addData){
                this.addData[key] = item [key]?item [key]:''
            }
        },
        /**
         * 新增或修改账户
         */
        async addOrUpdate(){
            this.addData.FUserNickname =  this.addData.FContacts
            this.addData.FNotice = this.noticeList.join('')
            return System({
                FAction:'AddOrUpdateTUsers',
                RoleID:this.addData.FRoleGUID,
                ProjectIDStr:"",
                tUsers:this.addData
            },true)
        },
        /**
         * 初始化
         */
        async resetUser(row){
            await new Promise((resolve,reject) => {
                this.$confirm(`确定要初始化？, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                      resolve()
                  }).catch(() => {
                      reject()
                  });
            })
            System({
                FAction:'InitializePassword',
                FType:0,
                FGuid:row.FGUID,
            })
            .then((data) => {
                this.$message({
                    type:'success',
                    message:'初始化成功'
                })
            }).catch((err) => {
                
            });
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
         * 查询项目权限
         */
        queryTRoleBloc(row){
            this.user = row
            this.show1 = true
            System({
                FAction:'QueryTRoleBloc',
                FGUID:this.user.FGUID,
            })
            .then((data) => {
                this.projectList = data.FObject||[]
                this.defaultCheckProject = this.findExist(this.projectList,'Data','ProjectID')
                this.$nextTick(() => {
                    this.$refs.transfer1.$refs.tree1.filter()
                })
            }).catch((err) => {
                
            });
        },
                /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.IsExist == 1
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
         * 修改项目权限
         */
        UpdateTRoleProject(){
            let projectArr = this.findTree(this.projectList, 'Data', 'ProjectID')
            System({
                FAction: 'UpdateTUserProject',
                UserGUID:this.user.FGUID,
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
         * 删除用户
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteTUsers',
                UserID:row.FGUID
            })
        }
    }
}
</script>
<style lang="scss">
.user{
    ul.tab-header{
        width: 290px;
        height: 62px;
        box-sizing: border-box;
        line-height: 62px;
        margin: 20px auto;
        font-size:22px;
        li{
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            cursor: pointer;
            border:1px solid rgba(95, 205, 242, 1);
        }
        li:first-of-type{
            border-right: none;
            border-radius: 29px 0 0 29px;
        }
        li:last-of-type{
            border-left: none;
            border-radius: 0 29px 29px 0;
        }
        li.active{
            background:linear-gradient(94deg,rgba(26,85,149,1),rgba(17,136,175,1),rgba(26,85,149,1));
        }
    }
}
</style>