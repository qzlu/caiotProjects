<template>
    <div class="standard">
        <div class="l device-type">
            <h3 v-if="userType != 1"><el-button type="primary"  @click="importMaintenance">导入标准</el-button></h3>
            <h3>设备类型</h3>
            <div class="device-container">
                <el-scrollbar>
                    <el-tree
                        :data='deviceData'
                        :props="defaultProps"
                        @node-click='handleClick'
                    >
                    <template v-slot="{ node, data }">
                        <span style="display:flex;align-items:center">
                            <i class='icon iconfont' :class="data.IconName"></i>
                            <span style="font-size:18px">{{data.SystemParamName||data.DeviceTypeName}}</span>
                        </span>
                    </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-item-header">
                <span><img src="@/caiot/static/image/task/maintenance.png"/>保养标准</span>
                <el-button  @click="add">新增</el-button>
            </div>
            <!-- 新增检查项弹框 -->
            <el-dialog :title="title" class="zw-dialog standard-dialog" width="480px" append-to-body :visible.sync='show1'>
                <div class="container">
                    <ul>
                        <li><span class="label">设备类型</span>　　{{device?device.DeviceTypeName:''}}</li>
                        <li>
                            <span class="label">保养等级</span>
                            <el-select v-model="addStandard.FMaintenanceLevel"   placeholder="请选择">
                                <el-option label="一级" value="1"></el-option>
                                <el-option label="二级" value="2"></el-option>
                                <el-option label="三级" value="3"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">保养周期</span>
                            <el-select v-model="addStandard.FMaintenanceCycle"  placeholder="请选择">
                                <!-- <el-option label="日" value="1"></el-option> -->
                                <el-option label="月" value="2"></el-option>
                                <el-option label="季度" value="4"></el-option>
                                <el-option label="半年" value="5"></el-option>
                                <el-option label="年" value="3"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <span class="label">保养时间</span>
                            <div class="date-select"  v-if="addStandard.FMaintenanceCycle == 1">
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
                            <div class="date-select"  v-else-if="addStandard.FMaintenanceCycle == 2">
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
                            <div class="date-select"  v-else>
                                    <ul class="l clearfix time-content">
                                        <li  style="margin-top:0" v-for="(time, i) in timeArr3" :key="i">{{time[0]}}月 {{time[1]}}号　{{time[2]}}<i class="el-icon-error" @click="deleteTime('timeArr3',i)"></i></li>
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
<!--                         <li>
                            <span class="label">计划提醒时间(小时)</span>
                            <el-input type="number" v-model="addStandard.FNoticeTime"></el-input>
                        </li>
                        <li>
                            <span class="label">计划工时(小时)</span>
                            <el-input type="number" v-model="addStandard.FPlanUseTimes"></el-input>
                        </li> -->
                    </ul>
                </div>
                <div slot="footer">
                    <el-button class="zw-btn zw-btn-primary"  @click="nextStep">{{type?'确定':'下一步'}}</el-button>
                </div>
            </el-dialog>
            <el-dialog title="设置保养内容" append-to-body width="480px"  class="zw-dialog standard-dialog" :visible.sync='show2'>
                <div class="container">
                    <ul>
                        <li><span class="label">保养等级</span>　　{{levelTextArr[addStandard.FMaintenanceLevel]}}</li>
                    </ul>
                    <div class="content">
                        <p><span class="label">保养内容</span></p>
                        <ul>
                            <li v-for="(content,i) in contentArr" :key="i">
                                <label>{{i+1}}.</label>
                                <el-input v-model="contentArr[i]" :value="content">
                                    <i slot="suffix" class="el-icon-circle-plus-outline" v-if="i === contentArr.length-1" @click="contentArr.push('')"></i>
                                    <i slot="suffix" class="el-icon-remove-outline" v-if="!(i==0&&contentArr.length===1)" @click="contentArr.splice(i,1)"></i>
                                </el-input>
                            </li>
                        </ul>
                    </div>
                </div>
                <div slot="footer">
                    <el-button class="zw-btn zw-btn-primary" v-if="!type" @click="show2 = false ; show1 = true">上一步</el-button>
                    <el-button class="zw-btn zw-btn-primary" @click="addOrUpdatedContent">确定</el-button>
                </div>
            </el-dialog>
            <div class="main-item zhiwei-table">
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
                              {{levelTextArr[scope.row.FMaintenanceLevel]}}
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="保养周期">
                      <template slot-scope="scope">
                          <div>
                              {{cycleText[scope.row.FMaintenanceCycle]}}
                          </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="FMaintenanceRate"
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
<!--                 <el-table-column prop="FNoticeTime" label="计划提醒时间" :formatter="(row)=>'提前'+(row.FNoticeTime||0)+'小时'" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="FPlanUseTimes" label="计划工时" :formatter="(row)=> (row.FPlanUseTimes||0)+'小时'"  show-overflow-tooltip>
                </el-table-column> -->
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
                <span><img src="@/caiot/static/image/task/maintenance1.png"/>保养内容</span>
            </div>
            <div class="main-item zhiwei-table">
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
                              {{levelTextArr[scope.row.FMaintenanceLevel]}}
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
import './InspectionStandard.scss';
export default {
    data(){
        return{
            deviceData:[], //所有设备类型
            defaultProps:{
                label:'DeviceTypeName',
                children:'ListData'
            },
            tableData:[],
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
            userType:sessionStorage.getItem('FUserType'),
            defaultAddStandard:{
                ProjectID:localStorage.getItem('projectid'),
                DeviceTypeID:'',
                FMaintenanceLevel:'1',
                FMaintenanceCycle:'2',
                FMaintenanceRate:0,
                DateTimeStr:'',
                ContentStr:'',
            },
            addStandard:{
                ProjectID:localStorage.getItem('projectid'),
                DeviceTypeID:'',
                FMaintenanceLevel:'1',
                FMaintenanceCycle:'2',
                FMaintenanceRate:0,
                DateTimeStr:'',
                ContentStr:'',
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
            cycleText:['','日常','月度','年度','季度','半年'],
            contentArr:[''],
            maintenanceItem:null,
            standardType:1 //1为任务管理下的保养标准 ， 2//标准配置下的保养标准


        }
    },
    components:{

    },
    computed:{

    },
    watch:{

    },
    created(){
        this.standardType = this.$route.params.id
        this.queryDeviceType()
    },
    mounted(){

    },
    methods:{
        /**
         * 获取所有设备类型
         */
        queryDeviceType(){
            this.$post('/QuerySystemDeviceTypeToTree')
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
            this.$post('/QueryMaintenanceStandards',{
                FAction:this.standardType == 1 ? 'QueryUMaintenanceStandardsByDeviceTypeID':'QueryUBasisMaintenanceStandardsByDeviceTypeID',
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
            if(data.DeviceTypeID){
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
            this.$post('/QueryMaintenanceContent',{
                FGUID:row.FGUID
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
            this.addStandard.DeviceTypeID = this.device.DeviceTypeID
            this.$post('/AddOrUpdateMaintenanceStandards',{
                DeviceTypeID:this.device.DeviceTypeID,
                ...this.addStandard
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
            if(this.addStandard.FMaintenanceCycle==1){
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
                this.addStandard.FMaintenanceRate = arr.length
            }else if(this.addStandard.FMaintenanceCycle==2){
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
                this.addStandard.FMaintenanceRate = arr.length
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
                this.addStandard.FMaintenanceRate = arr.length
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
            console.log(this.device);
            if(!this.device||!this.device.DeviceTypeID){
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
            this.addStandard.FMaintenanceLevel = row.FMaintenanceLevel.toString()
            this.addStandard.FMaintenanceCycle = row.FMaintenanceCycle.toString()
            this.addStandard.FMaintenanceRate = row.FMaintenanceRate
            this.addStandard.DateTimeStr = row.MaintenanceDateTime
            this.addStandard.ID = row.ID
            this.addStandard.DeviceTypeID = this.device.DeviceTypeID
            console.log(row)
            this.addStandard.FNoticeTime = row.FNoticeTime
            this.addStandard.FPlanUseTimes = row.FPlanUseTimes 
            if(row.FMaintenanceCycle == 1){
                this.timeArr = row.MaintenanceDateTime.split('、').map(item => {
                    return item.split('-')[2].slice(0,5)
                })
            }else if(row.FMaintenanceCycle == 2){
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
         * 导入保养标准
         */
        async importMaintenance(){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要导入保养标准`,'导入保养标准'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Maintenance({
                FAction: 'ImportUMaintenanceStandards'
            })
            .then((result) => {
                if(this.device.DeviceTypeID){
                    this.queryUMaintenanceStandardsByDeviceTypeID(this.device.DeviceTypeID)
                }
                console.log(12)
                this.$message({
                    message: '导入成功',
                    type: 'success'
                })
            }).catch((err) => {
                console.log(err)
                this.$message({
                    message: '导入失败',
                    type: 'error'
                })
            });
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
            this.$post('/UpdateMaintenanceContent',{
                FGUID:this.maintenanceItem.FGUID,
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
            this.addStandard.FMaintenanceLevel = this.tableData1[0].FMaintenanceLevel
            this.show2 = true
            this.type = 1
        },
        async deleteIStandard(row){
            await this.$confirm(`此操作将删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.$post('/DeleteMaintenanceStandards',{
                FGUID:row.FGUID
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
            await this.$confirm(`此操作将删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.$post('/DeleteMaintenanceContent',{
                FGUID:row.FGUID
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
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
              return 'odd-row';
            } else if (rowIndex%2 === 0) {
              return 'even-row';
            }
        },
    },
}
</script>
<style lang="scss">
.standard-dialog{
.el-dialog{
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
            text-align: right;
            vertical-align: middle;
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
            .el-icon-error{
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
