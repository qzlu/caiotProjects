<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="650px" class="zw-dialog">
            <el-form :model="addConfig" ref="form" inline>
                <el-form-item label="设备名称"  prop='DeviceID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="device" v-if='title ==="新增"' value-key="DeviceID" filterable  placeholder="请选择" @change="selectDevice">
                    <el-option v-for="device in deviceList" :key="device.DeviceID" :label="device.DeviceName" :value="device"></el-option>
                  </el-select>
                  <span v-else>{{device.DeviceName}}</span>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.DataItemID" filterable  placeholder="请选择">
                    <el-option v-for="item in device.mDeviceDataItems?device.mDeviceDataItems:[]" :key="item.DataItemID" :label="item.DataItemName" :value="item.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型" prop="AlarmType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.AlarmType" filterable   placeholder="请选择">
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
                    <span class="limit-value">限制值</span>
                </el-form-item>
                <el-form-item label="持续时长" prop="Duration" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addConfig.Duration">
                        <i slot="suffix" class="unit">S</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="IsEnable">
                    <el-switch v-model="addConfig.IsEnable"></el-switch>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdateUAlarmSet">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
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
                @selection-change="handleSelectionChange"
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
import table from '@/caiot/mixins/table' //表格混入数据
import {Alarm,Device,system} from '@/caiot/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
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
                AlarmType:null,
                Duration:null,
                TriggerType:null,
                LimitValue:0,
                IsEnable:true,
                IDStr:null
            },
            addConfig:{ //新增或修改配置参数
                DeviceID:null,
                DataItemID:null,
                AlarmType:null,
                Duration:null,
                TriggerType:null,
                LimitValue:0,
                IsEnable:true,
                IDStr:null
            },
            device:{},//所选设备
            title:'新增',
            show:false,
            deviceList:[],
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
        this.queryDeviceAndDataItem()
        this.querySystemAlarmType()
    },
    methods:{
        /**
         * 251.查询设备报警配置列表
         */
        queryData(){
            Alarm({
                FAction:'QueryUAlarmSet',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
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
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 252.查询设备及设备相关数据项数据
         */
        queryDeviceAndDataItem(){
            Device({
                FAction:'QueryDeviceAndDataItem',
            })
            .then((data) => {
                this.deviceList = data.FObject
                let device = this.deviceList.find(item => item.name)
            }).catch((err) => {
                
            });
        },
        /**
         * 21.获取告警类型
         */
        querySystemAlarmType(){
            system({
                FAction:'QuerySystemAlarmType'
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
        updatedSet(row) {
            this.show = true
            this.title = '编辑'
            Object.keys(this.addConfig).forEach(key => {
                this.addConfig[key] = row[key]
            })
            this.device = this.deviceList.find(item => item.DeviceID === row.DeviceID)
        },
        /**
         * 249.新增或修改设备报警配置
         */
        async addOrUpdateUAlarmSet(){
            this.show = false
            Alarm({
                FAction:'AddOrUpdateUAlarmSet',
                IDStr:this.addConfig.IDStr,
                mUAlarmSet:this.addConfig
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
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除告警配置'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
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
        exportFile(){
            Alarm({
                FAction:'ExportUAlarmSet',
                SearchKey:this.filterText,
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
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
.inspection-item {
    .el-form-item{
        .condition{
            .el-input {
                width: 120px;
                &__inner{
                    width: 120px
                }
            }
        }
        .limit-value{
            display: inline-block;
            padding: 0 4px;
            background: #2a90fb;
            position: relative;
            left: -8px;
            border-radius: 4px;
        }
        .unit{
            display: inline-block;
            padding: 0 20px;
            background: #2a90fb;
            border-radius: 4px;
            position: relative;
            left: 4px;
        }
    }
}
 


</style>
