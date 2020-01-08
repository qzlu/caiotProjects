<template>
    <div class="report">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addInfo" inline ref="form">
                <el-form-item label="网关名称" prop="LDasName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.LDasName">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关位置" prop="Position" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Position">
                    </el-input>
                </el-form-item>
                <el-form-item label="ICCID" prop="LDasPhoneNumber">
                    <el-input v-model="addInfo.LDasPhoneNumber">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="IsEnable" :rules="[{ required: true, message: '请输入'}]">
                    <el-switch v-model="addInfo.IsEnable"></el-switch>
                </el-form-item>
            </el-form>
            <el-table-column
              prop="status"
              label="指令是否下发">
            </el-table-column>
            <el-table-column
              prop=""
              width="200"
              label="配置">
              <template slot-scope="scoped">
                  <div class="role-operation">
                     <span class="pointer" @click="createLdasConfig(scoped.row)">生成LDAS</span>
                     <span class="pointer" v-if="scoped.row.ConfigFileAddress !=''&&scoped.row.ConfigFileAddress !=null" @click="sendFile(scoped.row)">下发指令</span>
                     <span style="color:#999;cursor: not-allowed;" v-else>下发指令</span>
                  </div>
              </template>
            </el-table-column>
        </Table>
    </div>
</template>
<script>
import {Project,System} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'LDasID',
                    label: '网关ID',
                },
                {
                    prop: 'LDasPhoneNumber',
                    label: 'ICCID',
                },
                {
                    prop: 'Position',
                    label: '网关位置',
                },
                {
                    prop: 'IsEnable',
                    label: '是否启用',
                    formatter:(row) => row.IsEnable?'是':'否'
                },
            ],
            type:0,
            defaultAddInfo:{//新增项网关信息默认数据
                LDasID:null,
                IsEnable:true,
                LDasName:null,
                Position:null,
                LDasPhoneNumber:null,
                IsOnline:1,
                IsMsgAlerts:1,
                ConfigFileAddress:''
            },
            addInfo:{ //新增或修改网关
                LDasID:null,
                IsEnable:true,
                LDasName:null,
                Position:null,
                LDasPhoneNumber:null,
                IsOnline:1,
                IsMsgAlerts:1,
                ConfigFileAddress:''

            },
            title:'新增',
            show:false,
        }
    },
    components:{
        Table
    },
    computed:{
        projectList(){
            return this.$store.state.projectList
        }
    },
    created(){
    },
    methods:{
        /**
         * 269.分页查询网关列表
         */
        queryData(data){
            return Project({
                FAction:'QueryPageULdas',
                ...data
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改网关
         */
        editItem(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 265.新增/修改网关
         */
        async addOrUpdate(){
            this.addInfo.IsEnable = Number(this.addInfo.IsEnable)
            return Project({
                FAction:'AddOrUpdateULdas',
                uLdas:this.addInfo
            })
        },
        /**
         * 268.删除网关
         */
        async deleteItem(row){
            return Project({
                FAction:'DeleteULdas',
                ID:row.LDasID
            })
        },
        /**
         * 308.创建Ldas配置文件
         */
        createLdasConfig(row){
            Project({
                FAction:'CreateLdasConfig',
                ID:row.LDasID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: 'LDAS生成成功'
                });
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * 309.发送文件命令
         */
        sendFile(row){
            this.$set(row,'status','下发中。。。')
            Project({
                FAction:'SendFile',
                ID:row.LDasID,
                ConfigFileAddress:row.ConfigFileAddress
            })
            .then(data => {
                this.$set(row,'status','成功')
            })
            .catch(err => {
                this.$set(row,'status','失败')
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return Project({
                FAction:'ExportExcelULdas',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">


</style>
