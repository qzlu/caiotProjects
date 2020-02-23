<template>
<div class="index flex">
    <div class="aside">
        <div class="chart-container box-bg">
            <zw-card1 icon="icon-brokenlinegraph" title="消防救援统计" :showMore='true' @click="show3 = true">
                <ul class="time-tab-list">
                    <li :class="['l',{active:activeIndex === key}]" v-for='(item,key) in sosCountType' @click="changeCountType(key)">{{item}}</li>
                </ul>
                <div style="height:370px;">
                    <bar-chart :data="sosCount" lableRotate='0' :legend="sosCount.legend" :grid="{top:70,right:20,bottom:20}"></bar-chart>
                </div>
            </zw-card1>
        </div>
        <div class="chart-container box-bg">
            <zw-card1 icon="icon-Typestatistics" title="告警类型统计">
                <div class="chart-box">
                    <pie-chart :series="alarmCount" :color='["#F1E240","#A85FF2","#2A91FC","#FF7300","#03CD82"]' :showLegend="false">
                    </pie-chart>
                </div>
            </zw-card1>
        </div>
    </div>
    <div :class="['map-container', 'box-bg',{'full-screen':fullScreen}]">
        <div class="title">
            应急网络分布图
        </div>
        <div class="operation">
            <span @click="toggleMap()"><i class="iconfont icon-Switchmap"></i></span>
            <span @click="fullScreen = !fullScreen"><i class="iconfont icon-Scale"></i></span>
        </div>
        <div :class="['radar']">
            <div class="radar-map-container">
                <div id="radar-map" class="radar-map"></div>
            </div>
            <div class="changing-number-container" data-number="1234567890456"></div>
            <div class="risk-points"></div>
            <div class="scanning-circle">
                <div class="radar-scanner">
                    <div class="inner-scanner"></div>
                    <div class="outer-scanner">
                        <div class="scanner-container">
                            <div class="umbrella"></div>
                            <div class="scanner-decoration">
                                <div class="thin-border"></div>
                                <div class="small-ellipse"></div>
                                <div class="small-ellipse"></div>
                                <div class="small-ellipse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['circle-btn',{'circle-btn-alarm':item.IsEsists} ,  `circle-btn-${item.ID}`]"  v-for="item in mapData.Data||[]" :key="item.ID">
                <router-link  :to="`/index/${item.ID}`">{{item.FormName.slice(0,2)}}<br>{{item.FormName.slice(2)}}</router-link>
            </div>
        </div>
        <div :class="['baidu-map',{'hidden':!showBMap}]">
            <b-map ref="map"></b-map>
        </div>
        <div class="data-item-content flex flex-center">
            <data-item name='项目数' :value="mapData.ProjectCount||0"></data-item>
            <data-item name='设备数' :value="mapData.DeviceCount||0"></data-item>
            <data-item name='告警数' :value="mapData.AlarmCount||0" @click.native="show = true"></data-item>
        </div>
    </div>
    <div style="width:360px">
        <div class="chart-container box-bg">
            <zw-card1 icon="icon-Emergencysafetyindicators" title="消防安全指标">
                <div class="chart-box">
                    <radar-chart :data="radarData">
                    </radar-chart>
                </div>
            </zw-card1>
        </div>
        <div class="chart-container box-bg">
            <zw-card1 icon="icon-Pressure" title="设备在线率">
                <div class="chart-box">
                    <gauge :data="devieceState.Percentage||0"></gauge>
                    <div class="data-item-content flex flex-center">
                        <data-item name='在线数' :value="devieceState.OnLineDevice||0"></data-item>
                        <data-item name='离线数' :value="devieceState.OffLineDevice||0"></data-item>
                    </div>
                </div>
            </zw-card1>
        </div>
    </div>
    <div class="aside box-bg right-side">
        <el-scrollbar>
            <transition-group tag="ul" name="list" class="list">
                <li :class="{alarm:item.isAlarm}" v-for="(item,i) in projectList" :key="item.ProjectID">
                    <div class="clearfix">
                        <h4 class="l">{{item.ProjectName}}</h4>
                        <div class="r" style="margin-right:20px;line-height:36px;font-size:24px;">
                            <i class="iconfont icon-Equipment" style="font-size:24px;"></i>
                            {{item.DeviceCount||0}}
                        </div>
                    </div>
                    <div class="list-content">
                       <div class="statu">
                           <span>{{item.isAlarm?"告警":"正常"}}</span>
                       </div>
                       <ul  class="param clearfix">
                           <li class="l" v-for="(obj,j) in item.Data" :key="j">
                               <i :class="['iconfont',obj.IconName]" :title="obj.ItemName"></i>
                               <span :class="['value',{'red':obj.AlarmCount>0}]">{{obj.AlarmCount}}</span>
                           </li>
                       </ul>
                    </div>
                </li>
            </transition-group>
        </el-scrollbar>
    </div>
    <el-dialog append-to-body title="实时告警" top="20px" :visible.sync="show" width="1532px" class="zw-dialog table-dialog">
        <div class="monitor-alarm-dialog">
            <Table :showOperation='false' :showOperationColumn='false' :tableLabel="tableLabel" :getData="queryAlarmData"></Table>
        </div>
    </el-dialog>
    <el-dialog append-to-body title="应急救援" top="20px" :visible.sync="show3" width="1532px" class="zw-dialog table-dialog">
        <div class="monitor-alarm-dialog">
            <Table :showOperation='false' :showOperationColumn='false' :tableLabel="tableLabel1" @cell-click="cellClick" :getData="queryPageOrders"></Table>
        </div>
    </el-dialog>
    <el-dialog append-to-body title="救援记录单" top="50px" :visible.sync="show1" width="1105px" class="zw-dialog">
        <div class="sos-dialog">
            <h4 class="flex">
                <p><span class="label">单号日期：</span><span class="value">{{orderInfo.OrderCreateDateTime}}</span></p>
                <p><span class="label">救援单号：</span><span class="value">{{orderInfo.ID}}</span></p>
            </h4>
            <h5>基本信息</h5>
            <ul class="flex">
                <li v-for="(item,i) in basicInfo" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{deviceInfo[item.prop]}}</span>
                </li>
            </ul>
            <h5>救援进度</h5>
            <ul class="flex">
                <li v-for="(item,i) in helpProgress" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{orderInfo[item.prop]}}</span>
                </li>
            </ul>
            <h5>救援记录</h5>
            <ul class="flex">
                <li v-for="(item,i) in helpRecord" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{orderInfo[item.prop]}}</span>
                </li>
            </ul>
        </div>
    </el-dialog>
    <el-dialog :modal="false" :title="deviceName" top="20px" :visible.sync="show2" width="1576px" class="device-detail-dialog zw-dialog">
        <device-detaile :id="deviceID" :projectId="projectId"></device-detaile>
    </el-dialog>
