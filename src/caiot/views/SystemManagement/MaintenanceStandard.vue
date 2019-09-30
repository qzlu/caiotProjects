<template>
    <div class="report standard-maintenance">
        <div class="l device-type">
            <h3>设备类型</h3>
            <div class="device-container">
                <el-scrollbar>
                    <el-tree
                        :data='deviceData'
                        :props="defaultProps"
                        @node-click='handleClick'
                    >
                        <span slot-scope="{ node, data }">
                            <i class='icon iconfont' :class="data.IconName"></i>
                            <span style="font-size:18px">{{data.DeviceTypeName}}</span>
                        </span>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-item-header">
                <span><img src="/static/image/task/maintenance.png"/>保养标准</span>
                <button class="zw-btn zw-btn-add" @click="add">新增</button>
            </div>
            <!-- 新增检查项弹框 -->
            <el-dialog :title="title" class="zw-dialog" :visible.sync='show1'>
                <div class="container">
                    <ul>
                        <li><span class="label">设备类型</span>　　{{device?device.DeviceTypeName:''}}</li>
                        <li>
                            <span class="label">保养等级</span>
                            <el-select v-model="addStandard.MaintenanceLevel"   placeholder="请选择">
                                <el-option label="一级" value="1"></el-option>
                                <el-option label="二级" value="2"></el-option>
                                <el-option label="三级" value="3"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">保养周期</span>
                            <el-select v-model="addStandard.MaintenanceCycle"  placeholder="请选择">
                                <!-- <el-option label="日" value="1"></el-option> -->
                                <el-option label="月" value="2"></el-option>
                                <el-option label="年" value="3"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">保养时间</span>
                            <div class="date-select"  v-if="addStandard.MaintenanceCycle == 1">
                                <ul class="l clearfix time-content">
                                    <li  style="margin-top:0" v-for="(time, i) in timeArr" :key="i">{{time}}<i class="el-icon-circle-close-outline" @click="deleteTime('timeArr',i)"></i></li>
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
                                                <li v-for="i in 59" :class="{active:mm==i-1}" :key="i" @click="mm=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="mm==i-1">分</span></li>
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
                            <div class="date-select"  v-if="addStandard.MaintenanceCycle == 2">
                                    <ul class="l clearfix time-content">
                                        <li  style="margin-top:0" v-for="(time, i) in timeArr2" :key="i">{{time[0]}}号　{{time[1]}}<i class="el-icon-circle-close-outline" @click="deleteTime('timeArr2',i)"></i></li>
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
                                             <el-scrollbar>
                                                 <ul class="week-select">
                                                     <li v-for="i in 31" :class="{active:date==i}" :key="i" @click="date=i ">{{i}}号</li>
                                                 </ul>
                                             </el-scrollbar>
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
                                                           <li v-for="i in 59" :class="{active:m2==i-1}" :key="i" @click="m2=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="m2==i-1">分</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                             </div>
                                        </div>
                                   </div>
                                  <div class="time-select-footer">
                                     <a @click="showPopover = false">取消</a>
                                     <a @click="selectDate()">确定</a>
                                  </div>
                                </el-popover>
                            </div>
                            <div class="date-select"  v-if="addStandard.MaintenanceCycle == 3">
                                    <ul class="l clearfix time-content">
                                        <li  style="margin-top:0" v-for="(time, i) in timeArr3" :key="i">{{time[0]}}月 {{time[1]}}号　{{time[2]}}<i class="el-icon-circle-close-outline" @click="deleteTime('timeArr3',i)"></i></li>
                                    </ul>
                                <el-popover
                                  placement="bottom"
                                  width="200"
                                  trigger="click"
                                  v-model='showPopover'
                                  popper-class='select-year-popover'
                                 >
                                   <i class="el-icon-circle-plus-outline" slot="reference"></i>
                                   <div class="clearfix">
                                        <div class="l" >
                                             <p class="time-title">选择月份</p>
                                             <el-scrollbar>
                                                    <el-checkbox-group 
                                                      class="wee-select"
                                                      v-model="month"
                                                      :max="11"
                                                      >
                                                      <el-checkbox v-for="i in 12" :label="i" :key="i">{{i}}月</el-checkbox>
                                                    </el-checkbox-group>
                                             </el-scrollbar>
                                        </div>
                                        <div class="l" style="margin-left:6px">
                                             <p class="time-title">选择日期</p>
                                             <el-scrollbar>
                                                 <ul class="week-select">
                                                     <li v-for="i in 31" :class="{active:date3==i}" :key="i" @click="date3=i ">{{i}}号</li>
                                                 </ul>
                                             </el-scrollbar>
                                        </div>
                                        <div class="r" style="width:194px;">
                                             <p class="time-title">选择时间</p>
                                             <div class="clearfix">
                                                 <div class="l time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 24" :class="{active:h3==i-1}" :key="i" @click="h3=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="h2==i-1">时</span></li>
                                                       </ul>
                                                   </el-scrollbar>
                                                 </div>
                                                 <div class="r time-select-main">
                                                   <el-scrollbar>
                                                       <ul class="time-select">
                                                           <li v-for="i in 59" :class="{active:m3==i-1}" :key="i" @click="m3=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="m2==i-1">分</span></li>
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
                            <el-input type="number" v-model="addStandard.FNoticeTime"></el-input>
                        </li>
                        <li>
                            <span class="label">计划工时(小时)</span>
                            <el-input type="number" v-model="addStandard.FPlanUseTimes"></el-input>
                        </li>
                    </ul>
                    <div style="text-align:center">
                        <button class="zw-btn zw-btn-primary"  @click="nextStep">{{type?'确定':'下一步'}}</button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="设置保养内容"  class="zw-dialog" :visible.sync='show2'>
                <div class="container">
                    <ul>
                        <li><span class="label">保养等级</span>　　{{levelTextArr[addStandard.MaintenanceLevel]}}</li>
                    </ul>
                    <div class="content">
                        <p><span class="label">保养内容</span></p>
                        <ul>
                            <li v-for="(content,i) in contentArr">
                                <label>{{i+1}}.</label>
                                <el-input v-model="contentArr[i]" :value="content">
                                    <i slot="suffix" class="el-icon-circle-plus-outline" v-if="i === contentArr.length-1" @click="contentArr.push('')"></i>
                                    <i slot="suffix" class="el-icon-remove-outline" v-if="!(i==0&&contentArr.length===1)" @click="contentArr.splice(i,1)"></i>
                                </el-input>
                            </li>
                        </ul>
                    </div>
                    <div style="text-align:center">
                        <button class="zw-btn zw-btn-primary" v-if="!type" @click="show2 = false ; show1 = true">上一步</button>
                        <button class="zw-btn zw-btn-primary" @click="addOrUpdatedContent">确定</button>
                    </div>
                </div>
            </el-dialog>
            <div class="main-item">
                <el-table
                    :data='tableData'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                    @row-click = 'queryUMaintenanceContent'
                >
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="保养等级">
                      <template slot-scope="scope">
                          <div>
                              {{levelTextArr[scope.row.MaintenanceLevel]}}
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="保养周期">
                      <template slot-scope="scope">
                          <div>
                              {{cycleText[scope.row.MaintenanceCycle]}}
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="MaintenanceRate"
                      label="频次">
                    </el-table-column>
                    <el-table-column
                      prop="MaintenanceDateTime"
                      show-overflow-tooltip
                      label="保养时间">
                      <template slot-scope="scope">
                          <div v-if="scope.row.MaintenanceDateTime">
                             <!--  <span v-if="scope.row.MaintenanceDateTime.split('-')[0] != 0">{{scope.row.MaintenanceDateTime.split('-')[0]}}月</span>
                              <span v-if="scope.row.MaintenanceDateTime.split('-')[1] != 0">{{scope.row.MaintenanceDateTime.split('-')[1]}}号</span> -->
                              <span v-for="time in scope.row.MaintenanceDateTime.split('、')">
                                  <span v-if="time.split('-')[0] != 0">{{time.split('-')[0]}}月</span><span v-if="time.split('-')[1] != 0">{{time.split('-')[1]}}号</span><span>{{time.split('-')[2].slice(0,5)}}</span>
                                  <span>&nbsp;&nbsp;</span>
                              </span>
                          </div>
                      </template>
                    </el-table-column>
                <el-table-column prop="FNoticeTime" label="计划提醒时间" :formatter="(row)=>'提前'+(row.FNoticeTime||0)+'小时'" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FPlanUseTimes" label="计划工时" :formatter="(row)=> (row.FPlanUseTimes||0)+'小时'"  show-overflow-tooltip>
                </el-table-column>
                    <el-table-column
                      prop=""
                      label="操作">
                      <template slot-scope="scoped">
                          <div class="role-operation">
                             <span class="pointer" @click="deleteIStandard(scoped.row)">删除</span>
                             <span class="pointer" @click="editorStandard(scoped.row)">编辑</span>
                          </div>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="main-item-header">
                <span><img src="/static/image/task/maintenance1.png"/>保养内容</span>
            </div>
            <div class="main-item">
                <el-table
                    :data='tableData1'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="保养等级">
                      <template slot-scope="scope">
                          <div>
                              {{levelTextArr[scope.row.MaintenanceLevel]}}
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="MaintenanceDetails"
                      label="检查内容">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="操作">
                      <template slot-scope="scoped">
                          <div class="role-operation">
                             <span class="pointer" @click="deleteIStandardContent(scoped.row)">删除</span>
                              <span class="pointer" @click="editorStandardContent(scoped.row)">编辑</span>
                          </div>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import {system,Maintenance} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
