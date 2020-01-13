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
                <el-form-item label="设备名称" prop="DeviceID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DeviceID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list.DeviceID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.MeterID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in meterList" :key="list.MeterID" :label="list.MeterName" :value="list.MeterID"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {Project,System,Device,ReportMatter} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'BlocName',
                    label:'集团名称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'MeterName',
                    label: '仪表名称',
                }
            ],
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增仪表信息参数默认数据
                DeviceID:null,
                MeterID:null,
                ID:null,
            },
            addInfo:{ //新增或修改仪表信息参数
            },
            title:'新增',
            show:false,
            meterList:[], //仪表
            deviceList:[] , //设备列表
        }
    },
    computed:{

    },
    created(){
        this.queryUMeterList()
        this.queryUDevice()
    },
    methods:{
        /**
         * 278.分页查询设备仪表
         */
        queryData(data){
            return Project({
                FAction:'QueryPageUDeviceMeter',
                ...data
            })
        },
        /**
         * 291.查询所有物联设备列表
         */
        queryUDevice(){
            Device({
                FAction:'QueryUDeviceList',
            })
            .then(data => {
                this.deviceList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 277.查询仪表列表
         */
        queryUMeterList(){
            Project({
                FAction:'QueryPageUMeter',
                PageIndex:1,
                PageSize:100000,
                SearchKey:''
            })
            .then(data => {
                this.meterList = data.FObject.Data || []
            })
            .catch(err => {

            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
        },
        /**
         * 修改设备仪表
         */
        editItem(row) {
            this.addInfo = {...this.defaultAddInfo}
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 新增/修改设备仪表
         */
        addOrUpdate(){
            return Project({
                FAction:'AddOrUpdateUDeviceMeter',
                DeviceID:this.addInfo.DeviceID,
                uDeviceMeter:this.addInfo
            },true)
        },
        /**
         * 279.删除设备仪表
         */
        async deleteItem(row){
            return Project({
                FAction:'DleteUDeviceMeter',
                ID:row.ID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return Project({
                FAction:'ExportExcelUDeviceMeter',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">

</style>
