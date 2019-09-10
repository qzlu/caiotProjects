<template>
    <div class="report user">
        <el-dialog  :title="type?'编辑':'新增'" :visible.sync="show" append-to-body width="695px" class="zw-dialog">
            <el-form :model='addData' ref='form' inline>
                <el-form-item label="用户名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                    <el-input v-model="addData.FContacts"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="FUserName" :rules="[{ required: true, message: '请输入账号'}]">
                    <el-input v-model="addData.FUserName"></el-input>
                </el-form-item>
                <el-form-item label="第三方账号" prop="FOtherAccount">
                    <el-input v-model="addData.FOtherAccount"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephoneRule">
                    <el-input v-model="addData.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                    <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                  </el-select>
                </el-form-item>
<!--                 <el-form-item label="性别" prop="FGender" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FGender"   placeholder="请选择性别">
                    <el-option  label="男" :value="1"></el-option>
                    <el-option  label="女" :value="0"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item v-if="!type" label="管理角色" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                    <el-option v-for="(item,i) in userType" :key="i" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="tab-content">
            <ul class="operation clearfix" style="margin-top:20px;margin-bottom:10px;">
                <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i>新增</el-button></li>
                <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i>导出</el-button></li>
                <li class="r">
                    <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                        <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                </li>
            </ul>       
            <div class="zw-table">
                <el-table
                 :data='tableData'
                 :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      v-for="item in tableLabel"
                      show-overflow-tooltip
                      :key="item.prop"
                      :prop="item.prop"
                      :label="item.label"
                      :width="item.width"
                      :formatter="item.formatter"
                     >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                    >
                        <template slot-scope="scoped">
                            <div>
                                <span title="初始化" @click="resetUser(scoped.row)"><i class="iconfont icon-ZS-Initialization"></i></span>
                                <span @click="update(scoped.row)" title="编辑"><i class="el-icon-document"></i></span>
                                <span @click="deleteUser(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
        </div>
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table.js'
import {System} from '@/xiaoFangCloud/request/api.js';
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
export default {
    mixins:[table],
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
                    prop: 'RowIndex',
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
                    prop: 'FSimpleName',
                    label: '所属角色'
                },
                {
                    prop: 'FOtherAccount',
                    label: '第三方账号',
                },
/*                 {
                    prop: 'FCreateUser',
                    label: '创建人',
                }, */
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
                FOtherAccount:''
            },
            addData:{
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
                FOtherAccount:''
            },
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
        }
    },
    created(){

    },
    watch:{
        filterText(val){
            this.queryData()
        },
    },
    mounted(){
        this.queryData()
        this.queryRole()
    },
    methods:{
        /**
         * 分页查询用户
         */
        queryData(){
            System({
                FAction:'QueryPageTUsers',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.FTotalCount || 0
                this.tableData = data.FObject.Data || []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            }).catch((err) => {
                
            });
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
         * 点击新增
         */
        beforeAdd(){
            this.type = 0
            this.show = true,
            this.addData = Object.assign({},this.defaultData)
        },
        /**
         * 编辑用户
         */
        update(item){
            this.show = true
            this.type = 1
            for(let key in this.addData){
                this.addData[key] = item [key]?item [key]:''
            }
        },
        /**
         * 新增或修改账户
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show  = false
            this.addData.FUserNickname =  this.addData.FContacts
            System({
                FAction:'AddOrUpdateTUsers',
                RoleID:this.addData.FRoleGUID,
                tUsers:this.addData
            })
            .then((data) => {
                console.log(data);
                this.queryData()
            }).catch((err) => {
                
            });
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
         * 删除用户
         */
        async deleteUser(row){
            await this.beforeDelete()
            System({
                FAction:'DeleteTUsers',
                UserID:row.FGUID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
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