export default {
    mixins:[table],
    data(){
        return{
            deviceData:[], //所有设备类型
            defaultProps:{
                label:'DeviceTypeName',
                children:'DeviceTypes'
            },
            tableData1:[],
            device:null,
            allItem:[],
            show:false,
            checkedItems:[],
            show1:false,
            title:'新增保养标准',
            inspectionItem:'',
            type:0, //0为新增 1编辑
            cycle:'1',
            defaultAddStandard:{
                ProjectID:localStorage.getItem('projectid'),
                DeviceTypeID:'',
                MaintenanceLevel:'1',
                MaintenanceCycle:'2',
                MaintenanceRate:0,
                DateTimeStr:'',
                ContentStr:'',
                FNoticeTime:'',
                FPlanUseTimes:''
            },
            addStandard:{
                ProjectID:localStorage.getItem('projectid'),
                DeviceTypeID:'',
                MaintenanceLevel:'1',
                MaintenanceCycle:'2',
                MaintenanceRate:0,
                DateTimeStr:'',
                ContentStr:'',
                FNoticeTime:'',
                FPlanUseTimes:''
            },
            showPopover:false,
            timeArr:[],
            timeArr2:[],
            hh:null,
            mm:null,
            week:null,
            weekArr:[],
            date:null,
            h2:null,
            m2:null,
            timeArr3:[],
            month:[],
            date3:null,
            h3:null,
            m3:null,
            show2:false,
            levelTextArr:['','一级保养','二级保养','三级保养'],
            cycleText:['','日常','月度','年度'],
            contentArr:[''],
            maintenanceItem:null


        }
    },
    components:{

    },
    computed:{

    },
    watch:{

    },
    created(){
        this.queryDeviceType()
    },
    mounted(){

    },
    methods:{
        /**
         * 获取所有设备类型(20.获取树形设备类型)
         */
        queryDeviceType(){
            system({
                FAction:'QuerySystemDeviceTypeToTree'
            })
            .then(data => {
                this.deviceData = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 183.查询设备保养标准
         */
        queryUMaintenanceStandardsByDeviceTypeID(id){
            Maintenance({
                FAction:'QueryUMaintenanceStandardsByDeviceTypeID',
                DeviceTypeID:id
            })
            .then(data => {
                this.tableData = data.FObject
                console.log(this.tableData);
                this.tableData1 = []
                if(this.tableData[0]){
                    this.queryUMaintenanceContent(this.tableData[0])
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 点击设备时
         */
        handleClick(data){
            if(data.TreeLevel == 2){
                this.device = data
                this.queryUMaintenanceStandardsByDeviceTypeID(data.DeviceTypeID)
            }else{
                this.device = null
            }
        },
        /**
         * 184.查询保养标准内容
         */
        queryUMaintenanceContent(row){
            this.maintenanceItem = row
            Maintenance({
                FAction:'QueryUMaintenanceContent',
                ID:row.ID
            })
            .then(data => {
                this.tableData1 = data.FObject
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 新增或编辑巡检标准
         */
        addOrUpdatedStandards(){
            Maintenance({
                FAction:this.type?'UpdateUMaintenanceStandards':'AddUMaintenanceStandards',
                DeviceTypeID:this.device.DeviceTypeID,
                mUMaintenanceStandards:this.addStandard
            })
            .then(data => {
                this.show1 = false
                this.show2 = false
                this.queryUMaintenanceStandardsByDeviceTypeID(this.device.DeviceTypeID)
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 新增弹框的下一步或确定
         */
        nextStep(){
            if(this.addStandard.MaintenanceCycle==1){
                let arr = this.timeArr.map(item => {
                    return '0-' + '0-' + item
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请选择时间'
                    })
                    return
                }
                this.addStandard.DateTimeStr=arr.join(',')
                this.addStandard.MaintenanceRate = arr.length
            }else if(this.addStandard.MaintenanceCycle==2){
                let arr = this.timeArr2.map(item => {
                   return '0-' + item[0] + '-' + item[1]
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请选择时间'
                    })
                    return
                }
                this.addStandard.DateTimeStr=arr.join(',')
                this.addStandard.MaintenanceRate = arr.length
            }else{
                let arr = this.timeArr3.map(item => {
                   return  item.join('-')
                })
                if(arr.length ===0){
                    this.$message({
                        type:'warning',
                        message:'请选择时间'
                    })
                    return
                }
                this.addStandard.DateTimeStr=arr.join(',')
                this.addStandard.MaintenanceRate = arr.length
            }
            if(this.type){ //编辑标准
                this.addOrUpdatedStandards()
            }else{
                this.show1 = false
                this.show2 = true
            }

        },
        /**
         * 点击新增
         */
        add(){
            if(!this.device){
                this.$message({
                    type:'warning',
                    message:'请选择设备类型'
                })
                return
            }
            this.type = 0
            this.title = '新增保养标准'
            this.addStandard = Object.assign({},this.defaultAddStandard)
            this.addStandard.DeviceTypeID = this.device.DeviceTypeID
            this.timeArr = [], this.timeArr2 = [], this.timeArr3 = [] ,this.contentArr = ['']
            this.show1 =true
            
        },
        /**
         * 点击编辑
         */
        editorStandard(row){
            this.type = 1
            this.title = '编辑保养标准'
            this.addStandard.MaintenanceLevel = row.MaintenanceLevel.toString()
            this.addStandard.MaintenanceCycle = row.MaintenanceCycle.toString()
            this.addStandard.MaintenanceRate = row.MaintenanceRate
            this.addStandard.DateTimeStr = row.MaintenanceDateTime
            this.addStandard.ID = row.ID
            this.addStandard.DeviceTypeID = this.device.DeviceTypeID
            console.log(row)
            this.addStandard.FNoticeTime = row.FNoticeTime
            this.addStandard.FPlanUseTimes = row.FPlanUseTimes
            if(row.MaintenanceCycle == 1){
                this.timeArr = row.MaintenanceDateTime.split('、').map(item => {
                    return item.split('-')[2].slice(0,5)
                })
            }else if(row.MaintenanceCycle == 2){
                this.timeArr2 = row.MaintenanceDateTime.split('、').map(item => {
                    let arr = item.split('-')
                    return [arr[1],arr[2].slice(0,5)]
                })
            }else{
                this.timeArr3 = row.MaintenanceDateTime.split('、').map(item => {
                    let arr = item.split('-')
                    return [arr[0],arr[1],arr[2].slice(0,5)]
                })
            }
            this.show1 =true
        },
        /**
         * 新增或编辑保养标准内容
         */
        addOrUpdatedContent(){
            let contentArr = this.contentArr.filter(item => {
                return item.trim().length>0
            })
            if(contentArr.length === 0){
                this.$message({
                    type:'warning',
                    message:'请填写保养内容'
                })
                return
            }
            this.addStandard.ContentStr = contentArr.join('|')
            if(this.type){
                this.updatedContent()
            }else{
                this.addOrUpdatedStandards()
            }
        },
        /**
         * 修改保养内容
         */
        updatedContent(){
            Maintenance({
                FAction:'UpdateMaintenanceContent',
                ID:this.maintenanceItem.ID,
                ContentStr:this.addStandard.ContentStr
            })
            .then(data => {
                this.show2 = false
                this.queryUMaintenanceContent(this.maintenanceItem)
            })
            .catch(err => {})
        },
        /**
         * 点击编辑标准内容
         */
        editorStandardContent(){
            this.contentArr = this.tableData1.map(item => item.MaintenanceDetails)
            this.addStandard.MaintenanceLevel = this.tableData1[0].MaintenanceLevel
            this.show2 = true
            this.type = 1
        },
        async deleteIStandard(row){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除`,'删除'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Maintenance({
                FAction:'DeleteUMaintenanceStandardsByID',
                ID:row.ID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
                this.queryUMaintenanceStandardsByDeviceTypeID(this.device.DeviceTypeID)
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败！'
                });
            })
        },
        /**
         * 删除保养内容
         */
        async deleteIStandardContent(row){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除`,'删除'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Maintenance({
                FAction:'DeleteUMaintenanceContentByID',
                ID:row.ID
            })
            .then(data => {
                this.queryUMaintenanceContent(this.maintenanceItem)
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败！'
                });
            })
        },
        /**
         *日保养 ，选择时间
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
         * 月度保养 ，选择时间
         */
        selectDate(){
            if(this.date==null||this.h2 == null||this.m2 == null){
                this.$message({
                    type:'warning',
                    message:'请选择时间'
                })
                return
            }
            let  hh = this.h2 <10?'0'+this.h2:this.h2
            let  mm = this.m2 <10?'0'+this.m2:this.m2
            this.timeArr2.push([this.date,hh+':'+mm])
            this.showPopover = false
        },
        /**
         *  年度保养，选择时间
         */
        selectMonth(){
            if(this.month==[]||this.date3==null||this.h3 == null||this.m3 == null){
                this.$message({
                    type:'warning',
                    message:'请选择时间'
                })
                return
            }
            let  hh = this.h3 <10?'0'+this.h3:this.h3
            let  mm = this.m3 <10?'0'+this.m3:this.m3
            let  timeArr = this.month.map(item => [item,this.date3,hh+':'+mm])
            this.timeArr3.push(...timeArr)
            this.showPopover = false
        },
        /**
         * 删除时间
         */
        deleteTime(arr,i){
            this[arr].splice(i,1)
        },
    },
}
</script>
<style lang="scss">
$img-url:'/static/image/';
.standard-maintenance.report{
    padding: 30px 20px 27px 20px;
    .device-type{
        width:333px;
        height:850px;
        border:2px solid #134FA4;
        border-radius:10px 6px 6px 10px;
        h3{
            margin-top: 42px;
            padding-left:30px;
            text-align: left;
            font-size: 20px;
            color: #18A1EC
        }
        .device-container{
            margin-top: 36px;
            .el-tree{
                height: 650px;
                background: none;
                color: #18A1EC;
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                    }
                }
                &-node__content{
                    height: 66px;
                    line-height: 66px;
                    padding-left: 100px!important;
                    .iconfont{
                        vertical-align: middle;
                        font-size: 24px
                    }
                }
                &-node__content:hover {
                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                }
                .el-tree-node__label{
                    font-size: 17px;
                }
                .el-tree-node__expand-icon{
                    font-size: 20px;
                }
            }
            .el-tree.checked {
                color: #a0a0a3;
            }
        }
    }
    .main{
        margin-left: 337px;
        height: 100%;
        &-item-header{
            height: 55px;
            line-height: 55px;
            text-align: left;
            padding-left: 51px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            span{
                color: #18A1EC;
                font-size: 16px;
                img{
                    vertical-align: middle;
                    margin-right: 10px;
                }
                margin-right: 30px;
            }
            .import{
                width: 148px;
                padding-left: 30px;
                background: url(#{$img-url}task/import.png)
            }
            .import:hover,.import:active{
                background: url(#{$img-url}task/import-1.png)
            }
        }
        &-item{
            padding: 0 30px;
        }
    }
    .el-dialog{
        width: 480px;
        background: url(#{$img-url}task/inspection.png);
        background-size: 100% 100%;
        .container{
            margin-top: 20px;
            >ul>li{
                margin-top: 15px;
            }
            p{
                span{
                    margin-right: 20px;
                }
            }
            .label{
                width: 130px;
                display: inline-block;
                text-align: right
            }
            .el-input{
                width: 165px;
                height: 39px;
                line-height: 39px;
                margin-left: 10px;
                &__inner{
                    background:rgba(24,64,107,1);
                    border:1px solid rgba(5,103,158,1);
                }
            }
            .content{
                margin: 20px 0px;
                >ul{
                    margin-top: 20px;
                    margin-left: 28px;
                    li+li{
                        margin-top: 10px;
                    }
                    .el-input{
                       width: 220px;
                    }
                    [class*="el-icon"]{
                        cursor: pointer;
                    }
                    .el-icon-remove-outline{
                        margin-left: 10px
                    }    
                }
            }
        }
        .zw-btn{
            margin-top: 20px;
        }
    }
}
// 时间选择popover
.date-select{
    display: inline-block;
    width:204px;
    height: 39px;
    line-height: 39px;
    margin-left: 10px;
    background:rgba(24,64,107,1);
    border:1px solid rgba(5,103,158,1);
    border-radius: 4px;
    padding-left: 4px;
    padding-right: 20px;
    >span{
        position: relative;
        left: 208px;
    }
    .time-content{
        position: absolute;
        width: 204px;
        height: 39px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        li{
            position: relative;
            margin-right: 20px;
            display: inline-block;
            .el-icon-circle-close-outline{
                width: 14px;
                height: 14px;
                position: absolute;
                cursor: pointer;
            }
        }
    }
}
.el-popover.select-time-popover{
    width: 150px!important;
    padding: 0;
    border-radius: 0px;
}
.el-popover.select-week-popover{
    width: 296px!important;
    padding: 0;
    border-radius: 0px;
    background: none;
}
.el-popover.select-year-popover{
    width: 400px!important;
    padding: 0;
    border-radius: 0px;
    background: none;
}
.week-select,.el-checkbox-group.wee-select{
    width: 97px;
    height: 100px;
    text-align: center;
    background: #ffffff;
    li,.el-checkbox{
        width: 100%;
        height: 33px;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
        background: #ffffff;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0;
    }
    li.active{
        background: #2194FF
    }
}
.time-title{
   height: 30px;
   line-height: 30px;
   text-align: center;
   font-size: 14px;
   color: #525E7E;
   background: #DEDBDB
}
.time-select-main{
    width: 50%;
    background: #ffffff;
}
.time-select{
    height: 90px;
    margin-right: 2px;
    .active{
        background: #2194FF
    }
    li{
        height: 33px;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
    }
}
.time-select-footer{
    text-align: right;
    height: 30px;
    line-height: 30px;
    background: #DEDBDB;
    a{
        padding: 10px;
        cursor: pointer;
    }
    a:last-of-type{
        color: #409EFF
    }
}
</style>
