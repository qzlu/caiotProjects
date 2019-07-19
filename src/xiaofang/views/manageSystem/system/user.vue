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
                <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephoneRule">
                    <el-input v-model="addData.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                    <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="FGender" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FGender"   placeholder="请选择性别">
                    <el-option  label="男" :value="1"></el-option>
                    <el-option  label="女" :value="0"></el-option>
                  </el-select>
                </el-form-item>
<!--                 <el-form-item label="管理角色" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                    <el-option key="1" label="运营管理" :value="1"></el-option>
                    <el-option key="2" label="集团管理" :value="2"></el-option>
                    <el-option key="3" label="项目管理" :value="3"></el-option>
                    <el-option key="4" label="项目现场运维" :value="4"></el-option>
                  </el-select>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <ul class="tab-header">
            <li :class="['l',{active:activeIndex ==1}]" @click="activeIndex = 1">物业账号</li>
            <li :class="['l',{active:activeIndex ==2}]" @click="activeIndex = 2">户主账号</li>
        </ul>
        <div class="tab-content" v-show="activeIndex ==1">
            <ul class="operation clearfix" style="margin-top:20px;margin-bottom:10px;">
                <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
                <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
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
        <div class="tab-content" v-if="activeIndex ==2">
            <ul class="operation clearfix" style="margin-top:20px;margin-bottom:10px;">
                <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
                <li class="r">
                    <el-input class="search-input" placeholder="搜索关键字" v-model="filterText1">
                        <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                </li>
            </ul>       
            <div class="zw-table">
                <el-table
                 :data='tableData1'
                 :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      v-for="item in tableLabel1"
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
                                <span @click="resetUser(scoped.row)"><i class="iconfont icon-ZS-Initialization"></i></span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <zw-pagination @pageIndexChange='handleCurrentChange1' :pageIndex='pageIndex1' :total='total1'></zw-pagination> 
        </div>
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
import {System} from '@/xiaofang/request/api.js';
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
                    prop: 'RowNum',
                    label: '序号'
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
                    prop: 'FTelephone',
                    label: '联系电话'
                },
                {
                    prop: 'FSimpleName',
                    label: '角色'
                },
                {
                    prop: 'LastLoginDate',
                    label: '最近登录时间',
                    width:160,
                    formatter:(row) => row.LastLoginDate != null?row.LastLoginDate.replace(/T/ig,' '):''
                }
            ],
            tableLabel1:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop: 'DoorplateAddress',
                    label: '房间名称',
                    width:260
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
                    prop: 'FTelephone',
                    label: '联系电话'
                },
                {
                    prop: 'FSimpleName',
                    label: '角色'
                },
                {
                    prop: 'LastLoginDate',
                    label: '最近登录时间',
                    width:160,
                    formatter:(row) => row.LastLoginDate != null?row.LastLoginDate.replace(/T/ig,' '):''
                }
            ],
            activeIndex:1,
            tableData1:[],
            roleList:[],
            defaultData:{
                FUserName:'',
                FUserNickname:'',
                FUserType:0,
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FIdentityID:'',
                FGender:null,
                FIsOwners:0,
                FRoleGUID:'',
                FGUID:'00000000-0000-0000-0000-000000000000'
            },
            addData:{
                FUserName:'',
                FUserNickname:'',
                FUserType:0,
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FIdentityID:'',
                FGender:null,
                FIsOwners:0,
                FRoleGUID:'',
                FGUID:'00000000-0000-0000-0000-000000000000'
            },
            total1:0,
            pageIndex1:1,
            filterText1:'',
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
        }
    },
    created(){

    },
    watch:{
        filterText(val){
            this.queryData()
        },
        filterText1(val){
            this.queryData1()
        }
    },
    mounted(){
        this.queryData()
        this.queryData1()
        this.queryRole()
    },
    methods:{
        /**
         * 分页查询账户(物业)
         */
        queryData(){
            System({
                FRouteName:'System',
                FAction:'QueryPageTUsers',
                SearchKey:this.filterText,
                FIsOwners:2,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
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
        /**
         * 分页查询账户(业主)
         */
        queryData1(){
            System({
                FRouteName:'System',
                FAction:'QueryPageTUsers',
                SearchKey:this.filterText1,
                FIsOwners:1,
                PageIndex:this.pageIndex1,
                PageSize:10
            })
            .then((data) => {
                this.total1 = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData1 = data.FObject.Table1 ? data.FObject.Table1 : []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData1.length === 0&&this.pageIndex1 > 1){
                    --this.pageIndex1
                    this.queryData1()
                }
            }).catch((err) => {
                
            });
        },
        handleCurrentChange1(val){
            this.pageIndex1 = val
            this.queryData1()
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
                this.roleList = data.FObject.Table1 ? data.FObject.Table1 : []
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
            System({
                FRouteName:'System',
                FAction:'AddorUpdateTUsers',
                FType:this.type,
                mTUsers:this.addData
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
                FRouteName:'System',
                FAction:'UpdateTUsersPassword',
                FType:0,
                FGuid:row.FGUID,
                FPassword:'',
                NewPassword:'',
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
                FRouteName:'System',
                FAction:'DeleteTUsers',
                IDStr:row.FGUID
            })
            .then((data) => {
                console.log(data);
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
        margin: -10px auto ;
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