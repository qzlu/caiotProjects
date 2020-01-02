<template>
    <div class="report plan">
        <!-- 新增或编辑巡检计划 弹框-->
        <el-dialog :title="title" :visible.sync="show" :class="{showPointTree:showPointTree,'zw-dialog':true}">
            <div class="clearfix">
                <ul class="l clearfix ">
                    <li>
                        <span class="label">巡检路线名称</span>
                        <el-input v-model="addPlanData.InspectionLineName" v-if="type===1" readonly></el-input>
                        <el-select v-model="road"  filterable value-key="ID"  placeholder="请选择" @change="selectRoad" v-if="type===0">
                            <el-option v-for="road in roadDatas" :key="road.ID" :label="road.InspectionLineName" :value="road"></el-option>
                        </el-select>
                        <button class="zw-btn" @click="showPointTree = !showPointTree">路线详情</button>
                    </li>
                    <li>
                        <span class="label">巡检计划名称</span>
                        <el-input v-model="addPlanData.InspectionPlanName" readonly></el-input>
                    </li>
                    <li>
                        <span class="label">巡检周期</span>
                        <el-input v-model="inspectionCycleName" readonly></el-input>
                    </li>
                    <li class="plan-time">
                        <span class="label">计划巡检时间</span>
                        <el-date-picker
                          v-model="planTime"
                          type="datetime"
                          :picker-options="pickerOptions1"
                          @change="selectPlanTime"
                          placeholder="选择日期时间">
                        </el-date-picker>
                    </li>
                    <li>
                        <span class="label">负责人</span>
                        <el-select v-model="addPlanData.InspectionUserGUID" filterable  placeholder="请选择">
                            <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                        </el-select>
                    </li>
                </ul>
                <div class="r clearfix tree-content" v-if="showPointTree">
                    <i class="arrow"></i>       
                    <zw-tree :data='pointData' :renderContent='renderContent' :defaultProps='defaultProps' v-loading="loading">
                    </zw-tree>                                                                                                                                       
                </div>
            </div>
            <div style="text-align:center;height:42px;margin-top:37px;">
                <button class="zw-btn" :disabled="isDisabled"  @click="addPlan()">确定</button>
            </div>
        </el-dialog>
        <ul class="report-header plan-header clearfix"> 
            <li class="l" @click="beforeAdd()"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
            <li class="l"><button class="zw-btn zw-btn-primary" @click="deletePlans()"><i class="el-icon-delete"></i> 删除</button></li>
            <li class="l select-plan-time">
                <span class="label">生成计划</span>
                <ul class="select-plan-type">
                    <li :class="{active:planType == 1}" @click="planType = 1">年</li>
                    <li :class="{active:planType == 2}" @click="planType = 2">月</li>
                </ul>
                <el-date-picker
                  v-show="planType==1"
                  v-model="year"
                  type="year"
                  @change='selectYear'
                  placeholder="选择年">
                </el-date-picker>
                <el-date-picker
                  v-show="planType == 2"
                  v-model="year"
                  type="month"
                  @change="selectMonth"
                  placeholder="选择月">
                </el-date-picker>
            </li>
            <li class="r">
                <el-input class="search-input" v-model="filterText" placeholder="搜索计划关键字">
                     <i class="el-icon-search" slot="suffix"></i>
                </el-input>
              <!--   <el-button type="primary" @click="showFilterBox = !showFilterBox">
                  高级搜索<i class=" el-icon--right" :class="{'el-icon-arrow-down':!showFilterBox,'el-icon-arrow-up':showFilterBox}"></i>
                </el-button> -->
                <transition>
                    <ul class="search-box"  v-if="showFilterBox">
                        <li>
                            <span>计划名称</span>
                            <el-input v-model="filterObj.InspectionPlanName"></el-input>
                        </li>
                        <li>
                            <span>路线名称</span>
                            <el-select v-model="filterObj.InspectionLineName"  filterable value-key="ID"  placeholder="请选择">
                                <el-option v-for="road in roadDatas" :key="road.ID" :label="road.InspectionLineName" :value="road.InspectionLineName"></el-option>
                            </el-select>
                        </li>
                        <li class="plan-select-time">
                            <span>巡检时间</span>
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
                            <el-select v-model="filterObj.InspectionUserGUID"  placeholder="请选择">
                                <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>巡检周期</span>
                            <el-select v-model="filterObj.InspectionCycle"  placeholder="请选择">
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
                <el-select v-model="filterObj.InspectionUserGUID"  placeholder="请选择" @change="queryData()">
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
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">
                        <div>
                            {{scope.$index+1+(pageIndex-1)*10}}
                        </div>
                    </template>
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
                    <el-select v-model="scoped.row.InspectionUserGUID"  placeholder="请选择" @change="changeUser(scoped.row)">
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
import {system,Inspection} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwPagination,zwTree} from '@/caiot/zw-components/index'
import * as comm from "../../assets/js/pro_common";
import './InspectionPlan.scss'
import formatDate from '@/utils/formatDate.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'InspectionPlanName',
                    label: '计划名称'
                },
                {
                    prop: 'InspectionPlanTypeText',
                    label: '状态'
                },
                {
                    prop: 'InspectionLineName',
                    label: '路线名称'
                },
                {
                    prop:'AreaCount',
                    label:"巡检区域"
                },
                {
                    prop: 'PointCount',
                    label: '巡检点数',
                    sortble:'custom'
                },
                {
                    prop: 'InspectionCycleName',
                    label: '巡检周期'
                },
