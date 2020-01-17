<template>
    <div class="index flex">
        <div class="aside">
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-brokenlinegraph" title="消防救援统计" :showMore='true'>
                    <ul class="time-tab-list">
                        <li :class="['l',{active:activeIndex === 0}]" @click="activeIndex = 0">日</li>
                        <li :class="['l',{active:activeIndex === 1}]" @click="activeIndex = 1">月</li>
                        <li :class="['l',{active:activeIndex === 2}]" @click="activeIndex = 2">年</li>
                    </ul>
                    <div style="height:370px;">
                        <bar-chart :data="sosCount" lableRotate='0' :legend="sosCount.legend" :grid="{top:70,right:20,bottom:20}"></bar-chart>
                    </div>
                </zw-card1>
            </div>
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Typestatistics" title="告警类型统计">
                    <div class="chart-box">
                        <pie-chart 
                           :series="alarmCount"
                           :color='["#F1E240","#A85FF2","#2A91FC","#FF7300","#03CD82"]'
                           :showLegend="false"
                           >
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
            </div>
            <div :class="['baidu-map',{'hidden':!showBMap}]">
                <b-map></b-map>
            </div>
        </div>
        <div style="width:360px">
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Emergencysafetyindicators" title="消防安全指标" >
                    <div class="chart-box">
                        <radar-chart :data="radarData">
                        </radar-chart>
                    </div>
                </zw-card1>
            </div>
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Pressure" title="设备在线率">
                    <div class="chart-box">
                        <gauge :data="scoreNumber"></gauge>
                    </div>
                </zw-card1>
            </div>
        </div>
        <div class="aside box-bg">

        </div>
    </div>
