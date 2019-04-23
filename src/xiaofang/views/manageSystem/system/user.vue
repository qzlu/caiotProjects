<template>
    <div class="report">
        <el-dialog  :title="type?'编辑':'新增'" :visible.sync="show" append-to-body width="695px" class="zw-dialog">
            <el-form :model='addData' ref='form' inline>
                <el-form-item label="账号" prop="FUserName" :rules="FUserName">
                    <el-input v-model="addData.FUserName"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                    <el-input v-model="addData.FContacts"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephone">
                    <el-input v-model="addData.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                    <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="管理角色" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                    <el-option key="1" label="运营管理" :value="1"></el-option>
                    <el-option key="2" label="集团管理" :value="2"></el-option>
                    <el-option key="3" label="项目管理" :value="3"></el-option>
                    <el-option key="4" label="项目现场运维" :value="4"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>       
        <div>
            <div class="table-header"></div>
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
                            <span @click="update(scoped.row)" title="编辑"><i class="el-icon-document"></i></span>
                            <span @click="deleteUser(scoped.row)"><i class="el-icon-delete"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop: 'FUserNickname',
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
                    formatter:(row) => row.AlarmDateTime.replace(/T/ig,' ')
                }
            ],
            defaultData:{
                FUserName:'',
                FUserNickname:'',
                FUserType:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FIdentityID:'',
                FGender:1,
                FIsOwners:0,
                FRoleGUID:'',
                FGUID:'00000000-0000-0000-0000-000000000000'
            },
            addData:{
                FUserName:'',
                FUserNickname:'',
                FUserType:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FIMG:'',
                FIdentityID:'',
                FGender:1,
                FIsOwners:0,
                FRoleGUID:'',
                FGUID:'00000000-0000-0000-0000-000000000000'
            }
        }
    },
    created(){

    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    mounted(){
        this.queryData()
    },
    methods:{
        /**
         * 分页查询账户
         */
        queryData(){
            this.socket({
                FRouteName:'System',
                FAction:'QueryPageTUsers',
                SearchKey:this.filterText,
                FIsOwners:0,
                PageIndex:this.pageIndex,
                PageSize:10
            },this.handleData)
        },
        handleData(data){
            console.log(data);
            this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
            this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            /**
             * 删除操作时，当前页面无数据时跳到上一页
             */
            if(this.tableData.length === 0&&this.pageIndex > 1){
                --this.pageIndex
                this.queryData()
            }
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
         * 增删改时处理数据
         */
        handleData1(data){
            console.log(data);
        },
        /**
         * 新增或修改账户
         */
        addOrUpdate(){
            this.socket({
                FRouteName:'System',
                FAction:'AddTUsers',
                FType:this.type,
                mTUsers:this.addData
            },this.handleData1)
        },
        /**
         * 删除用户
         */
        async deleteUser(row){
            await this.beforeDelete()
            this.socket({
                FRouteName:'System',
                FAction:'DeleteTUsers',
                IDStr:row.Guid
            },this.handleData1)
        }
    }
}
</script>
<style lang="scss">
</style>