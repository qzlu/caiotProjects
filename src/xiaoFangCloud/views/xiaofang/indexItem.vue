<template>
    <div>
        <div class="left-side l">
            <div class="side-content formList">
                 <el-scrollbar>
                     <div :class="['form-item',{alarm:item.isAlarm}]" v-for="item in systemList" :key="item.ID">
                        <zw-card1 :icon="item.IconName" :title="item.FormName">
                            <div slot="header" class="r flex" style="align-items:center;font-size:24px;">
                                <i class="iconfont icon-Equipment" style="font-size:24px;"></i>
                                {{item.DeviceCount||0}}
                            </div>
                            <div style="height:190px;">
                                <statu-box :data='item'></statu-box>
                            </div>
                        </zw-card1>
                     </div>
                 </el-scrollbar>
            </div>
        </div>
        <div class="right-side r">
            <div class="side-content" v-if="formID == 1">
                <div class="table" style="height:100%">
                    <div class="title">
                      <i class="iconfont icon-FireAlarm"></i>
                      实时火警
                      <span class="r" @click="show1 = true;queryHistoryPageAlarm()">历史记录</span>
                    </div>
                    <ul class="table-header">
                        <li v-for="(item,i) in tableLabel1" :key="i" :style="{'width':item.width}">{{item.label}}</li>
                    </ul>
                    <div style="height:calc(100% - 90px)">
                        <el-scrollbar>
                            <ul class="table-body">
                                <li class="clearfix" v-for="(obj,i) in fireAlarmData" :key="i">
                                    <div>
                                        <span v-for="(item,j) in tableLabel1" :key="j" :style="{'width':item.width,color:item.color}" :title="item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]">
                                            {{item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]}}
                                        </span>
                                    </div>
                                    <div class="r" v-if="obj.AlarmState == 0">
                                        <el-button class="submit-alarm"  @click="changeAlarmState(obj,8)">确认告警</el-button>
                                        <el-button  @click="changeAlarmState(obj,7)">误报</el-button>
                                        <el-button  @click="changeAlarmState(obj,0)">解除</el-button>
                                    </div>
                                    <div class="r" v-else-if='obj.OrderState == 4'>
                                        <el-button  @click="dispatchOrder(obj)">派单</el-button>
                                        <el-button  @click="changeAlarmState(obj,0)">解除</el-button>
                                    </div>
                                    <div class="r" v-else>
                                        <el-button @click="queryOrderRecord(obj)">记录</el-button>
                                        <el-button v-if="obj.OrderState == 7" @click="changeAlarmState(obj,0)">解除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="side-content" v-else>
                <zw-table icon='icon-SZXFY-Earlywarning' :pageSize='18' title="实时告警" :width='414' :bodyHeight='800' :labels='tableLabel2' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
        <!-- 派单弹框 -->
        <el-dialog class="zw-dialog" title="派单" append-to-body :visible.sync="show" width="240px">
            <el-select v-model="UserGUID">
                <el-option v-for="(item,i) in userList" :key="i" :value="item.FGUID" :label="item.FContacts"></el-option>
            </el-select>
            <div slot="footer">
                <el-button type="primary" @click="changeAlarmState(order,4)">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 历史记录 -->
        <el-dialog class="zw-dialog" :visible.sync = 'show1' title="历史告警" append-to-body width="910px">
            <div class="clearfix">
                <div class="shuzi-yy r">
                    <el-radio-group v-model="time" @change="selectDate">
                       <el-radio-button label="今日"></el-radio-button>
                       <el-radio-button label="本周"></el-radio-button>
                       <el-radio-button label="本月"></el-radio-button>
                    </el-radio-group>
                    <span style="margin:0 10px">时间段</span>
                    <el-date-picker ref="pick" v-model="time1" type="daterange" @change="queryHistoryPageAlarm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="table" style="margin-top:20px">
                <table style="width:100%;color:white">
                    <thead>
                        <tr>
                            <th v-for="(item,i) in tableLabel3" :width='item.width' :key="i">{{item.label}}</th>
                            <th width='5%'>查看</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in record" :key="i">
                            <td v-for="(obj,j) in tableLabel3" :key="j" :width='obj.width'>{{obj.formatter?obj.formatter.call(null,item[obj.prop]):item[obj.prop]}}</td>
                            <td width='5%' v-if="item.ID" style="cursor:pointer" @click="queryOrderRecord(item)">记录</td>
                            <td width='5%' v-else>--</td>
                        </tr>
                    </tbody>
                </table>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
            </div>
        </el-dialog>
        <!-- 工单记录 -->
        <el-dialog title="工单记录" class="zw-dialog show-detail" top="20px" width="1050px" append-to-body :visible.sync="showDetail">
            <el-scrollbar>
                <div>
                    <div>
                        <p class="title"><span class="icon-title"></span>基本信息</p>
                        <ul class="info" v-if="workInfo">
                            <li class="l">
                                <span class="item-title">告警内容:</span>
                                <span class="item-info">{{workInfo.Data[0].OrderContent}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">告警地址:</span>
                                <span class="item-info">{{workInfo.Data[0].Address}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">告警时间:</span>
                                <span class="item-info">{{workInfo.Data[0].OrderCreateDateTime}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">恢复方式:</span>
                                <span class="item-info">{{workInfo.OrderStateName}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">恢复时间:</span>
                                <span class="item-info">{{workInfo.Data[0].RecoveryTime}}</span>
                            </li>
                        </ul>
                    </div>
                    <div style="margin-top:39px;">
                        <p class="title"><span class="icon-title"></span>工单进度</p>
                        <ul class="progress clearfix" v-if="workInfo">
                            <li class="clearfix" v-for="(item,index) in workInfo.OrderStateList" :key="index">
                                <div v-if="item.OrderState !=='处理'">
                                    <div class="l area-name">
                                        <div>
                                            <span>{{item.OrderState}}</span>
                                            <div :class="['circle',{'finish':item.Date,'waiting':!item.Date}] ">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                        <div class="border r"></div>
                                    </div>
                                    <ul class="area-info clearfix">
                                        <li class="l "><span>{{item.OrderUserName}}　</span>{{item.Date}}</li>
                                    </ul>
                                </div>
                                <div  v-else style="display:flex">
                                    <div class="l area-name">
                                        <div>
                                            <span>{{item.OrderState}}</span>
                                            <div :class="['circle',{'finish':item.Date,'waiting':!item.Date}] ">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                        <div class="border r" style="height: calc(100% - 24px)"></div>
                                    </div>
                                    <div class="clearfix collapse" >
                                        <el-collapse accordion v-if="item.Date">
                                          <el-collapse-item name="1">
                                            <template slot="title">
                                                <ul class="area-info clearfix">
                                                    <li class="l "><span>{{item.OrderUserName}}　</span>{{item.Date}}</li>
                                                </ul>
                                            </template>
                                            <div class="collapse-content">
                                                <div class="collapse-content-item" v-if="workInfo.OrderFiles">
                                                    <h5>处理前</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in workInfo.OrderFiles[0].FilePath.split(',')" :key="img">
                                                            <img :src="'http://www.caszyj.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div class="collapse-content-item" v-if="workInfo.OrderFiles">
                                                    <h5>处理后</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in workInfo.OrderFiles[1].FilePath.split(',')" :key="img">
                                                            <img :src="'http://www.caszyj.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>处理情况</h5>
                                                    <p>{{item.FDescription}}</p>
                                                </div>
                                            </div>
                                          </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-scrollbar>
        </el-dialog>
        <div class="main">
            <div class="device-list">
                <h4>设备总况</h4>
                <div class="type-list">
                    <el-scrollbar>
                        <div class="l" v-for="(item,i) in count" :key="i">
                            <h5 v-if="item.mProjectHomePageShowDevices.length">
                                <i :class="['iconfont',item.IconName]"></i>
                                <span>{{item.DeviceTypeName}}（{{item.mProjectHomePageShowDevices.length}}）</span>
                            </h5>
                            <ul class="device">
                                <li v-for="(device,j) in item.mProjectHomePageShowDevices" :key="j" @click="readDeviceDetail(device)">
                                    <device-params 
                                     :data="device"
                                     :props="{children:'mDeviceHomePageShowPositions',position:'ShowPosition',value:'ShowData'}"
                                    >
                                    </device-params>
                                </li>
                            </ul>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <el-dialog :modal="false" :title="deviceName" top="20px" :visible.sync="show2" width="1576px" class="device-detail-dialog zw-dialog">
            <device-detaile :id="deviceID"></device-detaile>
        </el-dialog>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,zwCard1,statuBox,deviceParams} from '@/components/index.js'
import {HomePage, Orders, Alarm,Project} from '@/xiaoFangCloud/request/api.js'
import leftSide from './leftSide.vue'
import table from '@/xiaoFangCloud/mixins/table.js'
import deviceDetaile from '../shuziYy/deviceDetaile.vue'
import formatDate from '@/utils/formatDate.js'
let orderState = ['','待完成','已完成','待接单','待派单','已逾期','未完成','误报']
export default {
    mixins:[table],
    data(){
        return{
            formID:1,
            count:[],
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:[],
            wariningData:null,
            show1:false,
            showDetail:false,
            show2:false,
            userList:[],
            UserGUID:null,
            order:null,
            workInfo:null,
            time:'今日',
            time1:[new Date(),new Date()],
            record:[],
            alarmTimes:0,
            lastAlarmTime:'',
            colors:['','#1bd1a1', '#73777a', '#0091fe', '#fef500', '#FC0404'],
            statu:{'-1':'下行','1':'上行','0':'停止'}, //电梯状态
            tableLabel:[
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'35%',
                    formatter:(val) => formatDate(val,'YYYY-MM-DD HH:mm')
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'45%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'20%'
                }
            ],
            tableLabel1:[
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'35%',
                    formatter:(val) => formatDate(val,'YYYY-MM-DD HH:mm')
                },
                {
                    label:'告警内容',
                    prop:'OrderContent',
                    width:'50%'
                },
                {
                    label:'当前状态',
                    prop:'OrderState',
                    width:'15%',
                    formatter:(val)=>orderState[val],
                    color:'#FBA31E'
                }
/*                 {
                    label:'类型',
                    prop:'AlarmTypeName',
                    width:'20%'
                } */
            ],
            tableLabel2:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'位置',
                    prop:'AreaName',
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'15%'
                }
            ],
            tableLabel3:[
                {
                    label:'序号',
                    prop:'RowIndex',
                    width:'5%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'20%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'30%'
                },
                {
                    label:'恢复时间',
                    prop:'RecoveryTime',
                    width:'20%'
                },
                {
                    label:'恢复方式',
                    prop:'OrderStateName',
                    width:'20%',
                    /* formatter: val => val == 1?'手动恢复':'自动恢复' */
                }
            ],
            basicInfo:[
                { prop:'DeviceCode	',label:'设备编码'},
                { prop:'Manufacturer',label:'生产厂商'},
                { prop:'City',label:'区域名称'},
                { prop:'FormName',label:'应急系统'},
                { prop:'ProjectName',label:'项目名称'},
                { prop:'Address',label:'项目地址'},
                { prop:'ProjectName',label:'项目安全负责人'},
                { prop:'RegulatoryName',label:'监管单位'},
                { prop:'RegulatoryUser',label:'监管安全负责人'},
                { prop:'PropertyName',label:'物联单位'},
                { prop:'PropertyLeader',label:'物联负责人'},
            ],
            alarmLable:[
                { prop:'AlarmTime',label:'告警时间'},
                { prop:'AlarmTypeName',label:'告警类型'},
                { prop:'ReceivingOrderDateTime',label:'确认时间'},
                { prop:'AlarmState',label:'告警进度'},
                { prop:'IsRecovery',label:'告警状态'},
            ],
            deviceInfo:{},
            deviceAlarmInfo:{},
            deviceEvent:[],
            alarmData:[],
            deviceID:0,
            deviceName:'',
        }
    },
    props:['isOpen'],
    components:{
        number,
        zwTable,
        leftSide,
        zwCard1,
        statuBox,
        deviceParams,
        deviceDetaile
    },
    computed:{
        projectName(){
          return  sessionStorage.getItem('projectName')
        },
        myAudio(){
            return document.getElementById('myAudio')
        }
    },
    watch:{

    },
    created(){
        this.formID = this.$route.params.formID
        this.queryData()
        this.$websocket.onclose = () => {
            this.$initWebSocket()
            this.queryData()
        }
    },
    mounted(){

    },
    beforeDestroy(){
        this.$websocket.close()
    },
    methods:{
        queryData(){
            this.$socket({
                FAction:'QueryOneFormOneProject',
                FormID:this.formID,
                ProjectID:sessionStorage.getItem('projectID')
            },this.handleData)
        },
        handleData(data){
/*             if(data.FAction !="QueryProjectHomePageCount"){
                this.setDeviceStatus(data)
                return
            } */
            /* [this.systemList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject */
            let result = data.FObject
            this.systemList = result.QueryFormData
            this.fireAlarmData = result.ProjectAlarmData
            this.count = result.QueryDeviceListData
            this.systemList.forEach(item => {
                item.isAlarm = item.Data.some(obj => obj.AlarmCount>0)
            })
            console.log(this.systemList)
        },
        /**
         * 设置电梯的状态
         */
        setDeviceStatus(data){
            let device = data.FObject
            if(this.count[0]&&device){
                this.count[0].mProjectHomePageShowDevices.forEach(item => {
                    if(item.DeviceID = device.DeviceID){
                        item.mDeviceHomePageShowPositions[0].ShowData = device.Direction
                        item.mDeviceHomePageShowPositions[1].ShowData = device.Speed
                        item.mDeviceHomePageShowPositions[2].ShowData = device.Floor
                    }
                })
            }
            
        },
        /**
         * 播放报警声
         */
        playWarn(){
            if(this.alarmTimes < 3){
                this.myAudio.play()
                this.alarmTimes ++ //只报警三次
                setTimeout(this.playWarn,3000)
            }
        },
        queryOrderyUser(item){
            console.log(item)
            Orders({
                FAction:'QueryOrderyUser',
                ID:item.OrdersID,
                IDStr:''
            })
            .then((data) => {
                this.userList = data.FObject
                console.log(this.userList)
            }).catch((err) => {
                
            });
        },
        dispatchOrder(row){
            this.show = true
            this.order = row
            this.queryOrderyUser(row)
        },
        async changeAlarmState(row,state){
            const stateText = {0:'确认解除？',7:'确认误报？',8:'确认告警'}
            let text = stateText[state]
            if(text){
                await new Promise((resolve,reject) => {
                    this.$confirm(text, '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        resolve()
                    }).catch(() => {
                        reject()
                    });
                })
            }
            this.show = false
            Orders({
                FAction:'UpdateOrderState',
                ID:row.OrdersID,
                FState:state,
                UserGUID:this.UserGUID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        selectDate(val){
            const end = new Date();
            if(val === '今日'){
                const start = new Date();
                this.time1 = [new Date(start.toLocaleDateString()),end]
            }else if(val === '本周'){
                const start = new Date(new Date().toLocaleDateString()).getTime() - 3600*1000 *24*(new Date().getDay()-1);
                this.time1 = [new Date(start),end]
            }else{
                const start = new Date(new Date().toLocaleDateString()).getTime() - 3600*1000 *24*(new Date().getDate()-1);
                this.time1 = [new Date(start),end]
            }
            this.queryHistoryPageAlarm()
        },
        /**
         * 查询工单记录
         */
        queryOrderRecord(row){
            Orders({
                FAction:'QueryOrderRecord',
                ID:row.OrdersID
            })
            .then((data) => {
                this.workInfo = data.FObject
                this.workInfo.OrderStateName = row.OrderStateName
                this.showDetail = true      
            }).catch((err) => {
                
            });
        },
        queryHistoryPageAlarm(){
            Alarm({
                FAction:'QueryHistoryPageAlarm',
                StartDateTime:this.time1[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time1[1].toLocaleDateString() + ' 23:59',
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                console.log(data)
                this.total = data.FObject.FTotalCount||0
                this.record = data.FObject.Data
            }).catch((err) => {
                
            });
        },
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryHistoryPageAlarm()
        },
        /**
         * 获取设备详情
         */
        queryDeviceBasisInfo(id){
            HomePage({
                FAction:'QueryDeviceBasisInfo',
                DeviceID:id
            })
            .then((result) => {
                this.deviceInfo = result.FObject[0]||{}
                console.log(result)
            }).catch((err) => {
                
            });
        },
        /**
         * 546.设备详情--查询告警详情
         */
        queryAlarmInfo(id){
            HomePage({
                FAction:'QueryAlarmInfo',
                DeviceID:id
            })
            .then((result) => {
                this.deviceAlarmInfo = result.FObject[0]||{}
                console.log(result)
            }).catch((err) => {
                
            });
        },
        /**
         * 查询设备大事记
         */
        queryUDeviceEvents(id){
            Project({
                FAction:'QueryUDeviceEvents',
                DeviceID:id
            })
            .then((data) => {
                this.deviceEvent = data.FObject.reverse()
            }).catch((err) => {
            });
        },
        /**
         * 查看设备详情
         */
        readDeviceDetail(data){
            this.show2 = true
            this.deviceID = data.DeviceID
            this.deviceName = data.DeviceName
        }

    },
    beforeDestroy(){
    
    }
}
</script>
<style lang="scss" scoped>
.left-side{
    .formList{
        .form-item{
            background: rgba(5, 34, 86, 0.4);
            -webkit-box-shadow: 0 0 8px 8px #052256 inset;
            box-shadow: inset 0 0 8px 8px #052256;
            border-radius: 10px 6px 6px 10px;
        }
        .form-item+.form-item{
            margin-top: 10px;
        }
        .form-item.alarm{
            background: rgba($color: #560505, $alpha: 0.2);
            box-shadow: 0 0 100px 20px rgba(150, 14, 14, 0.3) inset;
        }
    }
}
    .right-side{
        .side-content{
            .table{
                height: 450px;
                background: rgba($color: #0E1C43, $alpha: 0.62);
                border-radius: 6px;
                .title{
                    text-align: left;
                    padding:19px 0 10px 7px ;
                    font-size: 18px;
                    .iconfont{
                        font-size: 24px;
                    }
                    span.r{
                        margin-right: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        opacity: 0.64;
                    }
                }
                &-header{
                    display: flex;
                    height: 36px;
                    line-height: 36px;
                }
                &-body{
                    li{
                        >div:first-of-type{
                            height: 32px;
                            line-height: 32px;
                            span{
                                display: inline-block;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                        >div:last-of-type.r{
                            margin-right: 20px;
                            padding: 0 0 7px 0;
                            .el-button{
                                width: 60px;
                                height:24px;
                                line-height: 24px;
                                padding: 0;
                                font-size: 12px;
                                background:linear-gradient(90deg,rgba(28,76,137,1),rgba(10,57,113,1),rgba(12,56,106,1),rgba(10,57,113,1),rgba(30,79,141,1));
                                border:1px solid rgba(81, 128, 205, 0.82);
                                border-radius:2px;
                                color: #9EE5F3;
                            }
                            .el-button.submit-alarm{
                                background: linear-gradient(56deg, rgba(105, 18, 32, 1), rgba(139, 27, 44, 1), rgba(176, 52, 70, 1), rgba(135, 26, 43, 1), rgba(105, 18, 32, 1));
                                border: 1px solid rgba(220, 52, 87, 1);
                                box-shadow: 0px 3px 10px 0px rgba(114, 20, 20, 0.36);
                            }
                        }
                    }
                    li:nth-of-type(2n+1){
                        background:rgba(158,229,243,0.2);
                    }
                    li:nth-of-type(2n){
                        background:rgba(7,148,207,0.14);
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
        .show-detail {
            .el-dialog{
                &__title{
                    font-size:18px;
                    font-family:MicrosoftYaHei-Bold;
                    font-weight:bold;
                    color:#AEE4F0;
                }
                .el-dialog__body{
                    height: 760px;
                }
                .title{
                    font-size:18px;
                    color:#AEE4F0;
                    text-align: left;
                    line-height: 30px;
                    .icon-title{
                        width:4px;
                        height:19px;
                        margin-right: 10px;
                        vertical-align: middle;
                        display: inline-block;
                        background:rgba(44,146,252,1);
                    }
                }
                .info{
                    width: 982px;
                    height: 228px;
                    margin-left: 14px;
                    margin-top: 17px;
                    background:rgba(243,246,247,1);
                    border:1px solid rgba(223,221,221,1);
                    border-radius:6px;
                    li{
                        width: 50%;
                        height: 76px;
                        line-height: 76px;
                        box-sizing: border-box;
                        text-align: left;
                        font-size:20px;
                        .item-title{
                            width: 172px;
                            height: 100%;
                            display: inline-block;
                            background: #D9EAF4;
                            text-align: center;
                            color: #000000
                        }
                        .item-info{
                            padding-left: 10px;
                            color: #6D6D6D
                        }
                        .collapse-content{

                        }
                    }
                    li:nth-of-type(3),li:nth-of-type(4){
                        border-top: 2px solid #EDEDED;
                        border-bottom: 2px solid #EDEDED;
                    }
                }
                .progress{
                    width: 990px;
                    margin-top: 14px;
                    padding: 30px 20px 20px 20px;
                    box-sizing: border-box;
                    /* border:1px solid rgba(223,221,221,1); */
                    li:first-of-type,li:last-of-type{
                        .area-name{
                            >div:first-child{
                                height: 30px;
                                line-height: 30px;
                            }
                            span{
                                margin-right: 20px;
                            }
                            .circle{
                                width:30px;
                                height:30px;
                                line-height: 25px;
                                &-inner{
                                    width:22px;
                                    height:22px;
                                }
                            }
                        }
                        .area-info{
                            margin-left: 250px;
                        }
                    }
                    li:last-of-type{
                        .area-name{
                            .border{
                                display: none
                            }
                        }
                    }
                    li{
                        .area-name{
                            >div:first-child{
                                width: 240px;
                                height: 22px;
                                line-height: 22px;
                                display: flex;
                            }
                            span{
                                width:183px;
                                display: inline-block;
                                font-size:20px;
                                font-family:MicrosoftYaHei;
                                font-weight:bold;
                                color:#AEE4F0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                text-align: right;
                                margin-right: 24px;
                            }
                            .circle{
                                width:24px;
                                height:24px;
                                border:1px solid ;
                                box-sizing: border-box;
                                border-radius:50%;
                                vertical-align: middle;
                                line-height: 20px;
                                text-align: center;
                                &-inner{
                                    width:18px;
                                    height:18px;
                                    display: inline-block;
                                    border-radius:50%;
                                    vertical-align: middle;
                                }
                            }
                            .circle.finish{
                                border-color: rgba(0,210,148,1);
                                .circle-inner{
                                    background:rgba(0,210,148,1);
                                }
                            }
                            .circle.error{
                                border-color: #EF0F24;
                                .circle-inner{
                                    background:#EF0F24;
                                }
                            }
                            .circle.running{
                                border-color: #2C92FC;
                                .circle-inner{
                                    background:#2C92FC;
                                }
                            }
                            .circle.waiting{
                                border-color: #D7D3D3;
                                .circle-inner{
                                    background:#D7D3D3;
                                }
                            }
                            .border{
                                width:2px;
                                height:121px;
                                background:rgba(215,211,211,1);
                                border-radius:1px;
                                margin-right: 20px;
                            }
                        }
                        .area-info{
                            position: relative;
                            margin-left: 252px;
                            font-size:20px;
                            font-family:MicrosoftYaHei;
                            font-weight:400;
                            color:#AEE4F0;
                            li{
                                margin-left: 20px;
                            }
                            li.time{
                                margin-top: 28px;
                                text-align: left;
                                color: #6D6D6D;
                                span+span{
                                    margin-left: 28px;
                                }
                            }
                        }
                        .collapse{
                            width: 100%;
                            min-height: 210px;
                            padding-left: 22px;
                            .area-info{
                                margin-left: -12px
                            }
                        }
                        .el-collapse{
                            border: none
                        }
                        .el-collapse-item{
                            .area-name {
                                .circle{
                                    line-height: 18px;
                                }
                            }
                            
                        }
                        .el-collapse-item.is-active{
                            .area-name{
                                .border{
                                   height: 637px;
                                }
                            }
                        }
                        .el-collapse-item__header,.el-collapse-item__wrap{
                            background: none;
                            border: none;
                        }
                        .el-collapse-item__header{
                            height: 20px;
                            span{
                                font-size: 20px;
                            }
                        }
                        .el-collapse-item__arrow.el-icon-arrow-right{
                            font-size: 30px;
                            font-weight: bold;
                            color: #AEE4F0;
                        }
                        .collapse-content{
                            background: #f2f2f2;
                            padding-left: 40px;
                            &-item{
                                h5{
                                    font-size: 16px;
                                    text-align: left;
                                    margin: 10px 0px;
                                    color: #646464
                                }
                                p{
                                    text-align:left;
                                    padding-left:20px;
                                    font-size:18px;
                                    font-weight:bold
                                }
                                img{
                                    width: 110px;
                                    height: 90px;
                                    margin-left: 20px;
                                }
                                table{
                                    margin-left: 20px;
                                    border: 1px solid #f3afaf;
                                    font-size:18px;
                                    font-weight:bold
                                }
                                .table-header{
                                    height: 36px;
                                    line-height: 36px;
                                    background: #f5c8c8;
                                }
                                tr{
                                    border: 1px solid #f3afaf;
                                }
                                td{
                                    height: 36px;
                                    border: 1px solid #f3afaf;
                                }
                                .odd-row{
                                    background: #f9e6e8
                                }
                            }
                        }
                    }
                }
            }
        }

</style>

