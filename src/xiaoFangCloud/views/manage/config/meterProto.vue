<template>
    <div class="report">
        <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.MeterModelID">
                        <el-option v-for="(item,i) in systemModelList" :key="i" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仪表协议名称" prop="MeterModelName">
                    <el-input v-model="addInfo.MeterModelName"></el-input>
                </el-form-item>
                <el-form-item label="指令功能码" prop="FunctionCode">
                    <el-input  v-model="addInfo.FunctionCode"></el-input>
                </el-form-item>
                <el-form-item label="开始读取地址" prop="Beginaddr">
                    <el-input  v-model="addInfo.Beginaddr"></el-input>
                </el-form-item>
                <el-form-item label="读取个数" prop="ReadCount">
                    <el-input v-model="addInfo.ReadCount"></el-input>
                </el-form-item>
            </el-form>
            <div class="submit" slot="footer">
                <el-button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</el-button>
                <el-button @click="show =false">取消</el-button>
            </div>
        </el-dialog>    
        <ul class="operation">
            <li class="l"><el-button  @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div class="zw-table">
            <div class="test"></div>
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
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
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
                    prop:'ProtocolID',
                    label:'仪表协议ID'
                },
                {
                    prop:'MeterModelName',
                    label:'仪表协议名称'
                },
                {
                    prop: 'FunctionCode',
                    label: '指令功能码',
                },
                {
                    prop: 'Beginaddr',
                    label: '开始读取地址',
                },
                {
                    prop: 'ReadCount',
                    label: '读取个数',
                },
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                ProtocolID:0,
                FunctionCode:null,
                Beginaddr:null,
                ReadCount:null,
                MeterModelID:null,
                MeterModelName:null
            },
            addInfo:{ //新增或修改项目参数
                ProtocolID:0,
                FunctionCode:null,
                Beginaddr:null,
                ReadCount:null,
                MeterModelID:null,
                MeterModelName:null
            },
            title:'新增',
            show:false,
            systemModelList:[]
    
        }
    },
    computed:{
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 316.标准配置-分页查询仪表协议
         */
        queryData(){
            System({
                FAction:'QueryPageSProtocol',
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
         * 340.标准配置-分页查询仪表型号
         */
        queryPageSMeterModel(){
            System({
                FAction:'QueryPageSMeterModel',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.systemModelList = data.FObject.Data || []
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
         * 编辑
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 317.标准配置-新增/修改仪表协议
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            System({
                FAction:'AddOrUpdateSProtocol',
                sProtocol:this.addInfo
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 319.标准配置-删除仪表协议
         */
        async deleteItem(row){
            await this.beforeDelete()
            System({
                FAction:'DeleteSProtocol',
                ID:row.ProtocolID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            System({
                FAction:'ExportSProtocol',
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
