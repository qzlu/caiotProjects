<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="426" class="zw-dialog energy-config">
            <el-form :model="addConfig" ref="form">
                <el-form-item label="能源类型" prop="EnergyType" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.EnergyType" filterable  placeholder="请选择">
                    <el-option v-for="item in energyTypeList" :key="item.ID" :label="item.EnergyTypeName" :value="item.ID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抄表类型" prop="MeterReadingKind" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.MeterReadingKind" filterable   placeholder="请选择">
                    <el-option label="物联抄表" :value="1"></el-option>
                    <el-option label="人工抄表" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="统计类型" prop="CountType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.CountType" filterable   placeholder="请选择">
                    <el-option label="总能耗" :value="0"></el-option>
                    <el-option label="分项能耗" :value="1"></el-option>
                    <el-option label="分区域能耗" :value="2"></el-option>
                    <el-option label="重点设备" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="统计名称" prop="CountName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="text" v-model="addConfig.CountName"></el-input>
                </el-form-item>
                <el-form-item label="计算公式"  prop='Expression'   :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.Expression" multiple collapse-tags  value-key="DeviceID" filterable  placeholder="请选择">
                    <el-option v-for="device in deviceList" :key="device.DeviceID" :label="device.DeviceName" :value="device.DeviceID"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdateUSet()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
<!--             <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li> -->
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
import {Energy,Device,system,MeterReading} from '@/caiot/request/api.js';
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
                    prop:'ProjectName',
                    label:'项目名称'
                },
                {
                    prop:'MeterReadingKind',
                    label:'抄表类型',
                    formatter: row => row.MeterReadingKind == 1 ? '物联抄表':'人工抄表'
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能源类型',
                },
                {
                    prop: 'CountTypeName',
                    label: '统计类型'
                },
                {
                    prop: 'CountName',
                    label: '统计名称'
                },
                {
                    prop: 'Expression',
                    label: '计算公式',
                    formatter:(row, column, cellValue, index) => `[${row.Expression}]`
                },
            ],
            defaultConfig:{//新增配置参数默认数据
                ID:0,
                EnergyType:null,
                CountType:null,
                CountName:null,
                Expression:[],
                MeterReadingKind:null,
            },
            addConfig:{ //新增或修改配置参数
                ID:0,
                EnergyType:null,
                CountType:null,
                CountName:null,
                Expression:[],
                MeterReadingKind:null,
            },
            device:{},//所选设备
            title:'新增',
            show:false,
            deviceList:[],
            energyTypeList:[]
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
        this.querySEnergyType()
    },
    methods:{
        /**
         * 251.查询设备报警配置列表
         */
        queryData(){
            Energy({
                FAction:'QueryPageUEnergyConfig',
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
                FType:1
            })
            .then((data) => {
                this.deviceList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 查询能耗类型
         */
        querySEnergyType(){
            MeterReading({
                FAction:'QuerySEnergyType',
            })
            .then(data => {
                this.energyTypeList = data.FObject
            })
            .catch(error => {

            })
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
            this.addConfig.ID = row.EnergyConfigID
            this.addConfig.Expression = this.addConfig.Expression.split(',').map(item => Number(item))
        },
        /**
         * 249.新增或修改能源配置
         */
        async addOrUpdateUSet(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            this.addConfig.Expression = this.addConfig.Expression.join(',')
            Energy({
                FAction:'AddOrUpdateUEnergyConfig',
                ID:this.addConfig.ID,
                mUEnergyConfig :this.addConfig
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
         * 删除能源配置
         */
        async deleteSet(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除能源配置'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Energy({
                FAction:'DeleteUEnergyConfigByIDs',
                IDStr:row.EnergyConfigID
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
            Energy({
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
.inspection-item{
 .zw-dialog.energy-config{
    .el-form-item .el-input{
        width: 200px;
    }
 }
}



</style>
