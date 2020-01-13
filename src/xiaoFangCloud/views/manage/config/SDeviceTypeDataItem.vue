<template>
    <div class="report">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          dialogWidth="740px"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addInfo" label-width="120px" inline ref="form">
                <el-form-item label="设备类型" prop="DeviceTypeID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.DeviceTypeID" rules="[{ required: true, message: '请选择'}]">
                        <el-option v-for="(item,i) in deviceTypeList" :key="i" :label="item.DeviceTypeName" :value="item.DeviceTypeID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" :rules="[{ required: true, message: '请选择'}]">
                   <el-select v-model="dataItem" value-key="DataItemID" @change="addInfo.DataItemID = dataItem.DataItemID">
                       <el-option v-for="(item,i) in dataItemList" :key="i" :label="item.DataItemName" :value="item"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="数据组名称" prop="DataGroupText">
                    <el-input  v-model="addInfo.DataGroupText"></el-input>
                </el-form-item>
                <el-form-item label="0值状态" prop="ZeroShowText">
                    <el-input v-model="addInfo.ZeroShowText"></el-input>
                </el-form-item>
                <el-form-item label="1值状态" prop="OneShowText">
                    <el-input  v-model="addInfo.OneShowText"></el-input>
                </el-form-item>
                <el-form-item label="展示位置" prop="ShowPosition">
                    <el-input  v-model="addInfo.ShowPosition"></el-input>
                </el-form-item>
                <el-form-item label="是否检查" prop="IsInspection">
                    <el-select v-model="addInfo.IsInspection">
                        <el-option  label="是" :value="true"></el-option>
                        <el-option  label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </Table> 
    </div>
</template>
<script>
import {System,Device} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'DeviceTypeName',
                    label:'设备类型'
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'DataGroupText',
                    label: '数据组名称',
                },
                {
                    prop: 'ZeroShowText',
                    label: '0值状态',
                },
                {
                    prop: 'OneShowText',
                    label: '1值状态',
                },
                {
                    prop: 'ShowPosition',
                    label: '展示位置',
                },
                {
                    prop: 'IsInspection',
                    label: '是否检查',
                    formatter:row => row.IsInspection?'是':'否'
                }
            ],
            defaultAddInfo:{//新增项目参数默认数据
                ID:'',
                DeviceTypeID:'',
                DataItemID:'',
                DataItemName:'',
                OneShowText:'',
                ZeroShowText:'',
                DataGroupText:'',
                ShowPosition:0,
                IsInspection:true
            },
            addInfo:{ //新增或修改项目参数
            },
            deviceTypeList:[],
            dataItemList:[],
            dataItem:null
        }
    },
    computed:{
    },
    created(){
        this.queryDeviceType()
        this.querySDataItemList()
    },
    methods:{
        /**
         * 269.分页查询系统分类
         */
        queryData(data){
            return System({
                FAction:'QueryPageSDeviceTypeDataItem',
                ...data
            })
        },
        /**
         * 241.获取设备类型
         */
        queryDeviceType(){
            Device({
                FAction:'QuerySDeviceType',
            })
            .then((result) => {
                this.deviceTypeList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 67.获取所有数据标识
         */
        querySDataItemList(){
            System({
                FAction:'QuerySDataItem'
            })
            .then((result) => {
                this.dataItemList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
            this.dataItem = null
        },
        /**
         * 修改系统分类
         */
        editItem(row) {
            this.beforeAdd()
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.dataItem = {
                DataItemID:row.DataItemID,
                DataItemName:row.DataItemName
            }
        },
        /**
         * 265.新增/修改
         */
        async addOrUpdate(){
            this.addInfo.DataItemID = this.dataItem.DataItemID
            this.addInfo.DataItemName = this.dataItem.DataItemName
            return System({
                FAction:'AddOrUpdateSDeviceTypeDataItem',
                sDeviceTypeDataItem:this.addInfo
            },true)
        },
        /**
         * 268.删除
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSDeviceTypeDataItem',
                ID:row.ID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSDeviceType',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
