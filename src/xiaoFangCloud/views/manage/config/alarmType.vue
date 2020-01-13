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
            <el-form slot="dialog" :model="addInfo" inline ref="form">
                <el-form-item label="告警类型" prop="AlarmTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.AlarmTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="告警级别" prop="AlarmLevel">
                  <el-select v-model="addInfo.AlarmLevel" filterable placeholder="请选择">
                    <el-option label="提示"  :value="1"></el-option>
                    <el-option label="一般"  :value="2"></el-option>
                    <el-option label="严重"  :value="3"></el-option>
                  </el-select>                
                </el-form-item>
                <el-form-item label="告警种类" prop="AlarmKind">
                  <el-select v-model="addInfo.AlarmKind" filterable placeholder="请选择">
                    <el-option label="预警"  :value="1"></el-option>
                    <el-option label="火警"  :value="2"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../layout/table.vue'
import {System} from '@/xiaoFangCloud/request/api.js';
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'AlarmTypeName',
                    label:'告警类型',
                },
                {
                    prop: 'AlarmLevel',
                    label: '告警级别',
                    formatter:row => this.alarmLevel[row.AlarmLevel]
                },
                {
                    prop: 'AlarmKind',
                    label: '告警种类',
                    formatter:row => row.AlarmKind==1?'预警':'火警'
                },
            ],
            alarmLevel: ['', '提示', '一般', '严重'],
            type:0,
            defaultAddInfo:{//新增参数默认数据
                AlarmTypeID:0,
                AlarmTypeName:null,
                AlarmLevel:null,
                AlarmKind:null,
            },
            addInfo:{ //新增或修改参数
            },
    
        }
    },
    computed:{
    },
    created(){
    },
    methods:{
        /**
         * 通用配置-分页查询告警类型
         */
        queryData(data){
            return System({
                FAction:'QueryPageSAlarmType',
                ...data
            })
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
            this.beforeAdd()
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 335 通用配置-新增/修改告警类型
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSAlarmType',
                sAlarmType:this.addInfo
            },true)
        },
        /**
         * 336.标准配置-删除数据标识
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSAlarmType',
                ID:row.AlarmTypeID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSAlarmType',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