</div>
</template>

<script>
import {
    barChart,
    pieChart,
    radarChart,
    zwCard1,
    bMap
} from '@/components/index.js'
import gauge from './gauge.vue'
import dataItem from './dataItem.vue'
import Table from '../manage/layout/table.vue'
import {
    Radar
} from './radar.js'
import './radar.css'
import './index.scss'
import china from '@/mapJson/allCity.json'
import {HomePage, Orders, Alarm,Project} from '@/xiaoFangCloud/request/api.js'
import deviceDetaile from './deviceDetaile.vue'
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
const alarmLevel = ["全部", "提示", "一般", "严重"]
export default {
    data() {
        return {
            show:false,
            show1:false,
            show2:false,
            show3:false,
            showBMap: false,
            basicInfo:[
                { prop:'ProjectName',label:'项目名称'},
                { prop:'DeviceName',label:'告警设备'},
                { prop:'AlarmTypeName',label:'告警类型'},
                { prop:'City',label:'区域名称'},
                { prop:'FormName',label:'系统名称'},
                /* { prop:'FContact',label:'项目安全负责人'}, */
                { prop:'RegulatoryName',label:'监管单位'},
                { prop:'RegulatoryUser',label:'监管安全负责人'},
                { prop:'PropertyName',label:'物联单位'},
                { prop:'PropertyLeader',label:'物联负责人'},
            ],
            helpProgress:[
                { prop:'AlarmTime',label:'告警时间'},
                { prop:'FCreatorUser',label:'确认人员'},
                { prop:'OrderCreateDateTime',label:'确认时间'},
                { prop:'OrderUser',label:'救援人员'},
                { prop:'ReceivingOrderDateTime',label:'到场时间'},
                { prop:'EndOrderDateTime',label:'完成时间'},
                { prop:'ReceivingTime',label:'处理时长'},
            ],
            helpRecord:[
                { prop:'ProjectName',label:'拍照'},
                { prop:'FDescription',label:'处理描述'},
            ],
            tableLabel:[
                {
                    prop:'FormName',
                    label:'系统名称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                    width:160
                },
                {
                    prop: 'AlarmTime',
                    label: '告警时间',
                    width:160
                },
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称',
                    width:160
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型',
                },
                {
                    prop: 'Duration',
                    label: '告警级别',
                    formatter: (row)=> alarmLevel[row['AlarmLevel']]
                },
                {
                    prop:'OrderContent',
                    label:'告警内容',
                    width:160
                },
                {
                    prop:'AlarmData',
                    label:'当前值',
                },
                {
                    prop:'OrderState',
                    label:'确认进度',
                    formatter:(row, column, cellValue, index) => orderState[row.OrderState]
                },
                {
                    prop:'OrdersID',
                    label:'救援单号',
                },
                {
                    prop:'IsRecovery',
                    label:'告警状态',
                    formatter:(row, column, cellValue, index) => row.IsRecovery == 1?'已恢复':'未恢复'
                }
            ],
            tableLabel1:[
                {
                    prop:'FormName',
                    label:'系统名称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                    width:160
                },
                {
                    prop:'OrdersID',
                    label:'救援单号',
                },
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称',
                    width:160
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型',
                },
                {
                    prop: 'AlarmTime',
                    label: '告警时间',
                    width:160
                },
                {
                    prop: 'OrderCreateDateTime',
                    label: '确认时间',
                    width:160
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '到场时间',
                    width:160
                },
                {
                    prop: 'EndOrderDateTime',
                    label: '完成时间',
                    width:160
                },
                {
                    prop:'IsRecovery',
                    label:'救援状态',
                    formatter:(row, column, cellValue, index) => row.IsRecovery == 1?'已恢复':'未恢复'
                }
            ],
            DataDetail:[
                {
                    SDataID: 1,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 2,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 3,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 4,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 5,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 6,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 7,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                },
                {
                    SDataID: 7,
                    SDataTitle: "三相电流",
                    SDataUnit: "A",
                    SDataValue:[
                        {DValue: "0.3", DStatus: 1},
                        {DValue: "4.7", DStatus: 1},
                        {DValue: "1.9", DStatus: 1}
                    ]
                }
            ],
            sosCountType: {
                'Day': '日',
                'Month': '月',
                'Year': '年'
            },
            sosCount: {
                columns: ['数字消防', '数字电梯', '数字充电桩', '数字危化品'],
                legend: {
                    data: ['救援次数', '响应时长']
                },
                rows: [{
                        type: 'bar',
                        name: '救援次数',
                        barWidth: 18,
                        data: [40, 25, 30, 50]
                    },
                    {
                        type: 'line',
                        name: '响应时长',
                        yAxisIndex: 1,
                        data: [12, 15, 30, 20]
                    }
                ],
                colorsArr: ['#18DE94', '#FF7300'],
                yAxis: [{
                        type: 'value',
                        name: '救援次数',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#FFFFFF",
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        interval: 10,
                    },
                    {
                        type: 'value',
                        name: '响应时长/分钟',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#FFFFFF",
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                    }
                ]
            },
            alarmCount: [{
                type: "pie",
                radius: ["0", "100"],
                center: ["50%", "50%"],
                label: {
                    show: true,
                    formatter: '{a|{b}}\n{hr|{c}}%',
                    textStyle: {
                        fontSize: '14',
                        color: '#B6C0DC',
                    },
                    rich: {
                        a: {
                            lineHeight: 30,
                            color: '#B6C0DC',
                        }
                    },
                },
                labelLine: {
                    length: 10,
                    length2: 10,
                    lineStyle: {
                        color: '#B6C0DC',
                        type: 'dashed'
                    }
                },
                data: [{
                        name: "电梯困人",
                        value: 20,
                        /* selected:true */
                    },
                    {
                        name: "烟感告警",
                        value: 25,
                        /* selected:true */
                    },
                    {
                        name: "区外停梯",
                        value: 35,
                        /* selected:true */
                    },
                    {
                        name: "开门走梯",
                        value: 10,
                    },
                    {
                        name: "可燃气体报警",
                        value: 20,
                    }
                ]
            }],
            radarData: {
                columns: [{
                        name: '应急人员',
                        max: 100,
                    },
                    {
                        name: '应急措施',
                        max: 100,
                    },
                    {
                        name: '应急监测',
                        max: 100,
                    },
                    {
                        name: '应急调度',
                        max: 100,
                    },
                ],
                rows: [{
                    value: [90, 98, 80, 95],
                    name: ''
                }]
            },
            activeIndex: 'Day',
            scoreNumber: 90,
            fullScreen: false,
            myChart: null,
            radar: null,
            rescueOrderCount: {},
            devieceState:{},
            mapData:{},
            projectList:[],
            fireList:[],
            deviceName:'',
            deviceID:0,
            projectId:0,
            deviceInfo:{},
            orderInfo:{}
        }
    },
    components: {
        barChart,
        pieChart,
        radarChart,
        gauge,
        zwCard1,
        bMap,
        dataItem,
        Table,
        deviceDetaile
    },
    computed: {},
    mounted() {
        this.$nextTick(() => {
            this.radar = new Radar(document.querySelector('.radar'));
            this.radar.init({
                scanSpeed: 2
            })
        })
        setTimeout(() => {
            this.showMap()
        }, 1000)
        setInterval(() => {
            this.scoreNumber = Math.floor(Math.random(0, 1) * 100 + 1)
        }, 2000)
        this.queryData()
        this.$websocket.onclose = () => {
            this.$initWebSocket()
            this.queryData()
        }
    },
    beforeDestroy(){
        this.$websocket.close()
    },
    methods: {
        toggleMap() {
            this.radar.roamingToggle()
            if(this.showBMap){
                this.showBMap = !this.showBMap
            }else{
                setTimeout(() => {
                    this.showBMap = !this.showBMap
                },800)
            }
        },
        /**
         * 渲染地图
         * @param {Array} mapArr 地图数据
         */
        showMap() {
            if (!this.myChart) {
                var dom = document.getElementById('radar-map');
                this.myChart = echarts.init(dom);
            } else {
                this.myChart.off('click')
            }
            echarts.registerMap('china', china)
            var option = null;
            option = {
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    show: true,
                    itemHeight: 50,
                    icon: 'triangle', //图例的形状
                },
                visualMap: {
                    show: true,
                    min: 0,
                    max: 10,
                    left: 'left',
                    top: 'center',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    symbolSize: 50,
                    splitList: [{
                        start: 0,
                        end: 100
                    }, ],
                    color: ['#5475f5', '#9feaa5']
                },
                dataRange: {
                    show: false,
                    orient: 'horizontal',
                    min: 0,
                    max: 100,
                    text: ['高', '低'], // 文本，默认为数值文本
                    splitList: [{
                            start: 0,
                            end: 50
                        },
                        {
                            start: 50,
                            end: 100
                        },
                    ],
                    splitNumber: 0,
                    color: ['#001869', '#001869']
                },
                color: ['red'],
                animationDuration: 1000,
                animationEasing: 'cubicOut',
                animationDurationUpdate: 1000,
                series: [{
                    name: '',
                    type: 'map',
                    map: 'china',
                    roam: true,
                    selectedMode: 'single',
                    showLegendSymbol: false,
                    label: {
                        normal: {
                            color: 'white',
                            /* formatter: '{b}\n项目:{c}个', */
                            formatter: data => {
                                if (data.value > 0) {
                                    return data.name + '\n' + `项目：${data.value}`
                                } else {
                                    return ''
                                }
                            },
                            position: 'right',
                            show: true,
                            lineHeight: 20,
                        },
                        emphasis: {
                            color: 'white',
                            show: true,
                            fontSize: '18'
                        }
                    },
                    zoom: 1.2,
                    itemStyle: {
                        normal: {
                            areaColor: '#001869',
                            borderColor: '#0E3D94'
                        },
                        emphasis: {
                            areaColor: '#174CFF'
                        }
                    }
                }, ]
            }
            if (option && typeof option === "object") {
                this.myChart.setOption(option, true);
            }
        },
        changeCountType(key) {
            this.activeIndex = key
            this.sosCount = this.formatSosCount()
        },
        formatSosCount() {
            let data = this.rescueOrderCount[this.activeIndex] || [],
                columns = data.map(item => item.FormName),
                sosTimes = data.map(item => item.OrderCount),
                waittingTime = data.map(item => item.AvgTime)
            return {
                columns,
                legend: {
                    data: ['救援次数', '响应时长']
                },
                rows: [{
                        type: 'bar',
                        name: '救援次数',
                        barWidth: 18,
                        data: sosTimes
                    },
                    {
                        type: 'line',
                        name: '响应时长',
                        yAxisIndex: 1,
                        data: waittingTime
                    }
                ],
                colorsArr: ['#18DE94', '#FF7300'],
                yAxis: [{
                        type: 'value',
                        name: '救援次数',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#FFFFFF",
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        interval: 10,
                    },
                    {
                        type: 'value',
                        name: '响应时长/分钟',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#FFFFFF",
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                    }
                ]
            }
        },
        formatAlarmData(arr) {
            let data = arr.map(item => {
                return {
                    name: item.AlarmTypeName,
                    value: item.Percentage
                }
            })
            return [{
                type: "pie",
                radius: ["0", "100"],
                center: ["50%", "50%"],
                label: {
                    show: true,
                    formatter: '{a|{b}}\n{hr|{c}}%',
                    textStyle: {
                        fontSize: '14',
                        color: '#B6C0DC',
                    },
                    rich: {
                        a: {
                            lineHeight: 30,
                            color: '#B6C0DC',
                        }
                    },
                },
                labelLine: {
                    length: 10,
                    length2: 10,
                    lineStyle: {
                        color: '#B6C0DC',
                        type: 'dashed'
                    }
                },
                data,
            }]
        },
        /**
         * 显示点
         */
        showMarks(resetView = true){
            let Map = this.$refs.map
            if(!Map){
                setTimeout(this.showMarks,500)
                return
            }
            Map.map.clearOverlays()
            this.fireList.forEach((item,i) => {
                if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
                  return
                }
                const point = new BMap.Point(item.Flng,item.Flat)
                let marker,icon,img,temp
                if(item.isAlarm){
                    img = require(`@/assets/image/marker/icon-alarm.gif`)
                }else{
                    img = require(`@/assets/image/marker/icon-normal.gif`)
                }
                icon = Map.setIcon(img,54,54)
                marker = new BMap.Marker(point,{icon:icon})
                if(item.isAlarm){
                    marker.setZIndex({zIndex:10})
                }
                Map.map.addOverlay(marker)
                resetView && Map.map.centerAndZoom(point, 8);
                let infoBox = Map.setInfoWindow(item)
              /*   if(item.isAlarm){
                    infoBox.open(marker)
                } */
                let alarmData = item.Data&&item.Data[0]
                if(alarmData){
                  infoBox.addEventListener("open", (e) => {
                      let id = alarmData.AlarmID
                      let el = document.getElementById(id)
                      el.onclick = () => {
                          console.log(alarmData)
                          this.show2 = true
                          this.deviceID = alarmData.DeviceID
                          this.projectId = alarmData.ProjectID
                      }
                  });
                }
                marker.addEventListener("click",function(e){
		            infoBox.open(marker)
                });
            })
        },
        handleData(data) {
            console.log(data)
            data = data.FObject
            this.rescueOrderCount = data.RescueOrderCount || {}
            this.sosCount = this.formatSosCount()
            let alarmData = data.AlarmTypePerc || []
            this.alarmCount = this.formatAlarmData(alarmData)
            this.devieceState = data.DeviceLinePercentage[0] || {}
            this.projectList = data.ProjectAlarmData || []
            this.mapData = data.ProjectGIS&&data.ProjectGIS.T1
            this.fireList = data.ProjectGIS&&data.ProjectGIS.T2
            this.projectList.forEach(item => {
                item.isAlarm = item.Data.find(obj => obj.AlarmCount>0)
            })
            this.fireList.forEach(item => {
                item.isAlarm = item.Data&&item.Data.length>0
            })
            this.$nextTick(() => {
                this.showMarks()
            })
        },
        queryData() {
            this.$socket({
                FAction: 'QueryAllFormAllProject'
            }, this.handleData)
        },
        /**
         * 获取实时告警数据
         */
        queryAlarmData(data){
            return HomePage({
                FAction:'QueryPageAlarmData',
                ...data
            })
        },
        /**
         * 获取救援记录单
         */
        queryPageOrders(data){
            return HomePage({
                FAction:'QueryPageOrders',
                ...data
            })
        },
        cellClick(data){
            let {row,column} = data
            if(column.property == "OrdersID"){
                this.show1 = true
                this.queryOrderRecord(row)
                this.queryDeviceBasisInfo(row)
            }
        },
        /**
         * 获取设备详情
         */
        queryDeviceBasisInfo(row){
            HomePage({
                FAction:'QueryDeviceBasisInfo',
                DeviceID:row.DeviceID,
                ProjectID:row.ProjectID
            })
            .then((result) => {
                this.deviceInfo = result.FObject[0]||{}
            }).catch((err) => {
                
            });
        },
        /**
         * 查询工单记录
         */
        queryOrderRecord(row){
            Orders({
                FAction:'QueryOrderRecord',
                ID:row.OrdersID
            })
            .then((result) => {
                this.orderInfo = result.FObject.Data[0]||{}
            }).catch((err) => {
                console.log(err)
            });
        },
    }
}
</script>

<style lang="scss">

</style>
