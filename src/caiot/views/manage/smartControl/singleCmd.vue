<template>
    <div class="report inspection-item ">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="140px">
                <el-form-item label="指令全称" prop="CMDName"  :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.CMDName">
                    </el-input>
                </el-form-item>
                <el-form-item label="指令简称" prop="CMDShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.CMDShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="指令模式" prop="CMDMode" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.CMDMode"  placeholder="请选择" >
                    <el-option  label="开关" :value="1"></el-option>
                    <el-option  label="遥控" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop="DeviceID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DeviceID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list.DeviceID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.MeterID"  filterable placeholder="请选择">
                    <el-option v-for="item in meterList" :key="item.MeterID" :label="item.MeterName" :value="item.MeterID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="寄存器仪表型号" prop="RegMeterModelID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.RegMeterModelID"  filterable placeholder="请选择">
                    <el-option v-for="item in regMeterModelList" :key="item.RegMeterModelID" :label="item.VarName" :value="item.RegMeterModelID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="遥调单位" prop="Unit">
                    <el-input v-model="addInfo.Unit">
                    </el-input>
                </el-form-item>
                <el-form-item label="写入值" prop="WriteValue">
                    <el-input v-model="addInfo.WriteValue">
                    </el-input>
                </el-form-item>
                <el-form-item label="建立时长" prop="BuiltTime">
                    <el-input type="number" v-model="addInfo.BuiltTime">
                        <i slot="suffix" class="unit">ms</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="指令延迟" prop="Delay">
                    <el-input type="number" v-model="addInfo.Delay">
                        <i slot="suffix" class="unit">ms</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="关系寄存器表达式" >
                    <ul class="express">
                        <li v-for="(item,i) in expressionList" :key="i">
                            <el-select class="condition" v-model="item.Meter" value-key="MeterID"  filterable  placeholder="请选择" @change="selectMeter(i)">
                              <el-option v-for="list in meterList" :key="list.MeterID" :label="list.MeterName" :value="list"></el-option>
                            </el-select>
                            <el-select  class="condition" v-model="item.DataItem"  value-key="DataItemID" filterable  placeholder="请选择">
                              <el-option v-for="list in item.Meter.ListData||[]" :key="list.DataItemID" :label="list.DataItemName" :value="list"></el-option>
                            </el-select>
                        </li>
                        <li class="add">
                           <i class="el-icon-minus" v-if="expressionList.length>1" @click="removeExpress()"></i>
                           <i class="el-icon-plus" @click="addExpress()"></i>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
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
                        <span class="pointer" @click="updatedRow(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
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
import {Control,system,Device} from '@/caiot/request/api.js';
import './condition.scss'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop: 'ProjectName',
                    label:'项目名称'
                },
                {
                    prop:'CMDName',
                    label:'指令全称'
                },
                {
                    prop: 'CMDShortName',
                    label: '指令简称',
                },
                {
                    prop: 'CMDMode',
                    label: '指令模式',
                    formatter:row=>row.CMDMode == 1?'开关':'遥调'
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'MeterName',
                    label: '关联仪表',
                },
                {
                    prop: 'Unit',
                    label: '遥调单位',
                },
                {
                    prop: 'RegMeterModelName',
                    label: '控制名称',
                },
                {
                    prop: 'WriteValue',
                    label: '写入值',
                },
                {
                    prop: 'BuiltTime',
                    label: '建立时长(ms)',
                    width:140
                },
                {
                    prop: 'Delay',
                    label: '指令延迟(ms)',
                    width:140
                }
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                CmdID:0,
                LDasID:1,
                DeviceID:null,
                Delay:0,
                WriteValue:'',
                MeterID:'',
                RegMeterModelID:'',
                Detail:'',
                BuiltTime:0,
                CMDName:'',
                CMDShortName:'',
                Detail:'',
                CMDMode:'',
                Unit:''
            },
            title:'新增',
            show:false,
            regMeterModelList:[], //
            meterList:[], //所有仪表关系
            deviceList:[], //设备列表
            WriteMapTab:null,
            ReadMapTab:null,
            expressItem:{
                DataItem:'',
                Meter:'',
            },
            expressionList:[]

        }
    },
    computed:{
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.defaultAddInfo = JSON.parse(JSON.stringify(this.addInfo))
        this.queryData()
        this.queryUDevice()
        this.queryUMeterList()
        this.queryURegMeterModelList()
    },
    methods:{
        /**
         * 18.管理后台—分页查询寄存器仪表关系映射
         */
        queryData(){
            Control({
                FAction:'QueryPageUBaseCmd',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 || []
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
         * 291.查询所有物联设备列表
         */
        queryUDevice(){
            Device({
                FAction:'QueryUDeviceList',
                FType:1,
                SearchKey:''
            })
            .then(data => {
                this.deviceList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 277.查询仪表列表
         */
        queryUMeterList(){
            Device({
                FAction:'QueryUMeterList',
                SearchKey:''
            })
            .then((result) => {
                this.meterList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 42. 分页查询寄存器仪表型号
         */
        queryURegMeterModelList(){
            Control({
                FAction:'QueryURegMeterModelList',
            })
            .then((data) => {
                this.regMeterModelList = data.FObject || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 仪表选择发生改变
         */
        selectMeter(i){
            this.expressionList[i].DataItem = ''
        },
        addExpress(){
            this.expressionList.push({
                ...this.expressItem
            })
        },
        removeExpress(){
            this.expressionList.pop()
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.WriteMapTab = null
            this.ReadMapTab = null
            this.addInfo = Object.assign({},this.defaultAddInfo)
            this.expressionList = [{...this.expressItem}]
        },
        /**
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            if(!row.RelatedReg){
                this.expressionList = [{...this.expressItem}]
                return
            }
            this.expressionList = row.RelatedReg.split(',').map(item => {
                return {
                    Meter:this.meterList.find(meter => meter.MeterID == item.split('_')[0]),
                    DataItem:{
                        DataItemID:item.split('_')[1]
                    }
                }
            })
        },
        /**
         * 新增/修改
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            let expressionList = []
            this.expressionList.forEach(item => {
                if(item.Meter.MeterID&&item.DataItem.DataItemID){
                    let express = item.Meter.MeterID + '_' +item.DataItem.DataItemID
                    expressionList.push(express)
                }
            })
            this.addInfo.RelatedReg = expressionList.join(',')
            this.show = false
            Control({
                FAction:'AddUpdateUBaseCmd',
                mUBaseCmd:this.addInfo
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除?`])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Control({
                FAction:'DeleteUBaseCmd',
                ID:row.CmdID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        }
    }
}
</script>
<style lang="scss">
</style>
