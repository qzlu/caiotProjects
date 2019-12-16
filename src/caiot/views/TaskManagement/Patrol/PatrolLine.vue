<template>
    <div class=" road report">
            <el-dialog :title="type?'编辑巡更路线':'新增巡更路线'" width="500px" :visible.sync="show" class="zw-dialog patrol-line">
                <div class="clearfix">
                    <ul class="l clearfix ">
                        <li>
                            <span class="label">巡更路线</span>
                            <el-input v-model="addRoadData.PatrolLineName"></el-input>
                        </li>
                        <li>
                            <span class="label">巡更周期</span>
                            <el-select v-model="addRoadData.PatrolCycle"  placeholder="请选择">
                                <el-option v-for="time in timeList1" :key="time.value" :label="time.label" :value="time.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">频次</span>
                            <div class="date-select"  v-if="addRoadData.PatrolCycle === 1">

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
                            <div class="date-select"  v-if="addRoadData.PatrolCycle === 2">
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
                            <div class="date-select"  v-if="addRoadData.PatrolCycle === 3">
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
                        <li>
                            <span class="label">超时工时(小时)</span>
                            <el-input type="number" v-model="addRoadData.FAllowTimeOut"></el-input>
                        </li>
                    </ul>
                </div>
                <div style="text-align:center;height:42px;margin-top:37px;">
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
                            <span>巡更路线名称</span>
                            <el-input v-model="roadName"></el-input>
                        </li>
                        <li class="l">
                            <span>巡更周期</span>
                            <el-select v-model="PatrolCycle"  placeholder="请选择">
                                <el-option v-for="time in timeList" :key="time.value" :label="time.label" :value="time.value"></el-option>
                            </el-select>
                        </li>
                        <li class="l">
                            <span>巡更时间</span>
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
                 label="巡更时间"
                 show-overflow-tooltip
               >
                    <template slot-scope="scoped">
                        <div v-if="scoped.row.PatrolCycle == 1">
                            <span v-for="time in scoped.row.PatrolTime">{{time[1]}}　</span>
                        </div>
                        <div v-if="scoped.row.PatrolCycle == 2">
                            <span v-for="time in scoped.row.PatrolTime">{{weekArr[time[0]-1]}}{{time[1]}}　</span>
                        </div>
                        <div v-if="scoped.row.PatrolCycle == 3">
                            <span v-for="time in scoped.row.PatrolTime">{{time[0]}}号{{time[1]}}　</span>
                        </div>
                    </template>
               </el-table-column>
               <el-table-column prop="FNoticeTime" label="计划提醒时间" :formatter="(row)=>'提前'+(row.FNoticeTime||0)+'小时'" show-overflow-tooltip>
               </el-table-column>
               <el-table-column prop="FPlanUseTimes" label="计划工时" :formatter="(row)=> (row.FPlanUseTimes||0)+'小时'"  show-overflow-tooltip>
               </el-table-column>
               <el-table-column prop="FAllowTimeOut" label="超时工时" :formatter="(row)=> (row.FAllowTimeOut||0)+'小时'"  show-overflow-tooltip>
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
                <button class="zw-btn point">巡更点</button>
                <button class="zw-btn set-point" @click="beforeSetPoint()">设置巡更点</button>
            </div>
            <div class="tree-table">
                <el-table
                   :data="points"
                   max-height="354"
                   style="width: 100%"
                   header-row-class-name="el-table-header"
                   :row-class-name="tableRowClassName"
                   >
                   <el-table-column
                     type="index"
                     label="序号"
                     width="200"
                     align="center"
                    >
                   </el-table-column>
                   <el-table-column
                     prop="PatrolPointName"
                     label="巡更点"
                     align="center"
                    >
                   </el-table-column>
                   <el-table-column
                     prop=""
                     label="排序"
                     align="center"
                    >
                    <template slot-scope="scoped">
                        <div v-if="scoped.$index===0">
                            <i class='sort sort-down' @click='sortRoad(scoped.row.ID,points[scoped.$index+1].ID)'></i>
                        </div>
                        <div v-else-if="scoped.$index>0&&scoped.$index<points.length-1">
                            <i class='sort sort-down' @click='sortRoad(scoped.row.ID,points[scoped.$index+1].ID)'></i>
                            <i class='sort sort-up' @click='sortRoad(scoped.row.ID,points[scoped.$index-1].ID)'></i>
                        </div>
                        <div v-else>
                            <i class='sort sort-up' @click='sortRoad(scoped.row.ID,points[scoped.$index-1].ID)'></i>
                        </div>
                    </template>
                   </el-table-column>
                </el-table>
            </div>
        </div>
            <el-dialog title="设置巡更点" :visible.sync="showPointTree" class="zw-dialog showPointTree">
                <div style="padding-right: 16px;">
                    <tree-transfer
                     ref="transfer"
                     :data='pointData' 
                     :data1='pointData'
                     leftTitle="所有巡更点"
                     rightTitle="已选巡更点"
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
                <div style="text-align:center;margin-top:20px;">
                    <button class="zw-btn" style="background:none" @click="preStep()">上一步</button>
                    <button class="zw-btn zw-btn-primary" @click="setPoint()">确定</button>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import {system,Patrol,Inspection} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {treeTransfer} from '@/caiot/zw-components/index'
