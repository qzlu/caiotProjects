<template>
    <div class="report plan">
        <!-- 新增或编辑抄表计划 弹框-->
        <el-dialog :title="title" :visible.sync="show" :class="{showPointTree:showPointTree,'zw-dialog':true}">
            <div class="clearfix">
                <ul class="l clearfix ">
                    <li>
                        <span class="label">设备名称</span>
                        <el-input v-model="addPlanData.DeviceLedgerName" readonly></el-input>
                    </li>
                    <li>
                        <span class="label">保养等级</span>
                        <el-input v-model="addPlanData.MaintenanceLevelName" readonly></el-input>
                    </li>
                    <li>
                        <span class="label">保养计划名称</span>
                        <el-input v-model="addPlanData.MaintenancePlanName" readonly></el-input>
                    </li>
                    <li class="plan-time">
                        <span class="label">保养计划时间</span>
                        <el-date-picker
                          v-model="planTime"
                          type="datetime"
                          @change="selectPlanTime"
                          placeholder="选择日期时间">
                        </el-date-picker>
                    </li>
                    <li>
                        <span class="label">负责人</span>
                        <el-select v-model="addPlanData.MaintenanceUserGUID" filterable  placeholder="请选择">
                            <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                        </el-select>
                    </li>
                </ul>
            </div>
            <div style="text-align:center;height:42px;margin-top:37px;">
                <button class="zw-btn" @click="updatedPlan(addPlanData)">确定</button>
            </div>
        </el-dialog>
        <ul class="report-header plan-header clearfix"> 
            <!-- <li class="l" @click="beforeAdd()"><button class="zw-btn zw-btn-add">新增</button></li> -->
           <!--  <li class="l"><button class="zw-btn zw-btn-export">导出</button></li> -->
            <li class="l"><button class="zw-btn zw-btn-primary" @click="deletePlans()"><i class="el-icon-delete"></i> 删除</button></li>
            <li class="l select-plan-time">
                <span class="label">生成计划</span>
                <el-date-picker
                  v-model="year"
                  type="year"
                  @change='selectYear'
                  placeholder="选择年">
                </el-date-picker>
            </li>
            <li class="r">
                <el-input class="search-input" v-model="filterText" placeholder="搜索计划关键字">
                     <i class="el-icon-search" slot="suffix"></i>
                </el-input>
<!--                 <el-button type="primary" @click="showFilterBox = !showFilterBox">
                  高级搜索<i class=" el-icon--right" :class="{'el-icon-arrow-down':!showFilterBox,'el-icon-arrow-up':showFilterBox}"></i>
                </el-button> -->
                <transition>
                    <ul class="search-box"  v-if="showFilterBox">
                        <li>
                            <span>计划名称</span>
                            <el-input v-model="filterObj.FName"></el-input>
                        </li>
                        <li>
                            <span>设备名称</span>
                            <el-input v-model="filterObj.FDeviceName"></el-input>
                        </li>
                        <li class="plan-select-time">
                            <span>抄表时间</span>
                            <el-date-picker
                              v-model="time"
                              type="datetimerange"
                              :picker-options="pickerOptions2"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              @change="selectTime"
                              align="right">
                            </el-date-picker>
                        </li>
                        <li >
                            <span>负责人</span>
                            <el-select v-model="filterObj.FUserGuid"  placeholder="请选择">
                                <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>保养周期</span>
                            <el-select v-model="filterObj.MaintenanceCycle"  placeholder="请选择">
                                <el-option v-for="time in timeList" :key="time.value" :label="time.label" :value="time.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <button class="zw-btn zw-btn-primary" @click="queryType = 1;queryData()">查询</button>
                            <button class="zw-btn zw-btn-primary" @click="resetFilter()">重置</button>
                        </li>
                    </ul>
                </transition>
            </li>
            <li  class="r">
                <span class="label">负责人</span>
                <el-select v-model="filterObj.FUserGuid"  placeholder="请选择" @change="queryData()">
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                </el-select>
            </li>
            <li class="r select-month-time">
                <span class="label">月份</span>
                <el-date-picker
                  v-model="month"
                  type="month"
                  @change='queryData()'
                  placeholder="选择月">
                </el-date-picker>
            </li>
        </ul>
        <div class="zw-table plan-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              header-row-class-name="el-table-header"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              @sort-change="sortChange"
            >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                 :sortable="item.sortble"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 show-overflow-tooltip
                 label="负责人">
                 <template slot-scope="scoped">
                    <el-select v-model="scoped.row.MaintenanceUserGUID"  placeholder="请选择" @change="changeUser(scoped.row)">
                        <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                    </el-select>
                 </template>
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="deletePlan(scoped.row.ID)">删除</span>
                        <span class="pointer" @click="changePlan(scoped.row)">编辑</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {system,Maintenance,Inspection} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwTree} from '@/caiot/zw-components/index'
