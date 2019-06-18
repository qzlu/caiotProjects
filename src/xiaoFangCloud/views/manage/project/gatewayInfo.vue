<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" append-to-body width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="网关名称" prop="LDasName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.LDasName">
                    </el-input>
                </el-form-item>
<!--                 <el-form-item label="网关ID" prop="LDasID" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" placeholder="网关ID只能输入数字" v-model="addInfo.LDasID">
                    </el-input>
                </el-form-item> -->
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
            <div slot="footer">
                <el-button @click="addOrUpdateULdas()">确定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </div>
        </el-dialog>    
        <ul class="operation clearfix">
            <li class="l"><el-button  @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div class="zw-table">
            <el-table
               :data="tableData"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :width="item.width"
                 :label="item.label"
                 :sortable="item.sortble"
                 :formatter="item.formatter"
                 show-overflow-tooltip
                >
               </el-table-column>
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
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteULdas(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table' //表格混入数据
import {Project,System} from '@/xiaoFangCloud/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowIndex',
                    label: '序号',
                    width:80
                },
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
    computed:{
        projectList(){
            return this.$store.state.projectList
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
    },
    methods:{
        /**
         * 269.分页查询网关列表
         */
        queryData(){
            Project({
                FAction:'QueryPageULdas',
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
            })
            .catch((err) => {
                
            });
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
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 265.新增/修改网关
         */
        async addOrUpdateULdas(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            this.addInfo.IsEnable = Number(this.addInfo.IsEnable)
            Project({
                FAction:'AddOrUpdateULdas',
                uLdas:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除网关
         */
        async deleteULdas(row){
            await this.beforeDelete()
            Project({
                FAction:'DeleteULdas',
                ID:row.LDasID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
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
            Project({
                FAction:'ExportExcelULdas',
                SearchKey:this.filterText,
            })
            .then(data => {
                this.downloadFile(data)
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '导出失败!请重试'
                });
            })
        },
    }
}
</script>
<style lang="scss">


</style>
