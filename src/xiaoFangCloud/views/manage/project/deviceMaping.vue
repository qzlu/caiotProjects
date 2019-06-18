<template>
    <div class="report device-maping inspection-item">
        <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="750px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
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
                <el-form-item label="仪表" prop="meter">
                  <el-select v-model="meter"  value-key="MeterID" filterable  placeholder="请选择"  @change="selectMeter">
                    <el-option v-for="list in meterList" :key="list.MeterID" :label="list.MeterName" :value="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表数据标识" prop="meter">
                  <el-select v-model="meterDataItemID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in meterItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计算公式" prop="Expression" >
                    <el-input v-model="addInfo.Expression">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button  @click="addOrUpdateUDeviceMapingData()">确定</el-button>
                <el-butto @click="show = false ">取消</el-butto>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><el-button  @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
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
                 :width="item.width"
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
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteUDeviceMapingData(scoped.row)">删除</span>
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
import {Project,System,Device } from '@/xiaoFangCloud/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowIndex',
                    label: '序号',
                    width:80
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
                ProjectID:parseInt(localStorage.getItem('projectid')),
                DeviceID:null,
                DataItemID:null,
                Expression:null,
                ID:0,
            },
            addInfo:{ //新增或修改区域映射
                ProjectID:null,
                DeviceID:null,
                DataItemID:null,
                Expression:null,
                ID:null,
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
        filterText(val){
            this.queryData()
        },
        meterDataItemID(){
            this.addInfo.Expression =this.meterDataItemID && `[${this.meter.MeterID}_${this.meterDataItemID}]`
        }
    },
    created(){
        this.queryData()
        this.queryUDevice()
        this.queryUMeter()
    },
    methods:{
        /**
         *287.分页查询设备映射
         */
        queryData(){
            Device({
                FAction:'QueryPageUDeviceMapingData',
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
        queryUDevice(id = localStorage.getItem('projectid')){
            return new Promise((resolve,reject) => {
                Device({
                    FAction:'QueryUDeviceList',
                    ProjectID:id,
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
                system({
                    FAction:'QuerySDataItemsByDeviceTypeID',
                    DeviceTypeID:type
                })
                .then(data => {
                    this.dataItemList = data.FObject
                    resolve()
                })
                .catch(err => {reject()})
            })
        },
        /**
         * 查询仪表
         */
        queryUMeter(){
            system({
                FAction:'QueryUMeter',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                console.log(data)
                this.meterList = data.FObject.Table1 ? data.FObject.Table1 : []
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
                console.log(data)
                this.meterItemList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
            this.selectDevice = {}
            this.meter = {}
            this.meterDataItemID = null
        },
        /**
         * 修改设备映射
         */
        async updatedProject(row) {
            this.show = true
            this.type = 1
            this.selectDevice = {}
            await this.queryUDevice(row.ProjectID)
            await this.querySDataItemsByDeviceTypeID(row.DeviceTypeID)
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.$set(this.selectDevice,'DeviceID',row.DeviceID)
            this.meter = {}
            this.meterDataItemID = null
        },
        /**
         * 285.新增/修改设备映射
         */
        addOrUpdateUDeviceMapingData(){
            this.show = false
            Device({
                FAction:'AddOrUPdateUDeviceMapingData',
                uDeviceMapingData:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },

        /**
         * 286.删除设备映射
         */
        async deleteUDeviceMapingData(row){
            await this.beforeDelete()
            Project({
                FAction:'DeleteUDeviceMapingData',
                ID:row.ID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Device({
                FAction:'QueryExportUDeviceMapingData',
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
.device-maping.inspection-item{
    .el-form-item{
        .el-form-item__label{
            width: 120px;
        }
    }
}
</style>
