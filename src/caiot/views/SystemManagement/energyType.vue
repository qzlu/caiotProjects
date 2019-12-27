<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="能源类型" prop="FName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.FName">
                    </el-input>
                </el-form-item>
                <el-form-item label="单位" prop="FUnit">
                    <el-input v-model="addInfo.FUnit">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdate">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
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
import table from '@/caiot/mixins/table' //表格混入数据
import {project,Energy} from '@/caiot/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop:'ID',
                    label:'能源类型ID'
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能源类型名称',
                },
                {
                    prop: 'EnergyTypeUnit',
                    label: '单位',
                }
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                ID:0,
                FName:null,
                FUnit:null,
            },
            addInfo:{ //新增或修改项目参数
                ID:0,
                FName:null,
                FUnit:null,
            },
            title:'新增',
            show:false,
    
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
         * 310.分页查询能源类型
         */
        queryData(){
            Energy({
                FAction:'QueryPageSEnergyType',
                SearchKey:this.filterText,
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
            })
            .catch((err) => {
                
            });
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
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
            this.addInfo.ID = row.ID
            this.addInfo.FName = row.EnergyTypeName
            this.addInfo.FUnit = row.EnergyTypeUnit
        },
        /**
         * 311.新增/修改能源类型
         */
        async addOrUpdate(){
            this.show = false
            Energy({
                FAction:'AddOrUpdateSEnergyType',
                ID:this.addInfo.ID,
                FName:this.addInfo.FName,
                FUnit:this.addInfo.FUnit,
                FIcon:''
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
         * 268.删除能源类型
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除能源类型'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Energy({
                FAction:'DeleteSEnergyType',
                ID:row.ID
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
            project({
                FAction:'QueryExportULdas',
                SearchKey:this.filterText,
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
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
