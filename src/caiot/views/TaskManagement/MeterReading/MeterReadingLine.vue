<template>
    <div class=" road report">
            <el-dialog :title="type?'编辑抄表路线':'新增抄表路线'" :visible.sync="show" class="zw-dialog">
                <div class="clearfix">
                    <ul class="l clearfix ">
                        <li>
                            <span class="label">抄表路线</span>
                            <el-input v-model="addRoadData.MeterReadingLineName"></el-input>
                        </li>
                        <li>
                            <span class="label">抄表周期</span>
                            <el-select v-model="addRoadData.MeterReadingCycle"  placeholder="请选择">
                                <el-option v-for="time in timeList1" :key="time.value" :label="time.label" :value="time.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">频次</span>
                            <div class="date-select"  v-if="addRoadData.MeterReadingCycle === 1">

                                <ul class="l clearfix time-content">
                                    <li  style="margin-top:0" v-for="(time, i) in timeArr" :key="i">{{time}}<i class="el-icon-error" @click="deleteTime('timeArr',i)"></i></li>
                                </ul>
                                <el-popover
                                  placement="bottom"
                                  width="200"
                                  trigger="click"
                                  v-model='showPopover'
                                  popper-class='select-time-popover'
                                 >
                                   <i class="el-icon-circle-plus-outline" slot="reference"></i>
                                  <p class="time-title">选择时间</p>
                                  <div class="clearfix">
                                      <div class="l time-select-main">
                                        <el-scrollbar>
                                            <ul class="time-select">
                                                <li v-for="i in 24" :class="{active:hh==i-1}" :key="i" @click="hh=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="hh==i-1">时</span></li>
                                            </ul>
                                        </el-scrollbar>
                                      </div>
                                      <div class="r time-select-main">
                                        <el-scrollbar>
                                            <ul class="time-select">
                                                <li v-for="i in 60" :class="{active:mm==i-1}" :key="i" @click="mm=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="mm==i-1">分</span></li>
                                            </ul>
                                        </el-scrollbar>
                                      </div>
                                  </div>
                                  <div class="time-select-footer">
                                     <a @click="showPopover = false">取消</a>
                                     <a @click="selectTime()">确定</a>
                                  </div>
                                </el-popover>
                            </div>
                            <div class="date-select"  v-if="addRoadData.MeterReadingCycle === 2">
                                    <ul class="l clearfix time-content">
                                        <li  style="margin-top:0" v-for="(time, i) in timeArr1" :key="i">{{weekArr[time[0]-1]}}　{{time[1]}}<i class="el-icon-error" @click="deleteTime('timeArr1',i)"></i></li>
                                    </ul>
                                <el-popover
                                  placement="bottom"
                                  width="200"
                                  trigger="click"
                                  v-model='showPopover'
                                  popper-class='select-week-popover'
                                 >
                                   <i class="el-icon-circle-plus-outline" slot="reference"></i>
                                   <div class="clearfix">
                                        <div class="l" >
                                             <p class="time-title">选择周</p>
                                             <div class="time-select-main" style="width:100%">
                                                <el-scrollbar>
                                                    <ul class="week-select">
                                                        <li v-for="i in 7" :class="{active:week==i}" :key="i" @click="week=i ">{{weekArr[i-1]}}</li>
                                                    </ul>
                                                </el-scrollbar>
                                             </div>
                                        </div>
                                        <div class="r" style="width:194px;">
                                             <p class="time-title">选择时间</p>
                                             <div class="clearfix">
                                                 <div class="l time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 24" :class="{active:h1==i-1}" :key="i" @click="h1=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="h1==i-1">时</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                                 <div class="r time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 60" :class="{active:m1==i-1}" :key="i" @click="m1=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="m1==i-1">分</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                             </div>
                                        </div>
                                   </div>
                                  <div class="time-select-footer">
                                     <a @click="showPopover = false">取消</a>
                                     <a @click="selectWeek()">确定</a>
                                  </div>
                                </el-popover>
                            </div>
                            <div class="date-select"  v-if="addRoadData.MeterReadingCycle === 3">
                                    <ul class="l clearfix time-content">
                                        <li  style="margin-top:0" v-for="(time, i) in timeArr2" :key="i">{{time[0]}}号　{{time[1]}}<i class="el-icon-error" @click="deleteTime('timeArr2',i)"></i></li>
                                    </ul>
                                <el-popover
                                  placement="bottom"
                                  width="200"
                                  trigger="click"
                                  v-model='showPopover'
                                  popper-class='select-week-popover'
                                 >
                                   <i class="el-icon-circle-plus-outline" slot="reference"></i>
                                   <div class="clearfix">
                                        <div class="l" >
                                             <p class="time-title">选择日期</p>
                                             <div class="time-select-main" style="width:100%">
                                                <el-scrollbar>
                                                    <ul class="week-select">
                                                        <li v-for="i in 31" :class="{active:month==i}" :key="i" @click="month=i ">{{i}}号</li>
                                                    </ul>
                                                </el-scrollbar>
                                             </div>
                                        </div>
                                        <div class="r" style="width:194px;">
                                             <p class="time-title">选择时间</p>
                                             <div class="clearfix">
                                                 <div class="l time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 24" :class="{active:h2==i-1}" :key="i" @click="h2=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="h2==i-1">时</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                                 <div class="r time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 60" :class="{active:m2==i-1}" :key="i" @click="m2=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="m2==i-1">分</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                             </div>
                                        </div>
                                   </div>
                                  <div class="time-select-footer">
                                     <a @click="showPopover = false">取消</a>
                                     <a @click="selectMonth()">确定</a>
                                  </div>
                                </el-popover>
                            </div>
                        </li>
                        <li>
                            <span class="label">计划提醒时间(小时)</span>
                            <el-input type="number" v-model="addRoadData.FNoticeTime"></el-input>
                        </li>
                        <li>
                            <span class="label">计划工时(小时)</span>
                            <el-input type="number" v-model="addRoadData.FPlanUseTimes"></el-input>
                        </li>
                    </ul>
                </div>
                <div class="submit">
                    <button class="zw-btn" @click="addRoad()">{{type?'确定':'下一步'}}</button>
                </div>
            </el-dialog>
        <ul class="road-head clearfix report-header">
            <li class="l road-head-add" @click="beforeAddNewRoad()"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l road-head-export" @click="exportFile()"><button class="zw-btn zw-btn-export">导出</button></li>
            <!-- <li class="l road-head-print"><button class="zw-btn zw-btn-print">打印</button></li> -->
            <li class="r">
                <el-input class="search-input" v-model="filterText" placeholder="搜索路线关键字">
                     <i class="el-icon-search" slot="suffix"></i>
                </el-input>
                <el-button type="primary" @click="showFilterBox = !showFilterBox">
                  高级搜索<i class=" el-icon--right" :class="{'el-icon-arrow-down':!showFilterBox,'el-icon-arrow-up':showFilterBox}"></i>
                </el-button>
                <transition>
                    <ul class="search-box"  v-if="showFilterBox">
                        <li class="l">
                            <span>抄表路线名称</span>
                            <el-input v-model="roadName"></el-input>
                        </li>
                        <li class="l">
                            <span>抄表周期</span>
                            <el-select v-model="MeterReadingCycle"  placeholder="请选择">
                                <el-option v-for="time in timeList" :key="time.value" :label="time.label" :value="time.value"></el-option>
                            </el-select>
                        </li>
                        <li class="l">
                            <span>抄表时间</span>
                            <el-time-picker
                              is-range
                              v-model="time"
                              :picker-options="{
                                selectableRange:'00:00-23:59',
                                format:'HH:mm'
                              }"
                              @change="searchTime"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                            <button class="zw-btn zw-btn-primary" @click="queryData();showFilterBox = false">查询</button>
                            <button class="zw-btn zw-btn-primary">重置</button>
                        </li>
                    </ul>
                </transition>
            </li>
        </ul>
        <div class="zw-table road-table">
            <el-table
               :data="tableData"
               max-height="300"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               @row-click = 'changeRoad'
               >
               <el-table-column
                type="index"
                label="序号"
                width="80"
               >
               </el-table-column>
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="抄表时间"
                 show-overflow-tooltip
               >
                    <template slot-scope="scoped">
                        <div v-if="scoped.row.MeterReadingCycle == 1">
                            <span v-for="time in scoped.row.MeterReadingTime">{{time[1]}}　</span>
                        </div>
                        <div v-if="scoped.row.MeterReadingCycle == 2">
                            <span v-for="time in scoped.row.MeterReadingTime">{{weekArr[time[0]-1]}}{{time[1]}}　</span>
                        </div>
                        <div v-if="scoped.row.MeterReadingCycle == 3">
                            <span v-for="time in scoped.row.MeterReadingTime">{{time[0]}}号{{time[1]}}　</span>
                        </div>
                    </template>
               </el-table-column>
               <el-table-column prop="FNoticeTime" label="计划提醒时间" :formatter="(row)=>'提前'+(row.FNoticeTime||0)+'小时'" show-overflow-tooltip>
               </el-table-column>
               <el-table-column prop="FPlanUseTimes" label="计划工时" :formatter="(row)=> (row.FPlanUseTimes||0) + '小时'"  show-overflow-tooltip>
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="deleteRoad(scoped.row)">删除</span>
                        <span class="pointer" @click="editRoad(scoped.row,true)">编辑</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <div class="point-info">
            <div>
                <button class="zw-btn point">抄表点</button>
                <button class="zw-btn set-point" @click="beforeSetPoint()">设置抄表点</button>
            </div>
            <div class="tree-table">
                <ul class="tree-table-header">
                    <li class="l">序号</li>
                    <li class="l">抄表区域</li>
                    <li class="l">抄表点</li>
                    <!-- <li class="l">设备系统</li> -->
                    <li class="l">抄表顺序</li>
                    <li class="l">排序</li>
                </ul>
                <el-scrollbar>
                    <el-tree
                        class="tree-table-body"
                        :data="points"
                        default-expand-all
                        :props='defaultProps'
                        :renderContent='renderContent1'
                    >
                    </el-tree>
                </el-scrollbar>

            </div>
        </div>
            <el-dialog title="设置抄表点" :visible.sync="showPointTree" width="680px" class="zw-dialog showPointTree">
                <div style="height:600px;padding-right: 16px;">
                    <tree-transfer
                     ref="transfer"
                     :data='pointData' 
                     :data1='pointData'
                     leftTitle="所有抄表点"
                     rightTitle="已选抄表点"
                     nodeKey="ID"
                     :filterNode="filterNode"
                      @check-change="checkChange"
                     :defaultChecked="[]"
                     :renderContent='renderContent'
                     :renderContent1='renderContent'
                     :defaultProps='defaultProps'
                     :defaultProps1='defaultProps'>
                    </tree-transfer>    
                </div>
                <div class="submit">
                    <button class="zw-btn" style="background:none" v-if="type === 0" @click="preStep()">上一步</button>
                    <button class="zw-btn zw-btn-primary" :disabled="isDisabled" @click="setPoint()">确定</button>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import {system,MeterReading,Inspection} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {treeTransfer} from '@/caiot/zw-components/index'
