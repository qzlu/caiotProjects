<template>
    <div class="report meter">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
          dialogWidth="740px"
        >
            <el-form slot="dialog" :model="addInfo" inline ref="form" label-width="134px">
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in ldasList" :key="list.LDasID" :label="list.LDasName" :value="list.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.AreaID"  value-key="AreaID" filterable  placeholder="请选择" >
                    <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addInfo.MeterName">
                    </el-input>
                </el-form-item>
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.MeterModelID" filterable>
                        <el-option v-for="(item,index) in meterModel" :key="index" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通信IP地址" prop="Ip" >
                    <el-input v-model="addInfo.Ip">
                    </el-input>
                </el-form-item>
                <el-form-item label="Modbus通讯地址" prop="ModbusAddr" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.ModbusAddr">
                    </el-input>
                </el-form-item>
                <el-form-item label="通信端口" prop="Port">
                    <el-input v-model="addInfo.Port">
                    </el-input>
                </el-form-item>
                <el-form-item label="第三方ID" prop="OtherSourceID">
                    <el-input v-model="addInfo.OtherSourceID">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否为识别ID" prop="IsDISId" >
                    <el-switch v-model="addInfo.IsDISId"></el-switch>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {Project,System,Device} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'MeterName',
                    label: '仪表名称',
                },
                {
                    prop: 'Ip',
                    label: '通讯IP地址',
                },
                {
                    prop: 'ModbusAddr',
                    label: 'Modbus通讯',
                },
                {
                    prop: 'IsDISId',
                    label: '是否为识别ID',
                    formatter:(row, column, cellValue, index) => row.IsDISId?'是':'否'
                },
                {
                    prop: 'Port',
                    label: '通讯端口',
                },
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增仪表信息参数默认数据
                ProjectID:parseInt(localStorage.getItem('projectid')),
                MeterID:0,
                MeterName:null,
                LDasID:null,
                AreaID:null,
                MeterModelID:null,
                Ip:'127.0.0.1',
                Port:0,
                ModbusAddr:null,
                IsDISId:false,
                OtherSourceID:0
            },
            addInfo:{ //新增或修改仪表信息参数
                ProjectID:parseInt(localStorage.getItem('projectid')),
                MeterID:0,
                MeterName:null,
                LDasID:null,
                AreaID:null,
                MeterModelID:null,
                Ip:'127.0.0.1',
                Port:0,
                ModbusAddr:null,
                IsDISId:false,
                OtherSourceID:0
            },
            title:'新增',
            areaList:[],//区域
            ldasList:[], //网关
            meterModel:[],//仪表型号列表
        }
    },
    computed:{
    },
    created(){
        this.queryULdasByProjectID()
        this.queryUAreaList()
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 274.分页查询仪表信息
         */
        queryData(data){
            return Project({
                FAction:'QueryPageUMeter',
                ...data
            })
        },
        /**
         * 根据项目ID获取区域（66.获取所有区域）
         */
        queryUAreaList(){
            this.addInfo.AreaID = null
            this.addInfo.LDasID = null
            this.queryULdasByProjectID()
            return new Promise((resolve,reject) => {
                Project({
                    FAction:'QueryUAreaList',
                })
                .then(data => {
                    this.areaList = data.FObject
                })
                .catch(err => {})
            })
        },
        /**
         * 查询仪表型号
         */
        queryPageSMeterModel(){
            Device({
                FAction:'QuerySMeterModel',
            })
            .then((data) => {
                this.meterModel = data.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 284.获取项目网关信息
         */
        queryULdasByProjectID(){
            Project({
                FAction:'QueryPageULdas',
                PageIndex: 1,
                PageSize:10000,
                SearchKey:''
            })
            .then(data => 
                this.ldasList = data.FObject.Data || []
            )
            .catch(err => {})
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改仪表信息
         */
        editItem(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.addInfo.IsDISId = Boolean(this.addInfo.IsDISId)
        },
        /**
         * 275.新增/修改仪表信息
         */
        addOrUpdate(){
            this.addInfo.IsDISId = Number(this.addInfo.IsDISId)
            return Project({
                FAction:'AddOrUpdateUMeter',
                uMeter:this.addInfo
            })
        },
        /**
         * 删除仪表信息
         */
        async deleteItem(row){
            return Project({
                FAction:'DeleteUMeter',
                ID:row.MeterID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return Project({
                FAction:'ExportExcelUMeter',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
