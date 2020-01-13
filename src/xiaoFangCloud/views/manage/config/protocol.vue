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
            <el-form slot='dialog' :model="addInfo" inline ref="form">
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.MeterModelID">
                        <el-option v-for="(item,i) in systemModelList" :key="i" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据顺序" prop="DataSort">
                    <el-input type="number" v-model="addInfo.DataSort"></el-input>
                </el-form-item>
                <el-form-item label="寄存地址" prop="Regaddr">
                    <el-input  v-model="addInfo.Regaddr"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="DataType">
                    <el-select v-model="addInfo.DataType">
                        <el-option v-for="(item,i) in dataTypeList" :key="i" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计算类型" prop="CalType">
                    <el-select v-model="addInfo.CalType">
                        <el-option v-for="(item,i) in calTypeList" :key="i" :label="item" :value="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系数" prop="Factor">
                    <el-input v-model="addInfo.Factor"></el-input>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID">
                   <el-select v-model="addInfo.DataItemID">
                       <el-option v-for="(item,i) in dataItemList" :key="i" :label="item.DataItemName" :value="item.DataItemID"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="是否采集" prop="IsCapture">
                    <el-select v-model="addInfo.IsCapture">
                        <el-option  label="是" :value="1"></el-option>
                        <el-option  label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import {System} from '@/xiaoFangCloud/request/api.js';
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'MeterModelName',
                    label:'仪表型号名称'
                },
                {
                    prop: 'DataSort',
                    label: '数据顺序',
                },
                {
                    prop: 'Regaddr',
                    label: '寄存地址',
                },
                {
                    prop: 'DataType',
                    label: '数据类型',
                },
                {
                    prop: 'CalType',
                    label: '计算类型',
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'IsCapture',
                    label: '是否采集',
                    formatter:row => row.IsCapture?'是':'否'
                },
            ],
            defaultAddInfo:{//新增项目参数默认数据
                ProtocolDetailID:0,
                DataSort:null,
                Regaddr:null,
                DataType:null,
                CalType:null,
                Factor:null,
                MeterModelID:null,
                DataItemID:null,
                DataItemName:'',
                IsCapture:1
            },
            addInfo:{ //新增或修改项目参数
            },
            calTypeList:['无','+','-','*','/','x²','LN(x)','log(x)','位取'],//计算类型
            dataTypeList:[
                {value:0,name:'bit'},
                {value:1,name:'unsigned short'},
                {value:2,name:'short'},
                {value:3,name:'int'},
                {value:4,name:'uint'},
                {value:5,name:'float'},
                {value:6,name:'double'},
                {value:7,name:'long'},
                {value:8,name:'vint'},
                {value:9,name:'vfloat'},
                {value:93,name:'oint'},
                {value:94,name:'ouint'},
                {value:98,name:'ovint'}],
            systemModelList:[],
            dataItemList:[]
    
        }
    },
    computed:{
    },
    created(){
        this.queryPageSMeterModel()
        this.queryPageSDataItem()
    },
    methods:{
        /**
         * 320.标准配置-分页查询协议明细
         */
        queryData(data){
            return System({
                FAction:'QueryPageSProtocolDetail',
                ...data
            })
        },
        /**
         * 340.标准配置-分页查询仪表型号
         */
        queryPageSMeterModel(){
            System({
                FAction:'QueryPageSMeterModel',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.systemModelList = data.FObject.Data || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 335.标准配置-分页查询数据标识
         */
        queryPageSDataItem(){
            System({
                FAction:'QueryPageSDataItem',
                PageIndex:1,
                PageSize:10000,
                SearchKey:''
            })
            .then((data) => {
                this.dataItemList = data.FObject.Data || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
        },
        /**
         * 编辑
         */
        editItem(row) {
            this.addInfo = {...this.defaultAddInfo}
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 321.标准配置-新增/修改仪表协议明细
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSProtocolDetail',
                FType:this.type,
                sProtocolDetail:this.addInfo
            },true)
        },
        /**
         * 322.标准配置-删除协议明细
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSProtocolDetail',
                ID:row.ProtocolDetailID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSProtocolDetail',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">

</style>
