<template>
    <div class="height-100">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form">
                <el-form-item label="设备名称"  prop='DeviceID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="device"  value-key="DeviceTypeID" filterable  placeholder="请选择">
                    <el-option v-for="item in deviceTypeList" :key="item.DeviceTypeID" :label="item.DeviceTypeName" :value="item"></el-option>
                  </el-select>
                 <!--  <span v-else>{{device.DeviceName}}</span> -->
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.DataItemID" filterable  placeholder="请选择">
                    <el-option v-for="item in device.mDeviceDataItems?device.mDeviceDataItems:[]" :key="item.DataItemID" :label="item.DataItemName" :value="item.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型" prop="AlarmType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.AlarmType" filterable   placeholder="请选择">
                    <el-option v-for="type in alarmTypeList" :key="type.AlarmTypeID" :label="type.AlarmTypeName" :value="type.AlarmTypeID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="限制值" prop="LimitValue" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addData.LimitValue"></el-input>
                </el-form-item>
                <el-form-item label="告警条件" prop="TriggerType" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addData.TriggerType" class="condition" filterable   placeholder="请选择">
                        <el-option v-for="(item,index) in type" :key="index" :label="item" :value="index+1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="持续时长" prop="Duration" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="unit" type="number" v-model="addData.Duration">
                        <i slot="suffix">S</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="IsEnable">
                    <el-switch v-model="addData.IsEnable"></el-switch>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../components/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'DeviceName',
                    label:'设备类型'
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型'
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
                }
            ],
            alarmTypeList:[],
            alarmLevel:['','提示','一般','严重'],
            type:['>','<','='],
            deviceTypeList:[],
            device:{},//所选设备
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                DeviceID:null,
                DataItemID:null,
                AlarmType:null,
                Duration:null,
                TriggerType:null,
                LimitValue:0,
                IsEnable:true,
                IDStr:null
            },
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
        this.queryDeviceTypeAndDataItem()
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('/QueryPageUAlarmSet',param,true)
        },
        /**
         * 287.查询设备类型数据标识树状
         */
        queryDeviceTypeAndDataItem(){
            this.$post('/QueryDeviceTypeAndDataItem')
            .then((result) => {
                this.deviceTypeList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 21.获取告警类型
         */
        querySystemAlarmType(){
            let param = {
                PageIndex:1,
                PageSize:1000,
                SearchKey:''
            }
            this.$post('/QueryPageSAlarmType',param)
            .then((data) => {
                this.alarmTypeList = data.FObject
            })
            .catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            this.$post('/AddOrUpdateUAlarmSet',{
                MUAlarmSet:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除告警配置
         */
        deleteItem(item){
            return this.$post('/DeleteUAlarmSet',{IDStr:item.IDStr})
        },
        /**
         * 导出告警配置
         */
        exportFile(that){
            return this.$post('/QueryExportUAlarmSet',{SearchKey:''})
        }
    }
}
</script>