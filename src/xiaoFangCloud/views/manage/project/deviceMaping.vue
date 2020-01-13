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
                  <el-select v-model="selectDevice"  value-key="DeviceID" filterable  placeholder="请选择" @change="select">
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DataItemID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in dataItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计算公式" prop="Expression" >
                    <el-input v-model="addInfo.Expression">
                    </el-input>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {Project,System,Device } from '@/xiaoFangCloud/request/api.js';
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
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'Expression',
                    label: '计算公式',
                },
            ],
            type:0,
            defaultAddInfo:{//新增区域映射参数默认数据
                ProjectID:parseInt(sessionStorage.getItem('projectId')),
                DeviceID:null,
                DataItemID:null,
                Expression:null,
                ID:0,
            },
            addInfo:{ //新增或修改区域映射
            },
            title:'新增',
            areaList:[],
            deviceList:[],
            dataItemList:[],
            selectDevice:{},
            meterList:[],
            meterItemList:[],
            meter:{},
            meterDataItemID:null
        }
    },
    computed:{
    },
    watch:{
        meterDataItemID(){
            this.addInfo.Expression =this.meterDataItemID && `[${this.meter.MeterID}_${this.meterDataItemID}]`
        }
    },
    created(){
        this.queryUDevice()
        /* this.queryUMeter() */
    },
    methods:{
        /**
         *287.分页查询设备映射
         */
        queryData(data){
            return Project({
                FAction:'QueryPageUDeviceMapingData',
                ...data
            })
        },
        /**
         * 选择项目（新增弹框）
         */
        selectProject(id){
            this.selectDevice = {}
            this.addInfo.DataItemID = null
            this.queryUDevice(id)
        },
        /**
         * 292.查询所有物联设备列表
         */
        queryUDevice(){
            return new Promise((resolve,reject) => {
                Device({
                    FAction:'QueryUDeviceList',
                    SearchKey:''
                })
                .then(data => {
                    this.deviceList = data.FObject
                    resolve()
                })
                .catch(err => { reject() })
            })
        },
        select(item){
            this.addInfo.DeviceID = item.DeviceID
            this.addInfo.DataItemID = null
            this.querySDataItemsByDeviceTypeID(item.DeviceTypeID)
        },
        /**
         * 103.查询指定设备类型所有的数据项
         */
        querySDataItemsByDeviceTypeID(type){
            return new Promise((resolve,reject) => {
                Device({
                    FAction:'QuerySDataItemList',
                    DeviceTypeID:type
                })
                .then(data => {
                    this.dataItemList = data.FObject || []
                    resolve()
                })
                .catch(err => {reject()})
            })
        },
        /**
         * 查询仪表
         */
        queryUMeter(){
            Project({
                FAction:'QueryPageUMeter',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.meterList = data.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        selectMeter(item){
            this.meter = item
            this.meterItemList = []
            this.meterDataItemID = null
            this.queryProtocolDetailByItem(item.MeterModelID)
        },
        /**
         * 查询仪表数据项
         */
        queryProtocolDetailByItem(id){
            system({
                FAction:'QueryProtocolDetailByItem',
                ID:id
            })
            .then((data) => {
                this.meterItemList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
            this.selectDevice = {}
            this.meter = {}
            this.meterDataItemID = null
        },
        /**
         * 修改设备映射
         */
        async editItem(row) {
            this.beforeAdd()
            await this.queryUDevice()
            await this.querySDataItemsByDeviceTypeID(row.DeviceTypeID)
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.$set(this.selectDevice,'DeviceID',row.DeviceID)
        },
        /**
         * 285.新增/修改设备映射
         */
        addOrUpdate(){
            return Project({
                FAction:'AddOrUPdateUDeviceMapingData',
                uDeviceMapingData:this.addInfo
            },true)
        },

        /**
         * 286.删除设备映射
         */
        async deleteItem(row){
            return Project({
                FAction:'DeleteUDeviceMapingData',
                ID:row.ID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return Project({
                FAction:'ExportExcelUDeviceMapingData',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
