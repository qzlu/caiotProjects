<template>
    <div class="monitor-data flex">
        <div class="monitor-data-left">
          <h4>实时监测</h4>
<!--           <h5>
            {{deviceDataItemInfo.DeviceName}}
            <i class="r el-icon-star-off"></i>
          </h5>
          <div class="device-param">
            <ul>
              <li :class="`param-${item.SDataID}`" v-for="item in DataDetail" :key="item.SDataID">
                <el-tooltip placement="top center" effect="light">
                  <div slot="content">
                    <span v-for="(value, i) in item.SDataValue" :key="i" class="value">
                      {{value.DValue}}
                      <i v-if="i<item.SDataValue.length-1">/</i>
                    </span>
                  </div>
                  <p>
                    <span v-for="(value, i) in item.SDataValue" :key="i" class="value">
                      {{value.DValue}}
                      <i v-if="i<item.SDataValue.length-1">/</i>
                    </span>
                  </p>
                </el-tooltip>
                <p class="value-label">
                  {{item.SDataTitle}}
                  <span v-if="item.SDataUnit">({{item.SDataUnit}})</span>
                </p>
              </li>
            </ul>
            <div class="device-status">
              <p>
                <i :class="['icon','iconfont','icon-Watertank']"></i>
              </p>
              <p>{{"在线"}}</p>
            </div>
          </div> -->
          <div style="height:300px;padding-left:20px;">
              <device-params 
              :data="deviceDataItemInfo" 
              :showBorder="false"
              :showActive = "true" 
              @data-item-click="selectItem"
              :props="{icon:'WebIconName',label:'SDataTitle',statuText:'DeviceStatusTitle',statu:'DeviceStatus'}"></device-params>
          </div>
          <h4>基本信息</h4>
          <ul class="device-info">
            <li v-for="(item,i) in basicInfo" :key="i">
              <span class="label" style="width:120px;">{{item.label}}:</span>
              <span class="value">{{deviceInfo[item.prop]}}</span>
            </li>
          </ul>
        </div>
        <div class="monitor-data-border" style="margin-top:84px;"></div>
        <div class="monitor-data-center">
          <div class="monitor-data-center-top">
            <line-chart v-if="deviceDataItemInfo.DeviceTypeID !=500&&lineData.columns&&lineData.columns.length>0" :data='lineData' :color='["#FBA31E","#5FCDF2","#FF3600"]'></line-chart>
            <el-table v-if="deviceDataItemInfo.DeviceTypeID ==500" :data="alarmData" height="234" v-loadmore="loadMore">
              <el-table-column prop="FDateTime" label="时间" width="160"></el-table-column>
              <el-table-column prop="eventTypeName" label="告警类型" width="120"></el-table-column>
              <el-table-column prop="DeviceName" label="设备名称"></el-table-column>
              <el-table-column prop="addr" label="设备地址"></el-table-column>
            </el-table>
          </div>
          <h4>告警详情</h4>
          <ul class="alarm-info">
            <li v-for="(item,i) in alarmLable" :key="i">
              <span class="label" style="width:120px;">{{item.label}}:</span>
              <span class="value">{{item.formatter?item.formatter(deviceAlarmInfo[item.prop]):deviceAlarmInfo[item.prop]}}</span>
            </li>
          </ul>
          <div class="circle-btn-list flex" v-if="formID == 2">
            <div class="circle-btn">
              实时
              <br />拍照
            </div>
            <div class="circle-btn">
              语音
              <br />连接
            </div>
          </div>
          <div class="btn-list flex" v-if="deviceAlarmInfo.AlarmState == 0&&deviceAlarmInfo.IsRecovery != 1">
            <el-button class="submit-alarm" @click="changeAlarmState(deviceAlarmInfo,8)">确认告警</el-button>
            <el-button class="cancle-alarm" @click="changeAlarmState(deviceAlarmInfo,7)">误报取消</el-button>
            <el-button class="cancle-alarm" @click="changeAlarmState(deviceAlarmInfo,0)">告警解除</el-button>
          </div>
        </div>
        <div class="monitor-data-border" style="margin-top:35px;"></div>
        <div class="monitor-data-right">
          <h4>大事记</h4>
          <div class="event-record">
            <el-scrollbar>
              <ul>
                <li v-for="(item,i) in deviceEvent" :key="i">
                  <p class="event-text">{{item.EventsText}}</p>
                  <div class="icon-time">
                    <p
                      class="event-time"
                      :title="item.EventsTime&&item.EventsTime.split(' ')[0]"
                    >{{item.EventsTime&&item.EventsTime.split(' ')[0]}}</p>
                    <div>
                      <div class="circle"></div>
                      <div class="line"></div>
                    </div>
                  </div>
                  <div class="event-item">
                    <i :class="['iconfont',item.WebIconName]"></i>
                  </div>
                </li>
                <li>
                  <div class="event-year">{{new Date().getFullYear()}}</div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
    </div>
