<template>
    <div class="report  inspection-item" >
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="426" class="zw-dialog">
            <el-form  ref='form' :model="addData">
                <el-form-item label="耗材名称" prop="SuppliesName"   :rules="[{ required: true, message: '请输入耗材名称'}]">
                    <el-input v-model="addData.SuppliesName"></el-input>
                </el-form-item>
                <el-form-item label="型号" prop="SuppliesTypeName" :rules="[{ required: true, message: '请填写型号'}]">
                    <el-input v-model="addData.SuppliesTypeName"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="SuppliesUnit" :rules="[{ required: true, message: '请填写单位'}]">
                    <el-input v-model="addData.SuppliesUnit"> </el-input>
                </el-form-item>
                <el-form-item label="单价" prop="SuppliesPrice" :rules="[{ required: true, message: '请填写单价'}]">
                    <el-input v-model="addData.SuppliesPrice"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="SuppliesBrand" >
                    <el-input v-model="addData.SuppliesBrand"></el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdateUSupplies">确定</button>
            </div>
        </el-dialog>
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
        </ul>
        <div class="zw-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              header-row-class-name="el-table-header"
              :row-class-name="tableRowClassName"
            >
                <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                 :sortable="item.sortble"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="deleteUSupplies(scoped.row)">删除</span>
                        <span class="pointer" @click="updatedSupplies(scoped.row)">编辑</span>
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
import {Supplies} from '@/caiot/request/api.js'//api接口（接口统一管理）;
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
                    prop: 'SuppliesName',
                    label: '耗材名称名称'
                },
                {
                    prop: 'SuppliesTypeName',
                    label: '型号'
                },
                {
                    prop: 'SuppliesUnit',
                    label: '单位'
                },
                {
                    prop: 'SuppliesPrice',
                    label: '单价(元)',
                },
                {
                    prop: 'SuppliesBrand',
                    label: '品牌'
                },
            ],
            show:false,
            type:0,
            defaultAddData:{
                ID:'',
                ProjectID:localStorage.getItem('projectid'),
                SuppliesName:'',
                SuppliesTypeName:'',
                SuppliesUnit:'',
                SuppliesPrice:'',
                SuppliesBrand:''
            },
            addData:{
                ID:'',
                ProjectID:localStorage.getItem('projectid'),
                SuppliesName:'',
                SuppliesTypeName:'',
                SuppliesUnit:'',
                SuppliesPrice:'',
                SuppliesBrand:''
            }
        }
    },
    watch:{

    },
    created(){
        this.queryData()
    },
    mounted(){

    },
    methods:{
        /**
         * 查询耗材库（194.查询分页维护耗材）
         */
        queryData(){
            Supplies({
                FAction:'QueryUSupplies',
                FName:'',
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then((data) => {
                this.total = data.FObject.Table?data.FObject.Table[0].Count:0
                this.tableData = data.FObject.Table1?data.FObject.Table1:[]
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
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 点击新增按钮
         */
        beforeAdd(){
            this.type = 0
            this.addData = Object.assign({},this.defaultAddData)
            this.show = true
        },
        /**
         * 新增或修改耗材
         */
        async addOrUpdateUSupplies(){
            Supplies({
                FAction:this.type?'UpdateUSupplies':'AddUSupplies',
                mUSupplies:this.addData
            })
            .then(data => {
                this.show = false
                this.$message({
                  type: 'success',
                  message: this.type?'修改成功！':'新增成功！'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: error
                });
            })
        },
        /**
         * 编辑耗材
         */
        updatedSupplies(row) {
            this.type = 1
            Object.keys(this.addData).forEach(key => {
                if(row[key]){
                    this.addData[key] = row[key]
                }
            })
            this.show = true
        },
        /**
         * 193.删除维护耗材
         */
        async deleteUSupplies(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除　　${row.SuppliesName}`,'删除耗材'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Supplies({
                FAction:'DeleteUSupplies',
                ID:row.ID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
            })
        }
    }
}
</script>
<style lang="scss">
</style>