</template>
<script>
import {barChart,pieChart,radarChart,zwCard1,bMap} from '@/components/index.js'
import gauge from './gauge.vue'
import {Radar} from './radar.js'
import('./radar.css')
import china from '@/mapJson/allCity.json'
export default {
    data(){
        return{
            showBMap:false,
            sosCount:{
                columns:['数字消防','数字电梯','数字充电桩','数字危化品'],
                legend:{
                    data:['救援次数','响应时长']
                },
                rows:[
                    {
                        type:'bar',
                        name:'救援次数',
                        barWidth:18,
                        data:[40,25,30,50]
                    },
                    {
                        type:'line',
                        name:'响应时长',
                        yAxisIndex: 1,
                        data:[12,15,30,20]
                    }
                ],
                colorsArr:['#18DE94','#FF7300'],
                yAxis:[
                    {
                        type: 'value',
                        name: '救援次数',
                        splitLine:{show:false},
                        axisLine:{
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
                        splitLine:{show:false},
                        axisLine:{
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
            alarmCount:[
                {
                  type: "pie",
                  radius: ["0","100"],
                  center: ["50%", "50%"],
                  label: {
                    show:true,
                    formatter:'{a|{b}}\n{hr|{c}}%',
                    textStyle:{
                      fontSize: '14',
                      color:'#B6C0DC',
                    },
                    rich:{
                      a:{
                        lineHeight: 30,
                        color:'#B6C0DC',
                      }
                    },
                  },
                  labelLine:{
                    length: 10,
                    length2: 10,
                    lineStyle:{
                      color:'#B6C0DC',
                      type:'dashed'
                    }
                  },
                  data: [
                    {
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
                }
            ],
            radarData:{
                columns:[
                    { name: '应急人员', max: 100,},
                    { name: '应急措施', max: 100,},
                    { name: '应急监测', max: 100,},
                    { name: '应急调度', max: 100,},
                ],
                rows:[
                    {
                        value: [90, 98, 80, 95],
                        name: ''
                    }
                ]
            },
            activeIndex:0,
            scoreNumber:90,
            fullScreen:false,
            myChart:null,
            radar:null
        }
    },
    components:{
        barChart,
        pieChart,
        radarChart,
        gauge,
        zwCard1,
        bMap
    },
    mounted(){
        this.$nextTick(() => {
            this.radar = new Radar(document.querySelector('.radar'));
            this.radar.init({scanSpeed: 2})
        })
        setTimeout(() => {
            this.showMap()
        },1000)
        setInterval(() => {
            this.scoreNumber = Math.floor(Math.random(0,1)*100 + 1)
        },2000)
    },
    methods:{
        toggleMap(){
            this.radar.roamingToggle()
            setTimeout(() => {
                this.showBMap = !this.showBMap
            })
        },
        /**
         * 渲染地图
         * @param {Array} mapArr 地图数据
         */
        showMap(){
          if(!this.myChart){
            var dom = document.getElementById('radar-map');
            this.myChart = echarts.init(dom);
          }else{
              this.myChart.off('click')
          }
          echarts.registerMap('china',china)
          var option = null;
          option = {
              tooltip: {
                  trigger: 'item',
              },
              legend: {
                  show:true,
                  itemHeight:50,
                  icon : 'triangle',//图例的形状
              },
              visualMap: {
                  show:true,
                  min: 0,
                  max: 10,
                  left: 'left',
                  top: 'center',
                  text: ['高','低'],           // 文本，默认为数值文本
                  calculable: true,
                  symbolSize:50,
                  splitList: [   
                        {start: 0, end: 100},  
                  ],  
                  color: ['#5475f5', '#9feaa5']  
              },
          	  dataRange: {
                  show:false,
                  orient: 'horizontal',
                  min: 0,
                  max: 100,
                  text: ['高', '低'],           // 文本，默认为数值文本
                  splitList: [   
                   {start: 0, end: 50},
                   {start: 50, end: 100},    
                  ],  
                  splitNumber: 0,
                  color: ['#001869', '#001869']  
              },
              color:['red'],
              animationDuration:1000,
	          animationEasing:'cubicOut',
	          animationDurationUpdate:1000,
              series: [
                    {
                        name: '',
                        type: 'map',
                        map: 'china',
                        roam:true,
                        selectedMode:'single',
                        showLegendSymbol:false,
                        label: {
                            normal: {
                                color:'white',
                                /* formatter: '{b}\n项目:{c}个', */
                                formatter:data => {
                                    if(data.value>0){
                                        return data.name + '\n' +`项目：${data.value}`
                                    }else{
                                        return ''
                                    }
                                },
                                position: 'right',
                                show: true,
                                lineHeight: 20,
                            },
                            emphasis: {
                                color:'white',
                                show: true,
                                fontSize:'18'
                            }
                        },
                        zoom:1.2,
                        itemStyle: {
                            normal: {
                                areaColor: '#001869',
                                borderColor: '#0E3D94'
                            },
                            emphasis: {
                                areaColor: '#174CFF'
                            }
                        }
                    },
              ]
          }
          if (option && typeof option === "object") {
              this.myChart.setOption(option, true);
          }
        },
    }
}
</script>
<style lang="scss">
$url:'../../../assets/image/';
.index{
    height: 972px;
    margin-top: 8px;
    justify-content: space-between;
    .box-bg{
        background: rgba(5,34,86,.4);
        -webkit-box-shadow: 0 0 8px 8px #052256 inset;
        box-shadow: inset 0 0 8px 8px #052256;
        border-radius:10px 6px 6px 10px;
    }
    >div{
        height: 100%;
        .chart-container{
            width: 100%;
            height: 480px;
            ul.time-tab-list{
                width: 192px;
                margin: 16px auto 0px;
                border:1px solid rgba(83,123,174,1);
                border-radius:6px;
                overflow: hidden;
                li{
                    width:64px;
                    height:34px;
                    line-height: 34px;
                    border-radius:6px;
                    font-size: 14px;
                    color: #F1F1F2;
                    cursor: pointer;
                }
                li.active{
                    background:linear-gradient(0deg,rgba(0,79,177,1),rgba(16,137,172,1));
                }
            }
            .chart-box{
                height: 420px;
            }
        }
        .chart-container+.chart-container{
            margin-top: 10px;
        }
    }
    .aside{
        width: 380px;
    }
    .map-container{
        width: 764px;
        position: relative;
        /* transform-style: preserve-3d; */
        transition: all 0.5s;
        div.title{
            width: 278px;
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            margin: 5px auto 0 auto;
            position: relative;
            z-index: 10;
            background: url(#{$url}cloud/index/device-title.png);
        }
        .operation{
            position: absolute;
            top: 20px;
            right: 36px;
            z-index: 10;
            span{
                display: inline-block;
                width:36px;
                height:36px;
                line-height: 36px;
                background:rgba(84,177,221,.32);
                border-radius:50%;
                box-shadow: 0 0 6px 6px rgba(84, 177, 221, 0.42);
                cursor: pointer;
                i{
                    font-size: 24px;
                }
            }
            span+span{
                margin-left: 20px;
            }
        }
        .radar{
            width: 680px;
            height: 680px;
            margin-top: 28px;
            z-index: 8;
            .radar-map{
                width: 94%;
            }
        }
        .baidu-map{
            width:100%;
            height: 100%;
            position: absolute;
            top:0px;
            left:0px;
            z-index: 9;
            transition: all ease-in-out 0.5s
        }
        .baidu-map.hidden{
            opacity: 0;
        }
    }
    .map-container.full-screen{
        width: 1920px;
        height: 1080px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        background: rgba(5,34,86,1);
    }
}
</style>