</template>
<script>
import {HomePage, Orders, Alarm,Project} from '@/xiaoFangCloud/request/api.js'
import {deviceParams} from '@/components/index.js'
import {lineChart} from '@/components/index.js'
const orderState={
  1:'待完成',
  2:'已完成',
  3:'待接单',
  4:'待派单',
  5:'已逾期',
  6:'未完成',
  7:'误报',
  8:'转单'
}
const AlarmState = {
    0:'未恢复',
    1:'已恢复'
}
export default {
    data(){
        return {
           basicInfo:[
                { prop:'DeviceCode	',label:'设备编码'},
                { prop:'Manufacturer',label:'生产厂商'},
                { prop:'City',label:'区域名称'},
                { prop:'FormName',label:'应急系统'},
                { prop:'ProjectName',label:'项目名称'},
                { prop:'Address',label:'项目地址'},
                /* { prop:'ProjectName',label:'项目安全负责人'}, */
                { prop:'RegulatoryName',label:'监管单位'},
                { prop:'RegulatoryUser',label:'监管安全负责人'},
                { prop:'PropertyName',label:'物联单位'},
                { prop:'PropertyLeader',label:'物联负责人'},
            ],
            alarmLable:[
                { prop:'AlarmTime',label:'告警时间'},
                { prop:'AlarmTypeName',label:'告警类型'},
                { prop:'ReceivingOrderDateTime',label:'确认时间'},
                { prop:'AlarmState',label:'告警进度',formatter:value => orderState[value]},
                { prop:'IsRecovery',label:'告警状态',formatter:value => AlarmState[value]},
            ],
            deviceInfo:{},
            DataDetail:[],
            deviceAlarmInfo:{},
            deviceEvent:[],
            alarmData:[],
            formID:1,
            deviceDataItemInfo:{},
            pageIndex:1,
            showPosition:0,
            activeItem:{},
            lineData:{}
        }
    },
    props:{
        id:{
            default:0
        },
        projectId:{
        }
    },
    components:{
        deviceParams,
        lineChart
    },
    watch:{
        id(value){
            this.queryData()
        },
        projectId(){
            this.queryData()
        }
    },
    created(){
        this.formID = this.$route.params.formID
        this.queryData()
    },
    beforeDestroy(){

    },
    methods:{
        queryData(){
            this.getPrjSingleAreaDeviceInfo()
            this.queryDeviceBasisInfo()
            this.queryAlarmInfo()
            this.queryUDeviceEvents()
        },
        getPrjSingleAreaDeviceInfo(){
            HomePage({
                FAction:'GetPrjSingleAreaDeviceInfo',
                DeviceID:this.id,
                ProjectID:this.projectId||sessionStorage.getItem('projectID')
           })
           .then((result) => {
                this.deviceDataItemInfo = result.FObject[0] || {}
                if(this.deviceDataItemInfo.DeviceTypeID !=500){
                    let dataItem = this.deviceDataItemInfo.DataDetail&&this.deviceDataItemInfo.DataDetail[0]
                    if(dataItem){
                        this.selectItem(dataItem)
                    }
                }else{
                    this.queryUAlarmByDate()
                }

           }).catch((err) => {
               
           });
        },
        /**
         * 获取设备详情
         */
        queryDeviceBasisInfo(){
            HomePage({
                FAction:'QueryDeviceBasisInfo',
                DeviceID:this.id,
                ProjectID:this.projectId||sessionStorage.getItem('projectID')
            })
            .then((result) => {
                this.deviceInfo = result.FObject[0]||{}
                console.log(result)
            }).catch((err) => {
                
            });
        },
        loadMore(){
            this.pageIndex ++
            this.queryUAlarmByDate(true)
        },
        /**
         * 546.设备详情--查询告警详情
         */
        queryAlarmInfo(){
            HomePage({
                FAction:'QueryAlarmInfo',
                DeviceID:this.id,
                ProjectID:this.projectId||sessionStorage.getItem('projectID')
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
        queryUDeviceEvents(){
            Project({
                FAction:'QueryUDeviceEvents',
                DeviceID:this.id,
                ProjectID:this.projectId||sessionStorage.getItem('projectID')
            })
            .then((data) => {
                this.deviceEvent = data.FObject
            }).catch((err) => {
            });
        },
        async changeAlarmState(row,state){
            if(state ==7 || state == 0){
                let text = state == 7 ? '确认误报？':'确认解除？'
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
        selectItem(item){
            if(this.deviceDataItemInfo.DeviceTypeID !=500){
                /* this.queryUAlarmByDate(item.ShowPosition) */
                this.activeItem = item
                this.queryLineData()
            }
        },
        queryUAlarmByDate(scroll = false){
            if(!scroll){
              this.pageIndex = 1
            }
            Alarm({
                FAction:'QueryUAlarmByDate',
                ID:this.deviceDataItemInfo.DeviceID,
                FDateTime:new Date().toLocaleDateString(),
                FType:0,
                PageIndex:this.pageIndex,
                PageSize:20
            })
            .then((data) => {
                if(scroll){
                    if(data.FObject.length>0){
                        this.alarmData.push(...data.FObject)
                    }else{
                        this.pageIndex --
                    }
                }else{
                    this.alarmData  = data.FObject
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 查询曲线图数据
         */
        queryLineData(){
            HomePage({
                FAction:"GetDeviceDataItemChartData",
                ProjectID:this.projectId||sessionStorage.getItem('projectID'),
                DeviceID:this.deviceDataItemInfo.DeviceID,
                PossionID:this.activeItem.SDataID
            })
            .then((result) => {
                console.log(result)
                let chartData = {
                    name:[],
                    columns:[],
                    rows:{}
                },
                arr = result.FObject
                chartData.name = arr.map(item => item.DataItemName)
                chartData.columns = arr[0]&&arr[0].ProjectChartLineDatas.map(item => item.X)
                chartData.rows = arr.map(item => {
                    let yAxis = item.ProjectChartLineDatas.map(obj => obj.Y)
                    return {
                      type: "line",
                      name: item.DataItemName,
                      data: yAxis
                    };
                }) 
                this.lineData = chartData
            }).catch((err) => {
                console.log('dd',err)
            });
        },
    }
};
</script>
<style lang="scss">
.device-detail-dialog.zw-dialog {
    .el-dialog__body {
        padding: 0;

        .monitor-data {
            height: 927px;
            color: #BDE3EE;
            text-align: left;

            h4 {
                font-size: 18px;
                font-weight: 400;

                &:before {
                    content: '';
                    display: inline-block;
                    width: 4px;
                    height: 12px;
                    margin-right: 10px;
                    background: rgba(189, 227, 238, 1);
                }
            }

            &-left {
                width: 432px;
                height: 100%;
                padding-right: 35px;
                box-sizing: border-box;

                h4 {
                    margin-top: 27px;
                    padding-left: 50px;
                }

                h5 {
                    margin-top: 20px;
                    padding-left: 40px;
                    font-size: 16px;
                    color: #525E7E;

                    i {
                        font-size: 24px;
                        color: #2A91FC;
                        cursor: pointer;
                    }
                }
                .device-info {
                    margin-top: 14px;

                    li {
                        width: 100%;
                        padding-left: 53px;
                        line-height: 40px;
                        box-sizing: border-box;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        .label {
                            display: inline;
                        }
                    }
                }
            }

            &-border {
                width: 3px;
                height: 753px;
                background: linear-gradient(180deg, rgba(9, 38, 75, 1), rgba(60, 114, 181, 1), rgba(21, 67, 123, 1), rgba(60, 114, 181, 1), rgba(7, 34, 73, 1));
                opacity: 0.59;
            }

            &-center {
                padding: 70px 25px 0;
                width: 660px;
                height: 100%;
                box-sizing: border-box;

                &-top {
                    height: 300px;
                }

                .alarm-info {
                    height: 200px;
                    margin-top: 14px;
                    overflow: hidden;

                    li {
                        line-height: 40px;

                        .label {
                            display: inline;
                        }
                    }
                }

                .circle-btn-list {
                    margin-top: 50px;
                    justify-content: center;

                    .circle-btn {
                        width: 78px;
                        height: 94px;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        color: #A5EFFC;
                        box-shadow: 0 0 15px #4782BB inset;
                        border-radius: 50%;
                        cursor: pointer;

                        &:after {
                            content: '';
                            width: 88px;
                            height: 104px;
                            border: 2px solid #4782BB;
                            border-radius: 50%;
                            position: absolute;
                            top: -7px;
                            left: -7px;
                        }

                        &:hover {
                            font-size: 16px;
                        }
                    }

                    .circle-btn+.circle-btn {
                        margin-left: 80px;
                    }
                }

                .btn-list {
                    margin-top: 62px;
                    justify-content: center;

                    .el-button {
                        width: 110px;
                        height: 42px;
                        border-radius: 4px;
                        color: #A5EFFC;
                        font-size: 16px;
                    }

                    .el-button+.el-button {
                        margin-left: 30px;
                    }

                    .submit-alarm {
                        background: linear-gradient(56deg, rgba(105, 18, 32, 1), rgba(139, 27, 44, 1), rgba(176, 52, 70, 1), rgba(135, 26, 43, 1), rgba(105, 18, 32, 1));
                        border: 1px solid rgba(220, 52, 87, 1);
                        box-shadow: 0px 3px 10px 0px rgba(114, 20, 20, 0.36);
                    }

                    .cancle-alarm {
                        background: linear-gradient(90deg, rgba(28, 76, 137, 1), rgba(10, 57, 113, 1), rgba(12, 56, 106, 1), rgba(10, 57, 113, 1), rgba(30, 79, 141, 1));
                        border: 1px solid rgba(81, 128, 205, 0.82);
                    }
                }
            }

            &-right {
                width: 478px;
                height: 100%;

                h4 {
                    margin-top: 27px;
                    padding-left: 20px;
                }

                .event-record {
                    /* width: 100%; */
                    height: 860px;
                    padding-left: 20px;
                    ul {
                        padding: 40px 0;

                        li {
                            display: flex;
                            align-items: center;
                            text-align: center;

                            .event-text {
                                width: 180px;
                                text-align: right;
                                font-size: 18px;
                                margin-right: 4px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }

                            .icon-time {
                                .event-time {
                                    width: 80px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                }

                                >div {
                                    display: flex;

                                    .circle {
                                        width: 6px;
                                        height: 6px;
                                        background: rgba(96, 229, 247, 1);
                                        border-radius: 50%;
                                    }

                                    .line {
                                        width: 74px;
                                        height: 2px;
                                        margin-top: 2px;
                                        background: rgba(96, 229, 247, 1);
                                    }
                                }
                            }

                            .event-item {
                                width: 53px;
                                height: 53px;
                                margin-left: 20px;
                                position: relative;
                                line-height: 53px;
                                border-radius: 50%;
                                background: #429FB9;
                                box-shadow: 0 0 0 10px #30779D, 0 0 0 16px rgba($color: #173969, $alpha: 0.5);

                                .iconfont {
                                    color: white;
                                }
                            }

                            .event-item:after {
                                content: '';
                                display: block;
                                width: 2px;
                                height: 54px;
                                position: absolute;
                                left: 50%;
                                z-index: 10;
                                margin-left: -1px;
                                background: rgba(96, 229, 247, 1);

                            }

                            .event-year {
                                width: 78px;
                                height: 78px;
                                margin-left: 272px;
                                position: relative;
                                line-height: 78px;
                                border-radius: 50%;
                                font-size: 20px;
                                background: #429FB9;
                                box-shadow: 0 0 0 10px #30779D, 0 0 0 18px rgba($color: #173969, $alpha: 0.5);

                                .iconfont {
                                    color: white;
                                }
                            }
                        }

                        li+li {
                            margin-top: 54px;
                        }
                    }
                }
            }
        }
    }
}
</style>