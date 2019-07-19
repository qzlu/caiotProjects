<template>
    <div class="report">
        <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="720px" class="zw-dialog data-item">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="数据标识" prop="DataItemName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DataItemName">
                    </el-input>
                </el-form-item>
                <el-form-item label="单位" prop="Unit">
                    <el-input v-model="addInfo.Unit"></el-input>
                </el-form-item>
                <el-form-item label="是否状态量" prop="IsStatusItem">
                  <el-select v-model="addInfo.IsStatusItem" filterable placeholder="请选择">
                    <el-option label="否"  :value="false"></el-option>
                    <el-option label="是"  :value="true"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否累计量" prop="IsSumItem">
                  <el-select v-model="addInfo.IsSumItem" filterable placeholder="请选择">
                    <el-option label="否"  :value="false"></el-option>
                    <el-option label="是"  :value="true"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据存储周期" prop="SaveCycle">
                    <el-input type="number" v-model="addInfo.SaveCycle"></el-input>
                </el-form-item>
                <el-form-item label="保留小数位数" prop="DecimalDigits">
                    <el-input type="number" v-model="addInfo.DecimalDigits"></el-input>
                </el-form-item>
            </el-form>
            <div class="submit" slot="footer">
                <el-button  @click="addOrUpdate()">确定</el-button>
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
import {System} from '@/xiaoFangCloud/request/api.js';
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
                    prop:'DataItemName',
                    label:'数据标识名称'
                },
                {
                    prop: 'Unit',
                    label: '单位',
                },
                {
                    prop: 'IsStatusItem',
                    label: '是否状态量',
                    formatter:row => row.IsStatusItem?'是':'否'
                },
                {
                    prop: 'IsSumItem',
                    label: '是否累量',
                    formatter:row => row.IsSumItem?'是':'否'
                },
                {
                    prop: 'SaveCycle',
                    label: '数据存储周期',
                },
                {
                    prop: 'DecimalDigits',
                    label: '保留小数位数',
                }
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                DataItemID:0,
                DataItemName:null,
                IsSumItem:null,
                IsStatusItem:null,
                Unit:null,
                SaveCycle:null,
                DecimalDigits:null
            },
            addInfo:{ //新增或修改项目参数
                DataItemID:0,
                DataItemName:null,
                IsSumItem:null,
                IsStatusItem:null,
                Unit:null,
                SaveCycle:null,
                DecimalDigits:null
            },
            title:'新增',
    
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
    },
    methods:{
        /**
         * 334.标准配置-分页查询数据标识
         */
        queryData(){
            System({
                FAction:'QueryPageSDataItem',
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
         * 335.标准配置-新增/修改数据标识
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
                FAction:'AddOrUpdateSDataItem',
                sDataItem:this.addInfo
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
         * 336.标准配置-删除数据标识
         */
        async deleteItem(row){
            await this.beforeDelete()
            System({
                FAction:'DeleteSDataItem',
                ID:row.DataItemID
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
                FAction:'ExportSDataItem',
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
.data-item.zw-dialog {
    .el-form-item {
        .el-form-item__label{
            width: 120px
        }
    }
    
}
</style>