/*                 {
                    prop: 'Frequency',
                    label: '频次'
                }, */
                {
                    prop: 'InspectionDatetime',
                    label: '计划巡检时间',
                    sortble:'custom'
                }
            ],
            timeList:[{
                label:'全部',
                value:0
            },
            {
                label:'日巡检',
                value:1
            },
            {
                label:'周巡检',
                value:2
            },
            {
                label:'月巡检',
                value:3
            }],
            year:'',
            month:new Date(),
            filterText:'',
            defaultFilterObj:{
                InspectionPlanName:'',
                InspectionLineName:'',
                InspectionCycle:0,
                InspectionUserGUID:'',
                StartDateTime:'',
                EndDateTime:''
            },
            filterObj:{ //高级搜索条件
                InspectionPlanName:'',
                InspectionLineName:'',
                InspectionCycle:0,
                InspectionUserGUID:'',
                StartDateTime:'',
                EndDateTime:''
            },
            time:'',
            planTime:new Date(),
            showFilterBox:false,
            queryType:1,//查询方式，0为普通查询，1为高级搜索
            type:0,//0为新增 1为编辑计划
            show:false, //控制新增或编辑弹框
            title:'新增巡检计划',
            roadDatas:[],//所有路线
            showPointTree:false,
            inspectionCycleName:'临时巡检',
            defaultProps:{
                children:'list'
            },
            defaultAddPlanData:{
                InspectionPlanName:null,
                InspectionLineID:null,
                InspectionDatetime:null,
                InspectionUserGUID:null,
                FDescription:''
            },
            addPlanData:{
                InspectionPlanName:null,
                InspectionLineID:null,
                InspectionDatetime:null,
                InspectionUserGUID:null,
                FDescription:''
            },
            road:null,
            loading:false,
            pointData:[],//巡检路线对应的巡检点
            pickerOptions1:{
                disabledDate:(val) => {
                    return   new Date().getTime() >= val.getTime() + 24*60*60*1000
                }
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
            planType:1,
            isDisabled:false
        }
    },
    components:{
        zwTree
    },
    computed:{
        users(){
            return this.$store.state.orderUser //负责人
        }
    },
    watch:{
        filterText(val){
            this.filterObj.InspectionPlanName = val
            this.queryType = 1
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.queryRoad()
        this.$store.dispatch('queryOrderTUsers')
    },
    mounted(){

    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <span>{data.Aream?data.Aream:data.InspectionPointName}</span>
            )
        },
        /**
         * 查询巡检计划
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
            Inspection({
                FAction:'QueryPageUInspectionPlan',
                FType:this.queryType?'Advanced':'Normal',
                PageIndex:this.pageIndex,
                PageSize:10,
                Field:this.orderProp,
                FOrder:this.order,
                mSearchInspectionPlan:this.queryType?this.filterObj:{}
            },true)
            .then(data => {
                this.total = data.FObject.Table?data.FObject.Table[0].FTotalCount:0
                this.tableData = data.FObject.Table1?data.FObject.Table1:[]
                this.tableData.forEach(item => {
                    if(item.InspectionUserGUID=="00000000-0000-0000-0000-000000000000"){
                        item.InspectionUserGUID = ''
                    }
                    this.$set(item,'InspectionPlanTypeText',item.InspectionPlanType==1?'自动生成':'手动生成')
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
         * 排序
         */
        sortChange(column){
            this.orderProp = column.prop
            this.order = column.order
            this.queryData()
        }, 
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 查询巡检路线
         */
        queryRoad(){

            let startDateTime = '00:00'
            let endDateTime = '23:59'
            Inspection({
                FAction:'QueryPageUInspectionLineInfo',
                FName:'',
                StartDateTime:startDateTime,
                EndDateTime:endDateTime,
                InspectionCycle:0,
                PageIndex:1,
                PageSize:10000000000
            })
            .then(data => {
                this.roadDatas = data.FObject.Table1
            })
            .catch(error => {

            })
        },
        /**
         * 根据年份一键生成巡检计划
         * @param year 年份
         */
        createPlanByYear(year){
            Inspection({
                FAction:'CreatePlanByYear',
                FYear:year
            },true)
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
         * 根据月份一键生成巡检计划
         */
        createPlanByMonth(month){
            Inspection({
                FAction:'CreatePlanByMonth',
                FDateTime:month
            })
            .then((result) => {
                this.$message({
                  type: 'success',
                  message: '生成成功!'
                });
                this.queryData()
            }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: '生成失败!'
                });
            });
        },
        /**
         * 选择年份
         */
        selectYear(val){
            let year = new Date(val).getFullYear()
            this.$DeleteMessage([`确认生成　　${year}年巡检计划`,'确认信息'])
            .then(() => {
                this.createPlanByYear(year)
            })
            .catch(error => {
                this.year = ''
            })
        },
        selectMonth(val){
            let time = formatDate(val,'YYYY-MM')
            this.$DeleteMessage([`确认生成　　${time}巡检计划`,'确认信息'])
            .then(() => {
                this.createPlanByMonth(time)
            })
            .catch(error => {
                this.year = ''
            })
        },
        /**
         * 删除巡检计划
         * @param {Object} row 删除的计划
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
            Inspection({
                FAction:'DeleteUInspectionPlanByID',
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
            if(Date.parse(new Date(row.InspectionDatetime))<Date.parse(new Date())){
                row.InspectionUserGUID = ''
                this.$message({
                  type: 'error',
                  message: '计划巡检时间已过，无法修改'
                });
                return
            }
            Inspection({
                FAction:'UpdateUInspectionPlanByID',
                ID:row.ID,
                mUInspectionPlan:{'InspectionDatetime':row.InspectionDatetime,'InspectionUserGUID':row.InspectionUserGUID}
            })
            .then(data => {
                console.log('负责人',data);
            })
            .catch(error => {

            })
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
         * 根据路线id获取巡检点
         */
        queryPoints(id){
            Inspection({
                FAction:'QueryAreaUInspectionPointBySort',
                ID:id,
                FType:1
            })
            .then(data => {
                this.pointData = data.FObject
                this.loading = false
            })
            .catch(error => {
                this.loading = false
                this.pointData = []
            })
        },
        /**
         * 选择路线
         */
        selectRoad(val){
            this.loading = true
            this.addPlanData.InspectionLineName = val.InspectionLineName
            this.addPlanData.InspectionPlanName = val.InspectionLineName + '临时巡检计划'
            this.addPlanData.InspectionLineID = val.ID
            this.queryPoints(val.ID)
        },
        /**
         * 新增计划弹框：选择时间
         */
        selectPlanTime(val){
            if(Date.parse(new Date(val))<=Date.parse(new Date())){
                this.planTime = ''
                this.$message({
                  type: 'error',
                  message: '计划巡检时间应大于当前时间，请重新选择'
                });
                return
            }
            this.addPlanData.InspectionDatetime = comm.getFormatTime(val)
        },
        /**
         * 新增或编辑巡检计划
         */
        addPlan(){
            if(Date.parse(new Date(this.addPlanData.InspectionDatetime))<=Date.parse(new Date())){
                this.$message({
                  type: 'error',
                  message: '计划巡检时间应大于当前时间，请重新选择'
                });
                return
            }
            this.show = false
            this.isDisabled = true                                                                  
            Inspection({
                FAction:this.type?'UpdateUInspectionPlanByID':'AddTempUInspectionPlan',
                ID:this.type?this.addPlanData.ID:'',
                mUInspectionPlan:this.type?{InspectionDatetime:this.addPlanData.InspectionDatetime,InspectionUserGUID:this.addPlanData.InspectionUserGUID}:this.addPlanData
            })
            .then(data => {
                this.queryData()
                this.$message({
                  type: 'success',
                  message: this.type?'修改成功！':'新增成功！'
                });
            })
            .catch(error => {
            })
            .finally(() => {
                setTimeout(() => {
                    this.isDisabled = false
                },1000)
            })
        },
        /**
         * 点击新增按钮
         */
        beforeAdd(){
            this.show  = true
            this.title = '新增巡检计划'
            this.type = 0
            this.inspectionCycleName = '临时巡检'
            this.planTime = new Date()
            this.addPlanData = Object.assign({},this.defaultAddPlanData)
            this.road = null
        },
        /**
         * 编辑计划
         */
        changePlan(row){
            this.show = true
            this.title = '编辑巡检计划'
            this.type = 1
            this.inspectionCycleName = row.InspectionCycleName
            this.addPlanData.InspectionPlanName = row.InspectionPlanName
            this.addPlanData.InspectionUserGUID = row.InspectionUserGUID
            this.addPlanData.InspectionLineID = row.InspectionLineID
            this.planTime = new Date(row.InspectionDatetime)
            this.addPlanData.InspectionDatetime = row.InspectionDatetime
            this.$set(this.addPlanData,'InspectionLineName',row.InspectionLineName)
            this.$set(this.addPlanData,'ID',row.ID)
            this.queryPoints(row.InspectionLineID)
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Inspection({
                FAction:'QueryExportUInspectionPlan',
                FType:this.queryType?'Advanced':'Normal',
                Field:this.orderProp,
                FOrder:this.order,
                mSearchInspectionPlan:this.queryType?this.filterObj:{}
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
