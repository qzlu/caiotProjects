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
          dialogWidth="1090px"
        >
        <template slot="dialog">
            <div>
                <el-form  :model="addInfo" inline ref="form" label-width="134px">
                    <h5>基本信息</h5>
                    <el-form-item label="项目名称">
                        <el-input readonly :value="projectName"></el-input>
                    </el-form-item>
                    <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="meterModelItem" value-key="MeterModelID" filterable @change="addInfo.MeterModelID = meterModelItem.MeterModelID">
                            <el-option v-for="(item,index) in meterModel" :key="index" :label="item.MeterModelName" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仪表类型">
                       <el-input readonly :value="meterModelItem.MeterTypeName"></el-input>
                    </el-form-item>
                    <el-form-item label="传输方式">
                        <el-input readonly :value="meterModelItem.Name">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="标识地址" prop="ModbusAddr">
                        <el-input v-model="addInfo.ModbusAddr" :placeholder="meterModelItem.Prompt">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="是否为识别ID" prop="IsDISId" >
                        <el-switch v-model="addInfo.IsDISId"></el-switch>
                    </el-form-item>
                    <el-form-item label="出厂厂商" prop="Factory">
                        <el-input v-model="addInfo.Factory">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="出厂日期" prop="FactoryDate" >
                        <el-date-picker
                          v-model="addInfo.FactoryDate"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <h5>安装配置</h5>
                    <el-form-item label="网关名称" prop="LDasID">
                      <el-select v-model="addInfo.LDasID"  value-key="" filterable  placeholder="请选择" >
                        <el-option v-for="list in ldasList" :key="list.LDasID" :label="list.LDasName" :value="list.LDasID"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="区域名称" prop="AreaID" >
                      <el-select v-model="addInfo.AreaID"  value-key="AreaID" filterable  placeholder="请选择" >
                        <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="仪表名称" prop="MeterName">
                        <el-input  v-model="addInfo.MeterName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="通信端口" prop="Port">
                        <el-input v-model="addInfo.Port">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="通信地址" prop="Ip" >
                        <el-input v-model="addInfo.Ip">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="第三方ID" prop="OtherSourceID">
                        <el-input v-model="addInfo.OtherSourceID">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="PT" prop="PT">
                        <el-input type="number" v-model="addInfo.PT">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="CT" prop="CT">
                        <el-input type="number" v-model="addInfo.CT">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        </Table>
    </div>
</template>
<script>
import {Project,System,Device} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
import formatDate from '@/utils/formatDate.js'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop: 'BlocName',
                    label: '集团名称',
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop: 'MeterTypeName',
                    label: '仪表类型',
                },
                {
                    prop: 'TransferName',
                    label: '传输方式',
                },
                {
                    prop: 'ModbusAddr',
                    label: '唯一标识',
                },
            ],
            type:0,
            projectName:sessionStorage.getItem('projectName'),
            defaultAddInfo:{//新增仪表信息参数默认数据
                ProjectID:parseInt(sessionStorage.getItem('projectId')),
                MeterID:0,
                MeterName:'',
                LDasID:'',
                AreaID:'',
                MeterModelID:'',
                Ip:'127.0.0.1',
                Port:0,
                ModbusAddr:'',
                IsDISId:false,
                OtherSourceID:0,
                FactoryDate:new Date(),
                Factory:'',
                CT:'',
                PT:''
            },
            addInfo:{ //新增或修改仪表信息参数
            },
            title:'新增',
            areaList:[],//区域
            ldasList:[], //网关
            meterModel:[],//仪表型号列表
            meterModelItem:{} //选中的仪表型号
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
            this.addInfo = {...this.defaultAddInfo}
            this.meterModelItem = {}
        },
        /**
         * 修改仪表信息
         */
        editItem(row) {
            this.addInfo = {...this.defaultAddInfo}
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.addInfo.IsDISId = Boolean(this.addInfo.IsDISId)
            this.addInfo.FactoryDate = new Date(this.addInfo.FactoryDate)
            this.meterModelItem = this.meterModel.find(item => item.MeterModelID == row.MeterModelID)
        },
        /**
         * 275.新增/修改仪表信息
         */
        addOrUpdate(){
            this.addInfo.IsDISId = Number(this.addInfo.IsDISId)
            this.addInfo.FactoryDate = formatDate(this.addInfo.FactoryDate,'YYYY-MM-DD')
            return Project({
                FAction:'AddOrUpdateUMeter',
                uMeter:this.addInfo
            },true)
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