import * as comm from "@/caiot/assets/js/pro_common";
import '../InspectionRoad.scss'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
/*                 {
                    prop: 'RowNum',
                    label: '序号'
                }, */
                {
                    prop: 'MeterReadingLineName',
                    label: '抄表路线名称'
                },
                {
                    prop: 'PointCount',
                    label: '抄表点数'
                },
                {
                    prop: 'MeterReadingCycleName',
                    label: '抄表周期'
                },
                {
                    prop: 'Frequency',
                    label: '频次'
                },
            ],
            showFilterBox:false,//是否显示高级搜索框
            timeList:[
            {
                label:'全部',
                value:0
            },
            {
                label:'日抄表',
                value:1
            },
            {
                label:'周抄表',
                value:2
            },
            {
                label:'月抄表',
                value:3
            }],
            timeList1:[
            {
                label:'日抄表',
                value:1
            },
            {
                label:'周抄表',
                value:2
            },
            {
                label:'月抄表',
                value:3
            }],
            //新增巡检路线
            addRoadData:{
                ID:'',
                ProjectID:localStorage.getItem('projectid'),
                MeterReadingLineName:'',
                MeterReadingPointStr:'',
                MeterReadingTimeStr:'',
                AreaIDStr:'',
                MeterReadingCycle:1,
                FNoticeTime:'',
                FPlanUseTimes:''
            },
            pointData:[],//所有巡检点
            defaultProps:{
                children:'list'
            },
            weekArr:['周一','周二','周三','周四','周五','周六','周日'],
            filterText:'',
            show:false,
            type:0,//0为新增，1为编辑路线
            showPopover:false,
            showPointTree:false,
            roadName:'',//巡检路线名称
            MeterReadingCycle:0, //巡检周期
            startDateTime:'00:00',
            endDateTime:'23:59',
            time:'', //时间
            hh:null,
            mm:null,
            timeArr:[],
            timeArr1:[],
            h1:null,
            m1:null,
            week:null,
            month:null,
            h2:null,
            m2:null,
            timeArr2:[],
            roadObj:null, //选中路线
            points:[], //选中路线对应的巡检点
            defaultChecked:[],
            index:0
        }
    },
    components:{
        treeTransfer
    },
    watch:{
        filterText(val){
            this.roadName = val
            this.queryData()
        },
        showPointTree(val){
            if(val){
                this.$nextTick(() => {
                    this.$refs.transfer.$refs.tree.setCheckedKeys(this.defaultChecked)
                    if(this.defaultChecked.length === 0){
                        this.$refs.transfer.$refs.tree1.filter()
                    }
                })
            }
        }

    },
    computed:{
        timeStr(){
            return this.timeArr.join(',')
        }
    },
    created(){
        this.queryData()
        this.queryPoint()
    },
    mounted(){

    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <span>{data.AreaName?data.AreaName:data.InspectionPointName}</span>
            )
        },
        renderContent1(h, { node, data, store }){
            if(data.Aream){
                return(
                    <ul class={{'tree-row':true}}>
                        <li class='l'>{data.AreaSortID}</li>
                        <li class='l'>{data.Aream}</li>
                        <li class='l'></li>
                        <li class='l'></li>
                        <li class='l' v-show={data.index == 0}>
                            <i class='sort sort-down' on-click={ () => this.sortRoad(1,data,this.points[data.i+1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 1}>
                            <i class='sort sort-down' on-click={ () => this.sortRoad(1,data,this.points[data.i+1])}></i>
                            <i class='sort sort-up' on-click={ () => this.sortRoad(1,data,this.points[data.i-1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 2}>
                            <i class='sort sort-up' on-click={ () => this.sortRoad(1,data,this.points[data.i-1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 3}>
                        </li>
                    </ul>
                )
            }else{
                return(
                    <ul class={{'tree-row':true}}>
                        <li class='l'></li>
                        <li class='l'></li>
                        <li class='l'>{data.InspectionPointName}</li>
                        <li class='l'>{data.PointSortID}</li>
                        <li class='l' v-show={data.index == 0}>
                            <i class='sort sort-down' on-click={ () => this.sortRoad(0,data,data.father[data.i+1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 1}>
                            <i class='sort sort-down' on-click={ () => this.sortRoad(0,data,data.father[data.i+1])}></i>
                            <i class='sort sort-up' on-click={ () => this.sortRoad(0,data,data.father[data.i-1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 2}>
                            <i class='sort sort-up' on-click={ () => this.sortRoad(0,data,data.father[data.i-1])}></i>
                        </li>
                        <li class='l' v-show={data.index == 3}>
                        </li>
                    </ul>
                )
            }
        },
        /**
         * 查询抄表路线
         */
        queryData(){
            if(this.time&&this.time[0]){
                let time = new Date(this.time[0])
                this.startDateTime = time.getHours()+':'+time.getMinutes()
            }else{
                this.startDateTime = '00:00'
            }
            if(this.time&&this.time[1]){
                let time = new Date(this.time[1])
                this.endDateTime = time.getHours()+':'+time.getMinutes()
            }else{
                this.endDateTime = '23:59'
            }
            MeterReading({
                FAction:'QueryUMeterReadingLine',
                SearchKey:this.roadName,
                StartDateTime:this.startDateTime,
                EndDateTime:this.endDateTime,
                InspectionCycle:this.MeterReadingCycle,
            })
            .then(data => {
                this.tableData = data.FObject
                this.tableData.forEach(item => {
                    item.MeterReadingTime = item.MeterReadingTime.replace(/,$/ig,'').split(',')
                    item.MeterReadingTime = item.MeterReadingTime.map(obj => {
                       return obj.split('-')
                    })
                });
            })
            .catch(error => {

            })
        },
        /**
         * 查询所有巡检点
         */
        queryPoint(){
            Inspection({
                FAction:'QueryUInspectionPointTree',
                ID:0,
                FType:2
            })
            .then(data => {
                this.pointData  = data.FObject
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 新增或修改路线
         * type 0:为新增 1：为修改
         */
        addOrUpdatedRoad(type) {
            let actionsArr = ['AddUMeterReadingLine','UpdateUMeterReadingLine','UpdateUMeterReadingLinePoint']
            return new Promise((resolve,reject) => {
                    MeterReading({
                        FAction:actionsArr[type],
                        mUMeterReadingLine:this.addRoadData
                    })
                    .then(data => {
                        this.queryData()
                        this.show = false
                        this.$message({
                          type: 'success',
                          message: type?'修改成功！':'新增成功'
                        });
                        resolve()
                    })
                    .catch(error => {
                        this.$message({
                          type: 'error',
                          message: error
                        });
                        reject()       
                    })
            })
        },
        /**
         * 新增或修改巡检路线
         */
        addRoad(){
            if(this.addRoadData.MeterReadingLineName.length ===0 ){
                this.$message({
                    type:'warning',
                    message:'请填写巡检路线名称'
                })
                return
            }
            if(this.addRoadData.MeterReadingCycle == 1){
                let arr = this.timeArr.map(item => {
                    return '0-' + item
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请填写频次'
                    })
                    return
                }
                this.addRoadData.MeterReadingTimeStr = arr.join(',')
            }else if(this.addRoadData.MeterReadingCycle == 2){
                let arr = this.timeArr1.map(item => {
                    return item[0] + '-' + item[1]
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请填写频次'
                    })
                    return
                }
                this.addRoadData.MeterReadingTimeStr = arr.join(',')
            }else if(this.addRoadData.MeterReadingCycle == 3){
                let arr = this.timeArr2.map(item => {
                    return item.join('-')
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请填写频次'
                    })
                    return
                }
                this.addRoadData.MeterReadingTimeStr = arr.join(',')
            }
            if(this.type){
                this.addRoadData.MeterReadingPointStr = -1,
                this.addRoadData.AreaIDStr = -1
                console.log(this.type)
                return this.addOrUpdatedRoad(this.type)
            }else{
                console.log(this.addRoadData);
                this.show = false
                this.defaultChecked = []
                this.showPointTree = true
            }
        },
        /**
         * 新增路线
         */
        beforeAddNewRoad(){
            this.show = true
            this.type = 0
            this.addRoadData.MeterReadingLineName = ''
            this.addRoadData.MeterReadingCycle = 1
            this.addRoadData.ID = ''
            this.addRoadData.FNoticeTime = ''
            this.addRoadData.FPlanUseTimes = ''
            this.timeArr = []
            this.timeArr1 = []
            this.timeArr2 = []
        },
        /**
         * 编辑路线
         * @param {Object} item 巡检路线对象
         * @param {Boolean} show 是否显示编辑弹框
         */
        editRoad(item,show){
            this.show = show
            this.type = 1
            this.addRoadData.MeterReadingLineName = item.MeterReadingLineName
            this.addRoadData.MeterReadingCycle = item.MeterReadingCycle
            this.addRoadData.ID = item.ID
            this.addRoadData.FNoticeTime = item.FNoticeTime
            this.addRoadData.FPlanUseTimes = item.FPlanUseTimes
            //显示弹框时，默认填入时间
            if(show){
                if(item.MeterReadingCycle == 1){
                    this.timeArr = item.MeterReadingTime.map(item => {
                        return item[1]
                    })
                }else if(item.MeterReadingCycle == 2){
                    this.timeArr1 = JSON.parse(JSON.stringify(item.MeterReadingTime))
                }else if(item.MeterReadingCycle == 3){
                    this.timeArr2 = JSON.parse(JSON.stringify(item.MeterReadingTime))
                }
            }else{
                let timeArr = item.MeterReadingTime.map(item => {
                    return item.join('-')
                })
                this.addRoadData.MeterReadingTime = timeArr.join(',')
            }
        },
        /**
         * 删除抄表路线
         */
        async deleteRoad(item){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${item.MeterReadingLineName}`,'删除路线'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            MeterReading({
                FAction:'DeleteUMeterReadingLine',
                ID:item.ID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
                this.queryData()
            })
            .catch(error => {

            })
        },
        /**
         * 点击每一行（修改路线）
         */
        changeRoad(row){
            this.roadObj = row
            this.defaultChecked = []
            Inspection({
                FAction:'QueryAreaUInspectionPointBySort',
                ID:row.ID,
                FType:2
            })
            .then(data => {
                this.points = data.FObject
                this.points.forEach((item, i)=> {
                    item.i = i
                    if(this.points.length === 1){
                        item.index = 3
                    }else if(i === 0 ){
                        item.index = 0
                    }else if(i === this.points.length - 1 ){
                        item.index = 2
                    }else{
                        item.index = 1
                    }
                    item.list.forEach((obj,j) => {
                        obj.father = item.list
                        obj.i = j
                        this.defaultChecked.push(obj.InspectionPointID)
                        if(item.list.length === 1){
                            obj.index = 3
                        }else if(j === 0){
                            obj.index = 0
                        }else if(j === item.list.length - 1 ){
                            obj.index = 2
                        }else{
                            obj.index = 1
                        }
                    })
                })
            })
            .catch(error => {
                console.log('错误',error);
            })
        },
        /**
         * 巡检点选择发生改变
         */
        checkChange(data,check){
            if(data.IsExist == null){
                data.IsExist = '0'
            }
            if(data.IsExist&&check){
                data.IsExist = '1'
            }else if(data.IsExist&&!check){
                data.IsExist = '0'
            }
            this.$refs.transfer.$refs.tree1.filter()
        },
        /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.IsExist == 1
        },
        resetPoint(){

        },
        /**
         * 点击设置巡检点
         */
        beforeSetPoint(){
            if(this.roadObj){
                this.type = 2
                this.showPointTree = true
            }else{
                this.$DeleteMessage(['请选择抄表路线','提示信息'],false)
            }
            console.log(this.type);
        },
        /**
         * 设置巡检路线（设置巡检点弹框）
         */
        async setPoint(){
            //修改路线
            if(this.type){
                //this.editRoad(this.roadObj,false)
                this.addRoadData.ID = this.roadObj.ID
            }
            let arr = []
            let areaArr = []
            // 遍历获取选中的巡检点
            this.pointData.forEach(item => {
                item.list.forEach(obj => {
                    if(obj.IsExist == '1'){
                        arr.push(obj.ID)
                        if(!areaArr.includes(item.AreaID)){
                            areaArr.push(item.AreaID)
                        }
                    }
                })
            })
            if(arr.length === 0){
                this.$message({
                    type:'warning',
                    message:'请选择巡检点'
                })
            }
            this.addRoadData.MeterReadingPointStr = arr.join(',')
            this.addRoadData.AreaIDStr = areaArr.join(',')
            this.isDisabled = true
            await this.addOrUpdatedRoad(this.type)
            this.showPointTree = false
            setTimeout(() => {
                this.isDisabled = false
            }, 1000);
            if(this.type){
                this.changeRoad(this.roadObj)
            }
        },
        /**
         * 点击上一步
         */
        preStep(){
            this.showPointTree = false
            this.show = true
        },
        /**
         * 改变巡检点或巡检区域顺序
         * @param {Number} type 0: 修改巡检点排序位置 1: 修改区域排序位置
         * @param {Object} startObj 排序时，目标对象
         * @param {Object} endObj 排序时，目标交换对象
         */
        sortRoad(type,startObj,endObj){
            let startIDStr,endIDStr
            if(type === 1){
                let startList = [] , endList = []
                startObj.list.forEach(item => {
                    startList.push(item.UInspectionLinePointID)
                })
                endObj.list.forEach(item => {
                    endList.push(item.UInspectionLinePointID)
                })
                startIDStr = startList.join(',')
                endIDStr = endList.join(',')
            }else{
                startIDStr = startObj.UInspectionLinePointID
                endIDStr = endObj.UInspectionLinePointID                                          
            }
            MeterReading({
                FAction:'UpdateUMeterReadingLinePointBySortID',
                StartIDStr:startIDStr,
                EndIDStr:endIDStr,
                FType:type
            })
            .then(data => {
                this.changeRoad(this.roadObj)
            })
            .catch(error => {

            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            MeterReading({
                FAction:'QueryExportUMeterReadingLine',
                SearchKey:this.roadName,
                StartDateTime:this.startDateTime,
                EndDateTime:this.endDateTime,
                MeterReadingCycle:this.MeterReadingCycle
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
        /**
         *日巡检 ，选择时间
         */
        selectTime(){
            if(this.hh == null||this.mm == null){
                this.$message({
                    type:'warning',
                    message:'请选择时间'
                })
                return
            }
            let  hh = this.hh <10?'0'+this.hh:this.hh
            let  mm = this.mm <10?'0'+this.mm:this.mm
            !this.timeArr.includes(hh+':'+mm) && this.timeArr.push(hh+':'+mm)
            this.showPopover = false
        },
        /**
         * 周巡检 ，选择时间
         */
        selectWeek(){
            if(this.week==null||this.h1 == null||this.m1 == null){
                this.$message({
                    type:'warning',
                    message:'请选择时间'
                })
                return
            }
            let  hh = this.h1 <10?'0'+this.h1:this.h1
            let  mm = this.m1 <10?'0'+this.m1:this.m1
            let isExit = this.timeArr1.find(item => item.join(',') == [this.week,hh+':'+mm].join(','))
            !isExit && this.timeArr1.push([this.week,hh+':'+mm])
            this.showPopover = false
        },
        /**
         * 月巡检 ，选择时间
         */
        selectMonth(){
            if(this.month==null||this.h2 == null||this.m2 == null){
                this.$message({
                    type:'warning',
                    message:'请选择时间'
                })
                return
            }
            let  hh = this.h2 <10?'0'+this.h2:this.h2
            let  mm = this.m2 <10?'0'+this.m2:this.m2
            let isExit = this.timeArr2.find(item => item.join(',') == [this.month,hh+':'+mm].join(','))
            !isExit && this.timeArr2.push([this.month,hh+':'+mm])
            this.showPopover = false
        },
        /**
         * 删除时间
         */
        deleteTime(arr,i){
            this[arr].splice(i,1)
        },
        /**
         * 高级搜索弹框选择时间
         */
        searchTime(val){
            this.startDateTime = comm.getFormatTime(val[0]).split(' ')[1].substr(0,5)
            this.endDateTime = comm.getFormatTime(val[1]).split(' ')[1].substr(0,5)
        }
    }
}
</script>
<style lang="scss">

</style>
