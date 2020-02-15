<template>
<div class="index flex">
    <div class="aside">
        <div class="chart-container box-bg">
            <zw-card1 icon="icon-brokenlinegraph" title="消防救援统计" :showMore='true'>
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
            <span @click="fullScreen = !fullScreen"><i class="iconfont icon-Switchmap"></i></span>
        </div>
        <div :class="['radar']" v-if="false">
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
            <div :class="['circle-btn',{'circle-btn-alarm':item.IsEsists} ,  `circle-btn-${item.ID}`]" v-for="item in mapData.Data||[]" :key="item.ID">{{item.FormName.slice(0,2)}}<br>{{item.FormName.slice(2)}}</div>
        </div>
        <div :class="['baidu-map',{'hidden':!showBMap}]">
            <b-map ref="map"></b-map>
        </div>
        <div class="data-item-content flex flex-center">
            <data-item name='项目数' :value="mapData.ProjectCount||0"></data-item>
            <data-item name='设备数' :value="mapData.DeviceCount||0"></data-item>
            <data-item name='告警数' :value="mapData.AlarmCount||0"></data-item>
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
                <li :class="{alarm:item.isAlarm}" v-for="(item,i) in projectList" :key="item.ProjectID" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
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
    <el-dialog append-to-body title="实时告警" :visible.sync="show" width="1532px" class="zw-dialog">
        <div class="monitor-alarm-dialog">
            <Table :showOperation='false' :tableLabel="tableLabel"></Table>
        </div>
    </el-dialog>
    <el-dialog append-to-body title="救援记录单" top="50px" :visible.sync="show1" width="1105px" class="zw-dialog">
        <div class="sos-dialog">
            <h4 class="flex">
                <p><span class="label">单号日期：</span><span class="value">{{new Date()}}</span></p>
                <p><span class="label">救援单号：</span><span class="value">{{'JYT1232032465'}}</span></p>
            </h4>
            <h5>基本信息</h5>
            <ul class="flex">
                <li v-for="(item,i) in basicInfo" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{item.prop}}</span>
                </li>
            </ul>
            <h5>救援进度</h5>
            <ul class="flex">
                <li v-for="(item,i) in helpProgress" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{item.prop}}</span>
                </li>
            </ul>
            <h5>救援记录</h5>
            <ul class="flex">
                <li v-for="(item,i) in helpRecord" :key="i">
                    <span class="label" style="width:120px;">{{item.label}}:</span>
                    <span class="value">{{item.prop}}</span>
                </li>
            </ul>
        </div>
    </el-dialog>
    <el-dialog :modal="false" title="消防主机" top="20px" :visible.sync="show2" width="1576px" class="device-detail-dialog zw-dialog">
        <div class="monitor-data flex">
            <div class="monitor-data-left">
                <h4>实时监测</h4>
                <h5>消防主机<i class="r el-icon-star-off"></i></h5>
                <div class="device-param">

                </div>
            </div>
            <div class="monitor-data-border" style="margin-top:84px;">
            </div>
            <div class="monitor-data-center">

            </div>
            <div class="monitor-data-border" style="margin-top:35px;">
            </div>
            <div class="monitor-data-right">

            </div>
        </div>
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
import('./radar.css')
import china from '@/mapJson/allCity.json'
export default {
    data() {
        return {
            show:false,
            show1:false,
            show2:false,
            showBMap: true,
            basicInfo:[
                { prop:'ProjectName',label:'项目名称'},
                { prop:'DeviceName',label:'告警设备'},
                { prop:'AlarmTypeName',label:'告警类型'},
                { prop:'AreaName',label:'区域名称'},
                { prop:'SystemName',label:'系统名称'},
                { prop:'FContact',label:'项目安全负责人'},
                { prop:'ProjectName',label:'监管单位'},
                { prop:'ProjectName',label:'监管安全负责人'},
                { prop:'ProjectName',label:'物联单位'},
                { prop:'ProjectName',label:'物联负责人'},
            ],
            helpProgress:[
                { prop:'ProjectName',label:'项目名称'},
                { prop:'DeviceName',label:'告警设备'},
                { prop:'AlarmTypeName',label:'告警类型'},
                { prop:'AreaName',label:'区域名称'},
                { prop:'SystemName',label:'系统名称'},
                { prop:'FContact',label:'项目安全负责人'},
                { prop:'ProjectName',label:'监管单位'},
                { prop:'ProjectName',label:'监管安全负责人'},
            ],
            helpRecord:[
                { prop:'ProjectName',label:'监管单位'},
                { prop:'ProjectName',label:'监管安全负责人'},
            ],
            tableLabel:[
                {
                    prop:'DeviceName',
                    label:'设备名称'
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型名称'
                },
                {
                    prop: 'LimitValue',
                    label: '限制值'
                },
                {
                    prop: 'TriggerType',
                    label: '告警条件',
                    formatter:(row, column, cellValue, index) => this.type[row.TriggerType-1] + row.LimitValue
                },
                {
                    prop: 'Duration',
                    label: '持续时长(s)',
                },
                {
                    prop:'IsEnable',
                    label:'是否启用',
                    formatter:(row, column, cellValue, index) => row.IsEnable?'是':'否'
                },
                {
                    prop:'AlarmLevel',
                    label:'告警级别',
                    formatter:(row, column, cellValue, index) => this.alarmLevel[row.AlarmLevel]
                },
                {
                    prop:'AlarmKind',
                    label:'告警种类',
                    formatter:(row, column, cellValue, index) => row.AlarmKind == 1?'预警':'火警'
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
        Table
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
/*                 if(item.isAlarm||item.unNormal){
                    img = require(`@/assets/image/marker/icon_wrong_${this.formID}.gif`)
                    icon = Map.setIcon(img,75,75)
                }else{
                    img = require(`@/assets/image/marker/icon_normal_${this.formID}.png`)
                    icon = Map.setIcon(img,34,40)
                } */
                img = require(`@/assets/image/marker/icon_normal_1.png`)
                icon = Map.setIcon(img,34,40)
                marker = new BMap.Marker(point,{icon:icon})
/*                 if(item.isAlarm||item.unNormal){
                    marker.setZIndex({zIndex:10})
                } */
                Map.map.addOverlay(marker)
                resetView && Map.map.centerAndZoom(point, 8);
                let infoBox = Map.setInfoWindow(item)
                marker.addEventListener("click",function(e){
		            infoBox.open(marker)
                });
                /* Map.setLabel(marker,item.ProjectName) */
/*                 let label
                if(item.isAlarm||item.unNormal){
                    // Map.map.centerAndZoom(point, 11)
                    label = new BMap.Label(item.ProjectName,{offset:new BMap.Size(50,40)})
                    label.setStyle({
                      color:'red',
                      borderColor:'white',
                      padding:'4px 10px',
                    })
                }else{
                    label = new BMap.Label(item.ProjectName,{offset:new BMap.Size(20,20)})
                    label.setStyle({
                      color:'#999999 ',
                      backgroundColor:'rgb(227, 228, 228)',
                      borderColor:'rgb(227, 228, 228)',
                      padding:'0 10px',
                    })
                }
                marker.setLabel(label)
                marker.addEventListener('mouseover',e => {
                  Map.openInfoWindow(temp,point)
                })
                marker.addEventListener('dblclick',e => {
                  this.changeRouter(item)
                }) */
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
            this.$nextTick(() => {
                this.showMarks()
            })
        },
        queryData() {
            this.$socket({
                FAction: 'QueryAllFormAllProject'
            }, this.handleData)
        }
    }
}
</script>

<style lang="scss">
$url:'../../../assets/image/';

.index {
    height: 972px;
    margin-top: 8px;
    justify-content: space-between;

    .box-bg {
        background: rgba(5, 34, 86, .4);
        -webkit-box-shadow: 0 0 8px 8px #052256 inset;
        box-shadow: inset 0 0 8px 8px #052256;
        border-radius: 10px 6px 6px 10px;
    }
    >div {
        height: 100%;

        .chart-container {
            width: 100%;
            height: 480px;
            ul.time-tab-list {
                width: 192px;
                margin: 16px auto 0px;
                border: 1px solid rgba(83, 123, 174, 1);
                border-radius: 6px;
                overflow: hidden;

                li {
                    width: 64px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #F1F1F2;
                    cursor: pointer;
                }

                li.active {
                    background: linear-gradient(0deg, rgba(0, 79, 177, 1), rgba(16, 137, 172, 1));
                }
            }
            .chart-box {
                height: 420px;
                position:relative;
                .data-item-content{
                    width:100%;
                    position:absolute;
                    bottom:20px;
                    .data-item+.data-item{
                        margin-left:60px;
                    }
                }
            }
        }

        .chart-container+.chart-container {
            margin-top: 10px;
        }
    }

    .aside {
        width: 380px;
    }
    .aside.right-side{
        .list{
            >li{
                width: 100%;
                height: 243px;
                border-bottom: 1px dotted #2B76B2;
                cursor: pointer;
                h4{
                    width: 188px;
                    height: 44px;
                    line-height: 36px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    background: url(#{$url}/cloud/index/bg_4.png);
                    font-size:18px;
                    font-weight:400;
                    color:rgba(158,229,243,1);
                }
                .statu{
                    width:72px;
                    height:72px;
                    line-height: 72px;
                    position: absolute;
                    top: 50%;
                    left: 20px;
                    font-size: 28px;
                    font-weight: 500;
                    color: #017901;
                    transform: translateY(-50%) scaleY(1.9);
                    border:1px solid rgba(1,150,7,1);
                    border-radius:9px;
                    box-shadow:  0 0 14px rgba(1,150,7,1);
                    span{
                        display: inline-block;
                        transform: scaleY(0.6)
                    }
                    &:after{
                        content: ' ';
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 50%, #00ff33 100%);
                        width: 50%;
                        height: 50%;
                        animation: radar-beam 10s infinite;
                        animation-timing-function: linear;
                        transform-origin: bottom right;
                        border-radius: 100% 0 0 0;
                    }
                }
                @keyframes radar-beam {
                  0% {
                    transform: rotate(0deg);
                  }

                  100% {
                    transform: rotate(360deg);
                  }
                }
                .list-content{
                    height: 183px;
                    position: relative;
                    .param{
                        padding-left: 40px;
                        position: absolute;
                        top: 50%;
                        left: 90px;
                        transform: translateY(-50%);
                        li{
                            width: 120px;
                            height: 30px;
                            line-height: 30px;
                            font-size: 20px;
                            text-align: left;
                            .value{
                                font-size: 20px;
                                margin-left: 10px;
                                line-height: 30px;
                            }
                            .iconfont{
                                font-size:26px;
                                vertical-align: baseline;
                            }
                        }
                        li:nth-of-type(1),li:nth-of-type(2){
                            margin-bottom: 30px
                        }
                    }
                }
            }
            >li.alarm{
                background:url(#{$url}index/alarm.png)!important;
                background-size: 100% 100%!important;
                .statu{
                    border: 1px solid #fb0d0d;
                    -webkit-box-shadow: 0 0 14px #fb0d0d;
                    box-shadow: 0 0 14px #fb0d0d;
                    color: #fb0d0d;
                    &:after{
                        background-image: linear-gradient(44deg,rgba(251,13,13,0) 42%,#fb0d0d);
                    } 
                }
            }
            >li.active{
                background: rgba($color: #2B76B2, $alpha: 0.3);
            }
        }
    }
    .map-container {
        width: 764px;
        position: relative;
        /* transform-style: preserve-3d; */
        transition: all 0.5s;

        div.title {
            width: 278px;
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            margin: 5px auto 0 auto;
            position: relative;
            z-index: 10;
            background: url(#{$url}cloud/index/device-title.png);
        }

        .operation {
            position: absolute;
            top: 20px;
            right: 36px;
            z-index: 10;

            span {
                display: inline-block;
                width: 36px;
                height: 36px;
                line-height: 36px;
                background: rgba(84, 177, 221, .32);
                border-radius: 50%;
                box-shadow: 0 0 6px 6px rgba(84, 177, 221, 0.42);
                cursor: pointer;

                i {
                    font-size: 24px;
                }
            }

            span+span {
                margin-left: 20px;
            }
        }

        .radar {
            width: 680px;
            height: 680px;
            margin-top: 28px;
            z-index: 8;
            .radar-map {
                width: 94%;
            }
            .circle-btn{
                position: absolute;
                width: 78px;
                height: 94px;
                display: flex;
                z-index: 11;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: #A5EFFC;
                box-shadow: 0 0 15px #65C11D inset;
                border-radius: 50%;
                cursor: pointer;
                &:after{
                    content: '';
                    width: 88px;
                    height: 104px;
                    border: 2px solid #65C11D;
                    border-radius: 50%;
                    position: absolute;
                    top: -7px;
                    left: -7px;
                }
                &:hover{
                    font-size: 16px;
                }
            }
            .circle-btn.circle-btn-alarm{
                box-shadow: 0 0 15px #FB0D0D inset;
                &:after{
                    border: 2px solid #FB0D0D;
                }
            }
            .circle-btn-1,.circle-btn-2{
                top: 10px;
            }
            .circle-btn-1,.circle-btn-3{
                left:0px
            }
            .circle-btn-2,.circle-btn-4{
                right: 0px
            }
            .circle-btn-3,.circle-btn-4{
                bottom: 0
            }
        }

        .baidu-map {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 9;
            transition: all ease-in-out 0.5s;
        }

        .baidu-map.hidden {
            opacity: 0;
            z-index: 7;
        }
        .data-item-content{
            width:100%;
            position:absolute;
            bottom:20px;
            z-index:10;
            .data-item+.data-item{
                margin-left:60px;
            }
        }
    }

    .map-container.full-screen {
        width: 1920px;
        height: 1080px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        background: rgba(5, 34, 86, 1);
    }
}
.monitor-alarm-dialog{
    height: 687px;
    .report{
        .zw-table::before{
            display: none;
        }
        .zw-pagination{
            bottom: 0;
        }
    }
}
.sos-dialog{
    color: #BDE3EE;
    h4{
        justify-content: flex-end;
        font-size:18px;
        font-weight:400;
    }
    h5{
        margin-top:20px;
        font-size: 18px;
        font-weight:400;
        &:before{
            content: '';
            display: inline-block;
            width:4px;
            height:12px;
            margin-right: 10px;
            background:rgba(189,227,238,1);
        }
    }
    ul{
        flex-wrap: wrap;
        font-size: 16px;
        font-weight: 400;
        li{
            width: 50%;
            line-height: 50px;
        }
    }
}
.device-detail-dialog.zw-dialog{
    .el-dialog__body{
        padding: 0;
        .monitor-data{
            height: 927px;
            color: #BDE3EE;
            text-align: left;
            h4{
                font-size: 18px;
                font-weight:400;
                &:before{
                    content: '';
                    display: inline-block;
                    width:4px;
                    height:12px;
                    margin-right: 10px;
                    background:rgba(189,227,238,1);
                }
            }
            &-left{
                width: 432px;
                height: 100%;
                padding-right: 35px;
                box-sizing: border-box;
                h4{
                    margin-top:27px;
                    padding-left: 50px;
                }
                h5{
                    margin-top: 20px;
                    padding-left: 64px;
                    font-size: 16px;
                    color: #525E7E;
                    i{
                        font-size: 24px;
                        color:#2A91FC
                    }
                }
            }
            &-border{
                width:3px;
                height:753px;
                background:linear-gradient(180deg,rgba(9,38,75,1),rgba(60,114,181,1),rgba(21,67,123,1),rgba(60,114,181,1),rgba(7,34,73,1));
                opacity:0.59;
            }
            &-center{
                width: 660px;
                height: 100%;
            }
            &-right{
                width: 478px;
                height: 100%;
            }
        }
    }
}
</style>
