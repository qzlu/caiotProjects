<template>
    <div class="report">
        <el-dialog :title="title" :visible.sync="show" append-to-body width="726px" class="zw-dialog">
            <el-form :model="addConfig" inline ref="form">
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
           <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdateUAlarmSet">确 认</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>    
        <ul class="operation clearfix">
            <li class="l"><el-button @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button class="zw-btn zw-btn-export" @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
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
                        <span class="pointer" @click="updatedSet(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteSet(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table' //表格混入数据
import {Alarm,Device,System} from '@/xiaoFangCloud/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowIndex',
                    label: '序号'
                },
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
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.queryUDeviceList()
        this.querySystemAlarmType()
    },
    methods:{
        /**
         * 422.查询设备报警配置列表
         */
        queryData(){
            Alarm({
                FAction:'QueryPageUAlarmSet',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.FTotalCount || 0
                this.tableData = data.FObject.Data || []
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
         * 403.查询设备
         */
        queryUDeviceList(){
            Device({
                FAction:'QueryUDeviceList',
            })
            .then((data) => {
                this.deviceList = data.FObject
                console.log(data);
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
        async updatedSet(row) {
            this.show = true
            this.title = '编辑'
            console.log(row)
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
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            this.addConfig.IsEnable = Number(this.addConfig.IsEnable)
            Alarm({
                FAction:'AddOrUpdateUAlarmSet',
                uAlarmSet:this.addConfig
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * 删除告警配置
         */
        async deleteSet(row){
            await this.beforeDelete()
            Alarm({
                FAction:'DeleteDeviceAndDataItem',
                IDStr:`${row.ProjectID}_${row.DeviceID}_${row.DataItemID}_${row.AlarmType}`
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(err => {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
            })

        },
        /**
         * exportFile 导出
         */
        async exportFile(){
            Alarm({
                FAction:'ExportExcelUAlarmSet',
                SearchKey:this.filterText,
            })
            .then(data => {
                this.downloadFile(data)
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
