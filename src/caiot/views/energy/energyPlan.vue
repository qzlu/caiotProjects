<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="700px" class="zw-dialog energy-config">
            <el-form :model="addConfig" ref="form" inline="">
                <el-form-item label="计划类型"  prop='EnergyPlanType'   :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.EnergyPlanType"  placeholder="请选择">
                    <el-option  label="年计划" :value="1"></el-option>
                    <el-option  label="月计划" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划时间" prop="EnergyPlanDate"  :rules="[{ required: true, message: '请选择'}]">
                    <el-date-picker :type='addConfig.EnergyPlanType ==1?"year":"month"' v-model="addConfig.EnergyPlanDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="能源类型" prop="EnergyTypeID"  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.EnergyTypeID" filterable @change="queryEnergyConfigIDByParamID()"  placeholder="请选择">
                    <el-option v-for="item in energyTypeList" :key="item.ID" :label="item.EnergyTypeName" :value="item.ID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划用量" prop="EnergyPlanUsage" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addConfig.EnergyPlanUsage">
                        <i slot="suffix" v-if="addConfig.EnergyTypeID == 1" class="unit">kwh</i>
                        <i slot="suffix" v-else-if="addConfig.EnergyTypeID == 2" class="unit">t</i>
                        <i slot="suffix" v-else-if="addConfig.EnergyTypeID == 3" class="unit">m³</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="预警用量" prop="WarningUsage" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addConfig.WarningUsage">
                        <i slot="suffix" v-if="addConfig.EnergyTypeID == 1" class="unit">kwh</i>
                        <i slot="suffix" v-else-if="addConfig.EnergyTypeID == 2" class="unit">t</i>
                        <i slot="suffix" v-else-if="addConfig.EnergyTypeID == 3" class="unit">m³</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="统计类型" prop="CountType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.CountType" filterable @change="queryEnergyConfigIDByParamID()"   placeholder="请选择">
                    <el-option v-for="(item,i) in countTypeList" :key="i" :label="item" :value="i"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="能源配置" prop="EnergyConfigID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addConfig.EnergyConfigID" filterable   placeholder="请选择">
                    <el-option v-for="(item,i) in energyConfigList" :key="i" :label="item.MeterReadingKindName+'-'+item.CountName" :value="item.EnergyConfigID"></el-option>
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
            <li class="l">
                <el-select v-model="FType" filterable   placeholder="请选择" @change="queryData()">
                  <el-option label="月计划" value="Month"></el-option>
                  <el-option label="年计划" value="Year"></el-option>
                </el-select>
            </li>
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
                 :width="item.width"
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
                    label: '序号',
                    width:80
                },
                {
                    prop:'CountType',
                    label:'统计类型',
                    formatter:row => this.countTypeList[row.CountType]
                },
                {
                    prop:'EnergyPlanType',
                    label:'计划类型',
                    formatter:row => row.EnergyPlanType == 1 ? '年计划':'月计划'
                },
                {
                    prop:'CountName',
                    label:'能源配置',
                    formatter:row => row.MeterReadingKindName + '-' + row.CountName
                },
                {
                    prop: 'EnergyPlanDate',
                    label: '计划时间',
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能源类型'
                },
                {
                    prop: 'EnergyPlanUsage',
                    label: '计划用量'
                },
                {
                    prop: 'WarningUsage',
                    label: '预警用量',
                },
/*                 {
                    prop: 'EnergyCount',
                    label: '实际用量',
                }, */
                {
                    prop:'EnergyTypeUnit',
                    label:'单位'
                }
            ],
            countTypeList:['总能耗','分项能耗','分区域能耗','重点设备'],
            defaultConfig:{//新增配置参数默认数据
                ID:0,
                EnergyTypeID:null,
                EnergyPlanType:1,
                EnergyPlanDate:null,
                EnergyPlanUsage:null,
                WarningUsage:null,
                CountType:null,
                EnergyConfigID:null
            },
            addConfig:{ //新增或修改配置参数
                ID:0,
                EnergyTypeID:null,
                EnergyPlanType:1,
                EnergyPlanDate:null,
                EnergyPlanUsage:null,
                WarningUsage:null,
                CountType:null,
                EnergyConfigID:null
            },
            FType:'Month',
            title:'新增',
            show:false,
            energyTypeList:[],
            energyConfigList:[]
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.querySEnergyType()
    },
    methods:{
        /**
         * 251.查询设备报警配置列表
         */
        queryData(){
            Energy({
                FAction:'QueryPageUEnergyPlan',
                SearchKey:this.filterText,
                FType:this.FType,
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
         * 415.根据项目/统计类型/能源类型查询能源配置
         */
        queryEnergyConfigIDByParamID(){
            Energy({
                FAction:'QueryEnergyConfigIDByParamID',
                CountType:this.addConfig.CountType,
                EnergyTypeID:this.addConfig.EnergyTypeID
            })
            .then((result) => {
                this.energyConfigList = result.FObject
            }).catch((err) => {
                
            });
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
            this.addConfig.ID = row.EnergyPlanID
            console.log(row)
            this.queryEnergyConfigIDByParamID()
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
            this.addConfig.EnergyPlanDate = new Date(this.addConfig.EnergyPlanDate).toLocaleDateString()
            Energy({
                FAction:'AddOrUpdateUEnergyPlan',
                ID:this.addConfig.ID,
                mUEnergyPlan:this.addConfig
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
         * 删除能源计划
         */
        async deleteSet(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除能源计划'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Energy({
                FAction:'DeleteUEnergyPlanByIDs',
                IDStr:row.EnergyPlanID
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
</style>