import * as comm from "@/caiot/assets/js/pro_common";
import '../InspectionPlan.scss'
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
                    prop: 'MaintenancePlanName',
                    label: '保养计划名称',
                    sortble:'custom'
                },
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称',
                    sortble:'custom'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型',
                    sortble:'custom'
                },
                {
                    prop: 'MaintenanceLevelName',
                    label: '保养等级',
                    sortble:'custom'
                },
                {
                    prop: 'MaintenanceCycleName',
                    label: '保养周期',
                    sortble:'custom'
                },
                {
                    prop: 'MaintenancePlanDateTime',
                    label: '计划保养时间',
                    sortble:'custom'
                }
            ],
            timeList:[{
                label:'全部',
                value:0
            },
            {
                label:'月度',
                value:2
            },
            {
                label:'年度',
                value:3
            }],
            year:'',
            month:new Date(),
            defaultFilterObj:{
                FName:'',
                FDeviceName:'',
                FUserGuid:'',
                MaintenanceCycle:0,
                StartDateTime:'',
                EndDateTime:''
            },
            filterObj:{ //高级搜索条件
                FName:'',
                FDeviceName:'',
                FUserGuid:'',
                MaintenanceCycle:0,
                StartDateTime:'',
                EndDateTime:''
            },
            time:'',
            planTime:'',
            showFilterBox:false,
            queryType:1,//查询方式，0为普通查询，1为高级搜索
            type:0,//0为新增 1为编辑计划
            show:false, //控制新增或编辑弹框
            title:'新增抄表计划',
            users:[], //所有用户
            roadDatas:[],//所有路线
            showPointTree:false,
            inspectionCycleName:'临时抄表',
            defaultProps:{
                children:'list'
            },
            addPlanData:{
                DeviceLedgerName:null,
                MaintenanceLevelName:null,
                MaintenancePlanName:null,
                MaintenancePlanDateTime:null,
                MaintenanceUserGUID:null,
                ID:''
            },
            road:null,
            loading:false,
            pointData:[],//抄表路线对应的抄表点
            pickerOptions:{ //新增或编辑抄表计划只能选择大于当前时间的
/*                 disabledDate:val => {
                    if(Date.parse(new Date(val)) < Date.parse(new Date())){
                        console.log(new Date(val),new Date());
                        return true
                    }
                } */
            },
            pickerOptions2: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
            },
        }
    },
    components:{
        zwTree
    },
    watch:{
        filterText(val){
            this.filterObj.FName = val
            this.queryType = 1
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.queryUser()
    },
    mounted(){

    },
    methods:{
        /**
         * 查询保养计划
         * @param { Number } type :1 高级查询 0:普通查询
         * prop 排序字段
         * order 升序或降序
         */
        queryData(){
            if(this.queryType ===1){
                this.showFilterBox = false
            }
            this.filterObj.StartDateTime = new Date(this.month.getFullYear() + '-' + (this.month.getMonth()+1)).toLocaleDateString() + ' 00:00'
            this.filterObj.EndDateTime = new Date(new Date(this.month.getFullYear() + '-' + (this.month.getMonth()+2)).getTime() - 24*60*60*1000).toLocaleDateString() + ' 23:59'
            Maintenance({
                FAction:'QueryPageUMaintenancePlan',
                FType:this.queryType?'Advanced':'Normal',
                PageIndex:this.pageIndex,
                PageSize:10,
                Field:this.orderProp,
                FOrder:this.order,
                mUMaintenancePlan:this.queryType?this.filterObj:{}
            })
            .then(data => {
                this.total = data.FObject.Table?data.FObject.Table[0].Count:0
                this.tableData = data.FObject.Table1?data.FObject.Table1:[]
                this.tableData.forEach(item => {
                    if(item.MaintenanceUserGUID=="00000000-0000-0000-0000-000000000000"){
                        item.MaintenanceUserGUID = ''
                    }
                });
                /**
                * 删除操作时，当前页面无数据时跳到上一页
                */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch(error => {
            
            })
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 查询所有用户
         */
        queryUser(){
            system({
                FAction:'QueryTUsers',
                FName:''
            })
            .then(data => {
                this.users = data.FObject
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 根据年份一键生成抄表计划
         * @param year 年份
         */
        createPlanByYear(year){
            Maintenance({
                FAction:'CreatePlanByYear',
                FYear:year
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '生成成功!'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '生成失败!'
                });
                console.log(error);
            })
        },
        /**
         * 选择年份
         */
        selectYear(val){
            let year = new Date(val).getFullYear()
            this.$DeleteMessage([`确认生成　　${year}年保养计划`,'确认信息'])
            .then(() => {
                this.createPlanByYear(year)
            })
            .catch(error => {
                this.year = ''
            })
        },
        /**
         * 删除保养计划
         * @param {Object} idStr 删除的计划
         */
        async deletePlan(idStr){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除计划'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Maintenance({
                FAction:'DeleteUMaintenancePlan',
                IDStr:idStr
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
            })
        },
        /**
         * 修改负责人
         */
        changeUser(row){
            row.showSelectBox=false
            if(Date.parse(new Date(row.MeterReadingDatetime))<Date.parse(new Date())){
                row.MeterReadingUserGUID = ''
                this.$message({
                  type: 'error',
                  message: '计划抄表时间已过，无法修改'
                });
                return
            }
            this.addPlanData.MaintenancePlanDateTime = row.MaintenancePlanDateTime
            this.updatedPlan(row)
        },
        /**
         * 高级搜索弹框选择时间
         */
        selectTime(val){
            this.filterObj.StartDateTime = comm.getFormatTime(val[0])
            this.filterObj.EndDateTime = comm.getFormatTime(val[1])

        },
        /**
         * 高级搜索弹框重置
         */
        resetFilter(){
            this.filterObj = Object.assign({},this.defaultFilterObj)
            this.time = ''
        },
        /**
         * 编辑计划弹框：选择时间
         */
        selectPlanTime(val){
            if(Date.parse(new Date(val))<=Date.parse(new Date())){
                this.planTime = ''
                this.$message({
                  type: 'error',
                  message: '计划抄表时间应大于当前时间，请重新选择'
                });
                return
            }
            this.addPlanData.MaintenancePlanDateTime = comm.getFormatTime(val)
        },
        /**
         * 修改保养计划
         */
        updatedPlan(obj){
            if(Date.parse(new Date(this.addPlanData.MaintenancePlanDateTime))<=Date.parse(new Date())){
                this.$message({
                  type: 'error',
                  message: '计划保养时间应大于当前时间，请重新选择'
                });
                return
            }                                                                         
            Maintenance({
                FAction:'UpdateUMaintenancePlan',
                ID:obj.ID,
                FDateTime:this.addPlanData.MaintenancePlanDateTime,
                FGUID:obj.MaintenanceUserGUID
            })
            .then(data => {
                this.show = false
                this.queryData()
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                });
            })
            .catch(error => {

            })
        },
        /**
         * 编辑计划
         */
        changePlan(row){
            this.show = true
            this.title = '编辑保养计划'
            this.type = 1
            Object.keys(this.addPlanData).forEach(key => {
                this.addPlanData[key] = row[key]
            })
            this.planTime = new Date(row.MaintenancePlanDateTime)
        },
        sortChange(column){
            if(column.prop === 'MaintenanceLevelName'){
                this.orderProp = 'MaintenanceLevel'
            }else if(column.prop === 'MaintenanceCycleName'){
                this.orderProp = 'MaintenanceCycle'
            }else{
                this.orderProp = column.prop
            }
            this.order = column.order
            this.queryData()
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Maintenance({
                FAction:'QueryExportUInspectionPlan',
                FType:this.queryType?'Advanced':'Normal',
                Field:this.orderProp,
                FOrder:this.order,
                mUMaintenancePlan :this.queryType?this.filterObj:{}
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
