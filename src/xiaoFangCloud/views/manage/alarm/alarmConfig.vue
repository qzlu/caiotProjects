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
          :submitFun="addOrUpdateUAlarmSet"
        >
            <el-form slot="dialog" :model="addConfig" inline ref="form">
                <el-form-item label="设备名称"  prop='DeviceID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="device" v-if='title ==="新增"' value-key="DeviceID" filterable  placeholder="请选择" @change="selectDevice">
                    <el-option v-for="device in deviceList" :key="device.DeviceID" :label="device.DeviceName" :value="device"></el-option>
                  </el-select>
                  <el-input v-else readonly v-model="device.DeviceName">{{device.DeviceName}}</el-input>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.DataItemID" filterable  placeholder="请选择">
                    <el-option v-for="item in addConfig.DeviceID&&dataItemList" :key="item.DataItemID" :label="item.DataItemName" :value="item.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型" prop="AlarmTypeID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.AlarmTypeID" filterable   placeholder="请选择">
                    <el-option v-for="type in alarmTypeList" :key="type.AlarmTypeID" :label="type.AlarmTypeName" :value="type.AlarmTypeID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="限制值" prop="LimitValue" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addConfig.LimitValue"></el-input>
                </el-form-item>
                <el-form-item label="告警条件" prop="TriggerType" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addConfig.TriggerType" class="condition" filterable   placeholder="请选择">
                        <el-option v-for="(item,index) in type" :key="index" :label="item" :value="index+1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="持续时长" prop="Duration" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="unit" type="number" v-model="addConfig.Duration">
                        <span slot="suffix">S</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="IsEnable">
                    <el-switch v-model="addConfig.IsEnable"></el-switch>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {Alarm,Device,System} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'DeviceName',
                    label:'设备名称'
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型名称'
                },
                {
                    prop: 'LimitValue',
                    label: '限制值'
                },
                {
                    prop: 'TriggerType',
                    label: '告警条件',
                    formatter:(row, column, cellValue, index) => this.type[row.TriggerType-1] + row.LimitValue
                },
                {
                    prop: 'Duration',
                    label: '持续时长(s)',
                },
                {
                    prop:'IsEnable',
                    label:'是否启用',
                    formatter:(row, column, cellValue, index) => row.IsEnable?'是':'否'
                },
                {
                    prop:'AlarmLevel',
                    label:'告警级别',
                    formatter:(row, column, cellValue, index) => this.alarmLevel[row.AlarmLevel]
                },
                {
                    prop:'AlarmKind',
                    label:'告警种类',
                    formatter:(row, column, cellValue, index) => row.AlarmKind == 1?'预警':'火警'
                }
            ],
            alarmLevel:['','提示','一般','严重'],
            type:['>','<','='],
            defaultConfig:{//新增配置参数默认数据
                DeviceID:null,
                DataItemID:null,
                AlarmTypeID:null,
                DeviceName:null,
                Duration:null,
                TriggerType:null,
                LimitValue:0,
                IsEnable:true,
                ID:0
            },
            addConfig:{ //新增或修改配置参数
                DeviceID:null,
                DataItemID:null,
                AlarmTypeID:null,
                DeviceName:null,
                Duration:null,
                TriggerType:null,
                LimitValue:0,
                IsEnable:true,
                ID:0
            },
            device:{},//所选设备
            title:'新增',
            deviceList:[],
            dataItemList:[], // 数据项
            alarmTypeList:[]
        }
    },
    components:{
        Table
    },
    created(){
        this.queryUDeviceList()
        this.querySystemAlarmType()
    },
    methods:{
        /**
         * 422.查询设备报警配置列表
         */
        queryData(data){
            return Alarm({
                FAction:'QueryPageUAlarmSet',
                ...data
            })
        },
        /**
         * 403.查询设备
         */
        queryUDeviceList(){
            Device({
                FAction:'QueryUDeviceList',
            })
            .then((data) => {
                this.deviceList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 根据设备类型查询数据项列表
         * @param {*} id 设备类型id
         */
        querySDataItemList(id){
            return new Promise(resolve => {
                Device({
                    FAction:'QuerySDataItemList',
                    DeviceTypeID:id
                })
                .then((data) => {
                    this.dataItemList = data.FObject
                    console.log(data)
                    resolve()
                }).catch((err) => {

                });
            })
        },
        /**
         * 404.获取告警类型
         */
        querySystemAlarmType(){
            Device({
                FAction:'QuerySAlarmTypeList'
            })
            .then((data) => {
                this.alarmTypeList = data.FObject
            })
            .catch((err) => {
                
            });
        },
        /**
         * 选择设备
         */
        selectDevice(){
            this.addConfig.DeviceID = this.device.DeviceID
            this.addConfig.DeviceName = this.device.DeviceName
            this.dataItemList = []
            this.addConfig.DataItemID = null
            this.querySDataItemList(this.device.DeviceTypeID)
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.addConfig = Object.assign({},this.defaultConfig)
            this.device = {}
            this.title = '新增'
        },
        /**
         * 修改配置
         */
        async editItem(row) {
            this.show = true
            this.title = '编辑'
            await this.querySDataItemList(row.DeviceTypeID)
            Object.keys(this.addConfig).forEach(key => {
                this.addConfig[key] = row[key]
            })
            this.device = this.deviceList.find(item => item.DeviceID === row.DeviceID)
        },
        /**
         * 249.新增或修改设备报警配置
         */
        async addOrUpdateUAlarmSet(){
            this.addConfig.IsEnable = Number(this.addConfig.IsEnable)
            return Alarm({
                FAction:'AddOrUpdateUAlarmSet',
                uAlarmSet:this.addConfig
            })
        },
        /**
         * 删除告警配置
         */
        async deleteItem(row){
            return Alarm({
                FAction:'DeleteUAlarmSet',
                ID:row.ID
            })

        },
        /**
         * exportFile 导出
         */
        async exportFile(){
            return Alarm({
                FAction:'ExportExcelUAlarmSet',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">

</style>