import * as comm from "@/caiot/assets/js/pro_common";
import '../InspectionRoad.scss'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'PatrolLineName',
                    label: '巡更路线名称'
                },
                {
                    prop: 'PointCount',
                    label: '巡更点数'
                },
                {
                    prop: 'PatrolCycleName',
                    label: '巡更周期'
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
                label:'日巡更',
                value:1
            },
            {
                label:'周巡更',
                value:2
            },
            {
                label:'月巡更',
                value:3
            }],
            timeList1:[
            {
                label:'日巡更',
                value:1
            },
            {
                label:'周巡更',
                value:2
            },
            {
                label:'月巡更',
                value:3
            }],
            //新增巡更路线
            addRoadData:{
                ID:'',
                ProjectID:localStorage.getItem('projectid'),
                PatrolLineName:'',
                UPatrolLinePointStr:'',
                UPatrolTimeStr:'',
                PatrolCycle:1,
                FDescription:'',
                FNoticeTime:'',
                FPlanUseTimes:'',
                FAllowTimeOut:''
            },
            pointData:[],//所有巡更点
            defaultProps:{
                children:'list'
            },
            weekArr:['周一','周二','周三','周四','周五','周六','周日'],
            filterText:'',
            show:false,
            type:0,//0为新增，1为编辑路线
            showPopover:false,
            showPointTree:false,
            roadName:'',//巡更路线名称
            PatrolCycle:0, //巡更周期
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
            points:[], //选中路线对应的巡更点
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
                <span>{data.PatrolPointName}</span>
            )
        },
        /**
         * 查询巡更路线
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
            Patrol({
                FAction:'QueryUPatrolLine',
                FName:this.roadName,
                StartDateTime:this.startDateTime,
                EndDateTime:this.endDateTime,
                PatrolCycle:this.PatrolCycle,
            })
            .then(data => {
                console.log(data)
                this.tableData = data.FObject
                this.tableData.forEach(item => {
                    item.PatrolTime = item.PatrolTime.replace(/,$/ig,'').split(',')
                    item.PatrolTime = item.PatrolTime.map(obj => {
                       return obj.split('-')
                    })
                });
            })
            .catch(error => {

            })
        },
        /**
         * 查询所有巡更点
         */
        queryPoint(){
            Patrol({
                FAction:'QueryUPatrolPointTree',
                ID:0,
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
            let actionsArr = ['AddUPatrolLine','UpdateUPatrolLine']
            return new Promise((resolve,reject) => {
                    Patrol({
                        FAction:actionsArr[type],
                        mUPatrolLine:this.addRoadData
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
                    })
            })
        },
        /**
         * 新增或修改巡更路线
         */
        addRoad(){
            if(this.addRoadData.PatrolLineName.length ===0 ){
                this.$message({
                    type:'warning',
                    message:'请填写巡更路线名称'
                })
                return
            }
            if(this.addRoadData.PatrolCycle == 1){
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
                this.addRoadData.UPatrolTimeStr = arr.join(',')
            }else if(this.addRoadData.PatrolCycle == 2){
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
                this.addRoadData.UPatrolTimeStr = arr.join(',')
            }else if(this.addRoadData.PatrolCycle == 3){
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
                this.addRoadData.UPatrolTimeStr = arr.join(',')
            }
            if(this.type){
                this.addRoadData.UPatrolLinePointStr = -1,
                this.addRoadData.AreaIDStr = -1
                return this.addOrUpdatedRoad(this.type)
            }else{
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
            this.addRoadData.PatrolLineName = ''
            this.addRoadData.PatrolCycle = 1
            this.addRoadData.ID = ''
            this.addRoadData.FNoticeTime = ''
            this.addRoadData.FPlanUseTimes = ''
            this.addRoadData.FAllowTimeOut = ''
            this.timeArr = []
            this.timeArr1 = []
            this.timeArr2 = []
        },
        /**
         * 编辑路线
         * @param {Object} item 巡更路线对象
         * @param {Boolean} show 是否显示编辑弹框
         */
        editRoad(item,show){
            this.show = show
            this.type = 1
            this.addRoadData.PatrolLineName = item.PatrolLineName
            this.addRoadData.PatrolCycle = item.PatrolCycle
            this.addRoadData.ID = item.ID
            this.addRoadData.FNoticeTime = item.FNoticeTime
            this.addRoadData.FPlanUseTimes = item.FPlanUseTimes
            console.log(item)
            this.addRoadData.FAllowTimeOut = item.FAllowTimeOut
            //显示弹框时，默认填入时间
            if(show){
                if(item.PatrolCycle == 1){
                    this.timeArr = item.PatrolTime.map(item => {
                        return item[1]
                    })
                }else if(item.PatrolCycle == 2){
                    this.timeArr1 = JSON.parse(JSON.stringify(item.PatrolTime))
                }else if(item.PatrolCycle == 3){
                    this.timeArr2 = JSON.parse(JSON.stringify(item.PatrolTime))
                }
            }else{
                let timeArr = item.PatrolTime.map(item => {
                    return item.join('-')
                })
                this.addRoadData.PatrolTime = timeArr.join(',')
            }
        },
        /**
         * 删除巡更路线
         */
        async deleteRoad(item){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${item.PatrolLineName}`,'删除路线'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Patrol({
                FAction:'DeleteUPatrolLine',
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
            Patrol({
                FAction:'QueryUPatrolLinePoint',
                ID:row.ID,
            })
            .then(data => {
                console.log(data);
                this.points = data.FObject
                this.points.forEach((item, i)=> {
                    this.defaultChecked.push(item.PatrolPointID)
                })
            })
            .catch(error => {
                console.log('错误',error);
            })
        },
        /**
         * 巡更点选择发生改变
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
         * 点击设置巡更点
         */
        beforeSetPoint(){
            if(this.roadObj){
                this.type = 2
                this.showPointTree = true
            }else{
                this.$DeleteMessage(['请选择巡更路线','提示信息'],false)
            }
        },
        /**
         * 设置巡更路线（设置巡更点弹框）
         */
        async setPoint(){
            //修改路线
            if(this.type){
                this.addRoadData.ID = this.roadObj.ID
            }
            let arr = []
            let areaArr = []
            // 遍历获取选中的巡更点
            this.pointData.forEach(item => {
                if(item.IsExist == '1'){
                    arr.push(item.ID)
                }
            })
            if(arr.length === 0){
                this.$message({
                    type:'warning',
                    message:'请选择巡更点'
                })
            }
            this.addRoadData.UPatrolLinePointStr = arr.join(',')
            if(this.type){
                this.updateUPatrolLinePoin(this.roadObj.ID,arr.join(','))
            }else{
                await this.addOrUpdatedRoad(this.type)
                this.showPointTree = false
            }
        },
        /**
         * 179.修改巡更路线巡更点
         */
        updateUPatrolLinePoin(id,points){
            Patrol({
                FAction:'UpdateUPatrolLinePoint',
                ID:id,
                IDStr:points
            })
            .then(data => {
                this.showPointTree = false
                this.changeRoad(this.roadObj)
            })
            .catch(err => {})
        },
        /**
         * 点击上一步
         */
        preStep(){
            this.showPointTree = false
            this.show = true
        },
        /**
         * 改变巡更点或巡更区域顺序
         *
         * @param {Object} startObj 排序时，目标对象
         * @param {Object} endObj 排序时，目标交换对象
         */
        sortRoad(startIDStr,endIDStr){
            Patrol({
                FAction:'UpdateUPatrolLinePointBySortID',
                StartID:startIDStr,
                EndID:endIDStr,
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
            Patrol({
                FAction:'QueryExportPatrolLine',
                SearchKey:this.roadName,
                StartDateTime:this.startDateTime,
                EndDateTime:this.endDateTime,
                PatrolCycle:this.PatrolCycle
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
         *日巡更 ，选择时间
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
            this.timeArr.push(hh+':'+mm)
            this.showPopover = false
        },
        /**
         * 周巡更 ，选择时间
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
            this.timeArr1.push([this.week,hh+':'+mm])
            this.showPopover = false
        },
        /**
         * 月巡更 ，选择时间
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
            this.timeArr2.push([this.month,hh+':'+mm])
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
.report{
    .zw-dialog.patrol-line{
        .el-dialog__body{
            .label{
                width:130px;            }
            .el-input{
                width: 228px;
            }
        }
    }
}
</style>
