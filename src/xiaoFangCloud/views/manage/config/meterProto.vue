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
            defaultAddInfo:{//新增项目参数默认数据
                ProtocolID:0,
                FunctionCode:null,
                Beginaddr:null,
                ReadCount:null,
                MeterModelID:null,
                MeterModelName:null
            },
            addInfo:{ //新增或修改项目参数
            },
            systemModelList:[]
    
        }
    },
    computed:{
    },
    created(){
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 316.标准配置-分页查询仪表协议
         */
        queryData(data){
            return System({
                FAction:'QueryPageSProtocol',
                ...data
            })
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
         * 317.标准配置-新增/修改仪表协议
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSProtocol',
                sProtocol:this.addInfo
            },true)
        },
        /**
         * 319.标准配置-删除仪表协议
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSProtocol',
                ID:row.ProtocolID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSProtocol',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
