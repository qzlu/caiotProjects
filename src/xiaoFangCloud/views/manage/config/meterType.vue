<template>
    <div class="report">
        <Table
          ref="table"
          dialogWidth="400px"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="{}"  inline ref="form">
                <el-form-item label="仪表类型">
                    <el-input v-model="FName">
                    </el-input>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {System} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
/*                 {
                    prop:'MeterTypeID',
                    label:'仪表类型ID'
                }, */
                {
                    prop: 'MeterTypeName',
                    label: '仪表类型名称',
                },
            ],
            ID:0,
            FName:null,
            title:'新增',
    
        }
    },
    computed:{
    },
    created(){
    },
    methods:{
        /**
         * 337.标准配置-分页查询仪表类型
         */
        queryData(data){
            return System({
                FAction:'QueryPageSMeterType',
                ...data
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.FName =null
        },
        /**
         * 编辑
         */
        editItem(row) {
            this.FName = row.MeterTypeName
            this.ID = row.MeterTypeID
        },
        /**
         * 338.标准配置-新增/修改仪表类型
         */
        addOrUpdate(){
            if(this.FName === ''|| this.FName ===null) return
            return System({
                FAction:'AddOrUpdateSMeterType',
                sMeterType:{
                    MeterTypeName:this.FName,
                    MeterTypeID:this.ID||0
                }
            },true)
        },
        /**
         * 268.删除仪表类型
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSMeterType',
                ID:row.MeterTypeID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSMeterType',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
