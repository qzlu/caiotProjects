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
                <el-form-item label="仪表类型" prop="MeterTypeID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.MeterTypeID">
                        <el-option v-for="(item,i) in systemTypeList" :key="i" :label="item.MeterTypeName" :value="item.MeterTypeID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仪表型号名称" prop="MeterModelName">
                    <el-input v-model="addInfo.MeterModelName"></el-input>
                </el-form-item>
                <el-form-item label="传输方式" prop="TransferID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.TransferID">
                        <el-option v-for="(item,i) in transferList" :key="i" :label="item.Name" :value="item.ID"></el-option>
                    </el-select>
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
        </Table>
    </div>
</template>
<script>
import {System,Project} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'MeterTypeName',
                    label:'仪表类型'
                },
                {
                    prop:'MeterModelName',
                    label:'仪表型号名称'
                },
                {
                    prop: 'Name',
                    label: '传输方式',
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
            defaultAddInfo:{//新增项目参数默认数据
                MeterModelID:0,
                MeterTypeID:'',
                MeterModelName:'',
                Provider:'',
                Contact:'',
                ContactPhone:'',
                WXNum:'',
                TransferID:''
            },
            addInfo:{ //新增或修改项目参数
            },
            systemTypeList:[],
            transferList:[] , //传输方式列表
    
        }
    },
    computed:{
    },
    created(){
        this.queryPageSMeterType()
        this.querySTransfer()
    },
    methods:{
        /**
         * 340.标准配置-分页查询仪表型号
         */
        queryData(data){
            return System({
                FAction:'QueryPageSMeterModel',
                ...data
            })
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
         * 538.查询传输方式列表
         */
        querySTransfer(){
            Project({
                FAction:'QuerySTransfer'
            })
            .then((result) => {
                this.transferList = result.FObject || []
            }).catch((err) => {
                
            });
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
         * 341.标准配置-新增/修改仪表型号
         */
        async addOrUpdate(){
            this.addInfo.WXNum = this.addInfo.ContactPhone
            return System({
                FAction:'AddOrUpdateSMeterModel',
                sMeterModel:this.addInfo
            },true)
        },
        /**
         * 342.标准配置-删除仪表型号
         */
        async deleteItem(row){
            return System({
                FAction:'DdeleteSMeterModel',
                ID:row.MeterModelID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSMeterModel',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">

</style>
