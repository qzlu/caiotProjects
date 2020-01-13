<template>
    <div class="report">
        <Table
          ref="table"
          dialogWidth="720px"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addInfo" label-width="120px" inline ref="form">
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
            },
        }
    },
    computed:{
    },
    created(){
    },
    methods:{
        /**
         * 334.标准配置-分页查询数据标识
         */
        queryData(data){
            return System({
                FAction:'QueryPageSDataItem',
                ...data
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
        },
        /**
         * 编辑
         */
        editItem(row) {
            this.beforeAdd()
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 335.标准配置-新增/修改数据标识
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSDataItem',
                sDataItem:this.addInfo
            },true)
        },
        /**
         * 336.标准配置-删除数据标识
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSDataItem',
                ID:row.DataItemID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSDataItem',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
