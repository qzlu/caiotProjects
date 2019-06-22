<template>
    <div class="report">
        <el-dialog class="zw-dialog" append-to-body :title="type?'编辑':'新增'" :visible.sync="show" width="700px" >
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="仪表类型" prop="MeterTypeID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.MeterTypeID">
                        <el-option v-for="(item,i) in systemTypeList" :key="i" :label="item.MeterTypeName" :value="item.MeterTypeID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仪表型号名称" prop="MeterModelName">
                    <el-input v-model="addInfo.MeterModelName"></el-input>
                </el-form-item>
                <el-form-item label="供应商名称" prop="Provider">
                    <el-input  v-model="addInfo.Provider"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="Contact">
                    <el-input  v-model="addInfo.Contact"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="ContactPhone">
                    <el-input v-model="addInfo.ContactPhone"></el-input>
                </el-form-item>
            </el-form>
            <div class="submit" slot="footer">
                <el-button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</el-button>
                <el-button @click="show = false">取消</el-button>
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
                    prop:'MeterTypeName',
                    label:'仪表类型'
                },
                {
                    prop:'MeterModelName',
                    label:'仪表型号名称'
                },
                {
                    prop: 'Provider',
                    label: '供应商名称',
                },
                {
                    prop: 'Contact',
                    label: '联系人',
                },
                {
                    prop: 'ContactPhone',
                    label: '联系电话',
                },
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                MeterModelID:0,
                MeterTypeID:null,
                MeterModelName:null,
                Provider:null,
                Contact:null,
                ContactPhone:null,
                WXNum:null
            },
            addInfo:{ //新增或修改项目参数
                MeterModelID:0,
                MeterTypeID:null,
                MeterModelName:null,
                Provider:null,
                Contact:null,
                ContactPhone:null,
                WXNum:null
            },
            title:'新增',
            show:false,
            systemTypeList:[]
    
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
        this.queryPageSMeterType()
    },
    methods:{
        /**
         * 340.标准配置-分页查询仪表型号
         */
        queryData(){
            System({
                FAction:'QueryPageSMeterModel',
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
         * 337.标准配置-分页查询仪表类型
         */
        queryPageSMeterType(){
            System({
                FAction:'QueryPageSMeterType',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.systemTypeList = data.FObject.Data || []
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
         * 341.标准配置-新增/修改仪表型号
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
            this.addInfo.WXNum = this.addInfo.ContactPhone
            System({
                FAction:'AddOrUpdateSMeterModel',
                sMeterModel:this.addInfo
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
         * 342.标准配置-删除仪表型号
         */
        async deleteItem(row){
            await this.beforeDelete()
            System({
                FAction:'DdeleteSMeterModel',
                ID:row.MeterModelID
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
                FAction:'ExportSMeterModel',
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
