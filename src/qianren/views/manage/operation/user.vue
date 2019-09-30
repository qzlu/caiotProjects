<template>
    <div class="height-100">
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
                        <span style="margin-left:10px;">{{addData.FPassword}}</span>
                    </el-form-item>
                    <el-form-item label="用户名" prop="FContacts" :rules="[{ required: true, message: '请输入用户名'}]">
                        <el-input v-model="addData.FContacts"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="FTelephone" :rules="FTelephoneRule">
                        <el-input v-model="addData.FTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="功能角色" prop="FRoleGUID" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="addData.FRoleGUID"   placeholder="请选择角色">
                        <el-option v-for="role in roleList" :key="role.FGUID" :label="role.FName" :value="role.FGUID"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="管理身份" prop="FUserType" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="addData.FUserType"   placeholder="请选择角色">
                        <el-option v-for="(item,i) in userType" :key="i" :value="item.id" :label="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../components/table.vue'
const userType = ['',{id:1,name:'运营管理'},{id:2, name:'集团管理'},{id:3,name:'项目管理'},{id:4,name:'项目现场运维'}]
export default {
    data(){
        return{
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
                    width:400
                },
            ],
            userType:userType.slice(localStorage.getItem('FUserType')),
            roleList:[], //角色
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
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
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
        this.queryRoleData()
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
            return this.$post('/QueryPageTUsers',param,true)
        },
        /**
         * queryRoleData 分页查询查询角色
         * 
         */
        queryRoleData() {
            this.$post('/QueryPageTRole',{
                SearchKey:"",
                PageIndex:1,
                PageSize:1000000
            })
            .then(result => {
                this.roleList = result.FObject.Data || []
            })
            .catch(err => {

            })
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
                this.addData[key] = row[key] || ''
            })
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
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
            return this.$post('/DeleteSSystemParam',{FGUID:item.FGUID})
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