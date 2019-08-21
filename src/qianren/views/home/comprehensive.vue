<template>
  <div class="compre-hensive">
    <div class="left-side aside l">
      <div class="side-header clearfix">
        <number class="l" :data="0"></number>
        <span>实时告警</span>
      </div>
      <ul class="side-content">
        <li class="card">
          <h4 class="title">
            <i class="icon-type iconfont icon-Equipment"></i>
            设备态势
            <i class="iconfont icon-Up"></i>
          </h4>
          <div class="pie-chart">
            <pie-chart
              :data="deviceCount"
              :color='["#00D294","#747474","#F19E40","#2A91FC", "#F1E240"]'
              :setting="{center:['98','50%']}"
            ></pie-chart>
            <div class="border-dashed">
              <p class="title">设备总数</p>
              <p class="value">{{count.DeviceCount}}</p>
            </div>
            <ul>
              <li v-for="(item,i) in deviceCount.rows||[]" :key="i">{{item.value}}</li>
            </ul>
          </div>
          <div class="top5">
            <h5>
              <p>设备类型完好率</p>
              <p>
                <span
                  :class="['sort-type','sort-type-'+sortType]"
                  @click="sortType = !sortType ;queryDeviceTypeRanking()"
                >
                  <i :class="['iconfont',sortType?'icon-Godown':'icon-Goup']"></i>
                </span>TOP5
              </p>
            </h5>
            <ul>
              <li v-for="(item,i) in intactRate" :key="i">
                <span class="index">{{i+1}}</span>
                <span class="device-type" :title="item.DeviceTypeName">{{item.DeviceTypeName}}</span>
                <div class="bar-out">
                  <div class="bar-inner" :style="{width:item.Report+'%'}"></div>
                </div>
                <span class="value">{{item.Report+'%'}}</span>
              </li>
            </ul>
          </div>
        </li>
        <li class="card">
          <h4 class="title">
            <i class="icon-type iconfont icon-JTJC-Totalenergyconsumption"></i>
            能耗态势
            <i class="iconfont icon-Up"></i>
          </h4>
          <ul class="item-list">
              <li>
                  <p class="label">计划电耗</p>
                  <p class="value">{{energyCount.PlanEnergy>10000?`${(energyCount.PlanEnergy/10000).toFixed(1)}W`:energyCount.PlanEnergy||'--'}}</p>
              </li>
              <li>
                  <p class="label">本月电耗</p>
                  <p class="value">{{energyCount.CurEnergy>10000?`${(energyCount.CurEnergy/10000).toFixed(1)}W`:energyCount.CurEnergy||'--'}}</p>
              </li>
              <li>
                  <p class="label">上月电耗</p>
                  <p class="value">{{energyCount.PriorEnergy>10000?`${(energyCount.PriorEnergy/10000).toFixed(1)}W`:energyCount.PriorEnergy||'--'}}</p>
              </li>
          </ul>
          <div class="chart">
              <bar-chart :data = 'energyChartData'></bar-chart>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-side aside r">
      <div class="side-header clearfix">
        <number class="l" :data="0"></number>
        <span>实时工单</span>
      </div>
      <ul class="side-content">
        <li class="card">
          <h4 class="title">
            <i class="icon-type iconfont icon-SZXFY-Earlywarning"></i>
            告警态势
            <i class="iconfont icon-Up"></i>
          </h4>
          <div class="pie-chart">
              <pie-chart :series='alarmCount' :color='["#00D294","#747474","#89192E","#F19E40"]' :setting="{center:['98','50%']}"></pie-chart>
              <div class="border-dashed">
                  <p class="title">今日告警</p>
                  <p class="value">{{count.TodayAlarmCount}}</p>
              </div>
              <ul>
                  <li v-for="(item,i) in alarmCount[0].data||[]" :key="i">
                      {{item.value}}
                  </li>
                  <li v-for="(item,i) in alarmCount[1].data||[]" :key="i+'2'">
                      {{item.value}}
                  </li>
              </ul>
          </div>
          <div class="top5">
              <h5>
                  <p>告警类型排名</p>
                  <p><span :class="['sort-type','sort-type-'+sortType1]" @click="sortType1 = !sortType1 ;queryAlarmRanking()"><i :class="['iconfont',sortType1?'icon-Godown':'icon-Goup']"></i></span>TOP5</p>
              </h5>
              <ul>
                  <li v-for="(item,i) in alarmIntactRate" :key="i">
                      <span class="index">{{i+1}}</span>
                      <span class="device-type" :title="item.AlarmTypeName">{{item.AlarmTypeName}}</span>
                      <div class="bar-out">
                          <div class="bar-inner" :style="{width:item.AlarmCount+'%'}">
                          </div>
                      </div>
                      <span class="value">{{item.AlarmCount+'%'}}</span>
                  </li>
              </ul>
          </div>
        </li>
        <li class="card">
          <h4 class="title">
            <i class="icon-type iconfont icon-Workingodd"></i>
            工单态势
            <i class="iconfont icon-Up"></i>
          </h4>
          <ul class="item-list">
              <li>
                  <p class="label">今日工单</p>
                  <p class="value">{{this.count.TodayOrder}}</p>
              </li>
              <li>
                  <p class="label">完成率</p>
                  <p class="value">{{this.count.CompletionRate}}%</p>
              </li>
              <li>
                  <p class="label">及时率</p>
                  <p class="value">{{this.count.Timeliness}}%</p>
              </li>
          </ul>
          <div class="chart">
              <bar-chart :data='orderChartData'></bar-chart>
          </div>
        </li>
      </ul>
    </div>
    <div class="main">
        <ul class="main-header">
            <li>
                <div class="l">
                    <p><i class="iconfont icon-Numberofentry"></i></p>
                    <p>项目数</p>
                </div>
                <p class="l">{{count.ProjectCount}}</p>
            </li>
            <li>
                <div class="l">
                    <p><i class="iconfont icon-Equipment"></i></p>
                    <p>设备数</p>
                </div>
                <p class="l">{{count.BlocDeviceCount}}</p>
            </li>
            <li>
                <div class="l">
                    <p><i class="iconfont icon-SZXFY-Earlywarning"></i></p>
                    <p>今日告警</p>
                </div>
                <p class="l">{{count.FaultCount}}</p>
            </li>
            <li>
                <div class="l">
                    <p><i class="iconfont icon-Workingodd"></i></p>
                    <p>今日工单</p>
                </div>
                <p class="l">{{count.MaintenanceCount}}</p>
            </li>
            <li>
                <div class="l">
                    <p><i class="iconfont icon-JTJC-Totalenergyconsumption"></i></p>
                    <p>本月电耗</p>
                </div>
                <p class="l">{{count.MaintenanceCount}}</p>
            </li>
        </ul>
        <div id="map" style="width:1080px;height:600px">
          <echarts-map @ready1="ready1"></echarts-map>
        </div>
    </div>
  </div>
</template>
<script>
import { number, pieChart, barChart } from "@/components/index.js";
import echartsMap from '../component/map.vue'
import { Promise } from 'q';
export default {
  data() {
    return {
        deviceCount:{
            colums:['运行','停止','告警','维修', '保养'],
            rows: [
                {
                  name: '运行',
                  value: 0
                },
                {
                    name: '停止',
                    value: 0
                },
                {
                    name: '告警',
                    value: 0
                },
                {
                    name: '维修',
                    value: 0
                },
                {
                    name: '保养',
                    value: 0
                }
            ]
        },
        alarmCount:[
            {
                type:'pie',
                radius: ["52", "60"],
                center:['98','50%'],
                label:{
                    show:false
                },
                data: [
                    {
                        name: '已恢复',
                        value: 200
                    },
                    {
                        name: '未恢复',
                        value: 50
                    }
                ]
            },
            {
                type:'pie',
                radius: ["39", "44"],
                center:['98','50%'],
                label:{
                    show:false
                },
                data: [
                    {
                        name: '严重',
                        value: 10
                    },
                    {
                        name: '一般',
                        value: 240
                    }
                ]
            }
        ],
        levelArr:[], //行政架构等级
        activeLevel:{}, //当前选中的架构等级
        count:{},//设备统计  告警统计 工单统计
        sortType:0,//设备完好率排序方式
        intactRate: [],//完好率排名
        sortType1:0,//告警排名排序方式 0 为降序
        alarmIntactRate: [], //告警排名
        energyCount:{}, //能耗统计
        energyChartData:{}, //分项能耗
        orderChartData:{},//工单类型柱形图数据
    };
  },
  components: {
    number,
    pieChart,
    barChart,
    echartsMap
  },
  created(){
  },
  methods:{
    ready1(level){
      this.activeLevel = level
      this.queryDeviceTypeRanking()
      this.queryBlocAlarmRanking()
    },
    /**
     * 综合态势（设备类型完好率 top 5）
     */
    queryDeviceTypeRanking(){
      this.$post('QueryBlocQueryDeviceTypeRanking',{
        Sort: this.sortType?'asc':'desc',
        BlocID: 1,
        IDStr: this.activeLevel.TORGNodeGuid
      })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        
      });
    },
    /**
     * 集团首页—综合态势（告警类型排名）
     */
    queryBlocAlarmRanking(){
      this.$post('/QueryBlocAlarmRanking',{
        Sort: this.sortType?'asc':'desc',
        IDStr: this.activeLevel.TORGNodeGuid
      })
      .then((result) => {
       console.log(result) 
      }).catch((err) => {
        
      });
    },  
    showMap(){
      let areaArr = [
        {name:'华南区',children:['guangxi','guangdong']},
        {name:'东北区',children:['heilongjiang','jilin','liaoning']},
        {name:'华北区',children:['beijing','tianjin','shanxi','hebei','neimenggu']},
        {name:'华东区',children:['shanghai','zhejiang','jiangsu','anhui','fujian','shandong','jiangxi']},
        {name:'华中区',children:['henan','hubei','hunan']},
        {name:'西南区',children:['sichuan','guizhou','yunnan','xizang','chongqing']},
        {name:'西北区',children:['gansu','qinghai','shanxi1','ningxia','xinjiang']},
        {name:'海南',children:['hainan']}
      ]
/*       let mapArr = areaArr.map(item => {
        let arr = []
        item.children.forEach(json => {
          let data = require(`@/qianren/mapJson/${json}.json`)
          data.features.forEach(obj => arr.push(...obj.geometry.coordinates))
        })
        return {
            "type": "Feature",
            "properties": {
              "name": item.name,
              "childNum": 3
            },
            "geometry": {
              "type": "MultiPolygon",
              "coordinates":arr,
            }
        }
      })
      let obj = {
        "type": "FeatureCollection",
        "features":mapArr
      } */
     /*  console.log(obj)
      echarts.registerMap('china',obj) */
      var dom = document.getElementById("map");
      var myChart = echarts.init(dom);
      var app = {};
      var option = null;
      option = {
          /* backgroundColor: '#001869', */
          tooltip: {
              trigger: 'item',
          },
          legend: {
              show:true,
              orient: 'vertical',
              left: 'left',
              data:['车辆']
          },
          visualMap: {
              show:true,
              min: 0,
              max: 2500,
              left: 'left',
              top: 'center',
              text: ['高','低'],           // 文本，默认为数值文本
              calculable: true,
              splitList: [   
                  {start: 500, end:600},{start: 400, end: 500},  
                  {start: 300, end: 400},{start: 200, end: 300},  
                  {start: 100, end: 200},{start: 0, end: 100},  
              ],  
              color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea']  
          },
      	dataRange: {
              orient: 'horizontal',
              min: 0,
              max: 55000,
              text: ['高', '低'],           // 文本，默认为数值文本
              splitList: [   
                {start: 500, end:600},{start: 400, end: 500},  
                {start: 300, end: 400},{start: 200, end: 300},  
                {start: 100, end: 200},{start: 0, end: 100},  
              ],  
              splitNumber: 0,
              color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea']  
          },
          geo: {
              map: 'china',
              roam:true,
              label: {
                show:true,
                color:'white',
                  emphasis: {
                      show: false
                  }
              },
              regions: [
              {
                  name: '南海诸岛', 
                  value: 0, 
                  itemStyle: 
                      {normal: 
                          {opacity: 0,
                          label: {
                              show: false
                              
                          }
                      }
                  }
              }],
              itemStyle: {
                  normal: {
                      areaColor: '#001869',
                      borderColor: '#0F459B'
                  },
                  emphasis: {
                      areaColor: '#174CFF'
                  }
              }
          },
          series: [
                {
                    name: '',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data:[{name:'中物互联',value:[118.316364,32.303627,100],id:4}],
                    symbol:'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAdCAYAAACqhkzFAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMzSURBVEhLzZX5U1JRFMchtVWn1QUds82QcC0XltgERlniiU9CEcSHySKglc3YWNNMm1rRoi0uOY5N/Z/fzn2Ygb6hyF/64QO8w7kf7j333IusrCoOeUUIsrMTkNVMQV6bJBI4VEufFTvUJHbjMkWc8mgMixGyvZScikDGhOcmKTmZhcTil9X0LrKTrCBEKYPijFwZo0SRgpxmJ6+O0mzoV/ewb8CfKFPOo6HNj6FAJwZGTOACA4gkPHD5B9FtH0a1WkBpHVumxGApjrUvoN3MYyrVhEisE+n7dmysG7G8bMCbjBHPFywYnbiFurZxqutfiMt73qPD6kd6pgm+oBaBCTfW14z4vt2zy8eVm4imHbjcNSYtyaVCv4I22yhSMyr0e43o5XgsvbbmCRmrX3QYi7mh1IRw4mJUWsao0C+jzRpAalqFXrcF180jePi4b5+Q8eGDAdOzfXDdHsQN6whU+iAudoapHAKOnI9lheVdGbSafSRsgslhRWN3CPEZF3582y/8xeaGFq9emzD32IbEXQfCNHNFi5AVHlM/RYvei2RaCaPThvp2AaFJT0GhFO2WAEpYN5Q2zKJZ40EypYTJZUVtqwBfeEByUCF6uSGUX6LDIa+OQ60lIc3QTEJFswA+VLyQH+NQeY1OnaxykoQcklRDo8Mm1sIvcEUvOZpy4HxHmAmjUOuyQkO/Tdy1yXThTZFi/okNKl2QhFWxXaGTN6GP55F5Z8lL3ljX4SuxvaXJi+fCWqrbPkJCVkMd1ZCEo4IG43E3llcsyLw14uWiGXOPbBiOeETYs5SMsbWpRf8QT0K6237NMBjRwu7l4Q3ycPu9MHt8UFPzHqWmPVwfo9ggFpfM+PxJj7VVHdbo9Hz5rBdZp2dfmGPCRM6SDTh5ZadBJTijnIDO4RcbOT7jEM+3kHAhMuWiBu+HhfPlC11DepxqpJ3aIyoK9vL/C6908UikVLBzRhy/QN2+N6komiMwOFyYfaDCcFiPqz0BnL5659/+TxhjsVt0/5mQedOBZy80SN7rg83r+32/FUuUjll61knb7iRZFiddoEcbCtzKhZAMHgTJ4EGQDB4EyeA/k8BPtvcXUxtnVqUAAAAASUVORK5CYII=',
/*                     symbolSize: function (val) {
                        return val[2] / 10;
                    }, */
                    symbolSize:20,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926',
                            shadowBlur: 0,
                            shadowColor: '#e63f3f'
                        }
                    }
                },
/*               {
                  name: '车辆',
                  type: 'map',
                  mapType: 'china',
                  showLegendSymbol : true,
                  symbolSize: function (val) {
                      return val[2] / 10;
                  },
                  roam: false,
                  label: {
                      normal: {
                          show: false,
                          color:'#ffffff',
                          position: ['50%', '50%']
                      },
                      emphasis: {
                          show: false
                      }
                  },
                  itemStyle: { 
                      normal: {
                          lineStyle: { type: 'solid', color:'#000' },
                          areaColor: '#001869',
                          label: { 
                              fontSize:16,
                              lineHeght:16,
                              height:16,
                              color:'#000',
                              show: true,
                          },
                          borderColor:'#0F459B'
                      },
                      emphasis: {
                      } 

                  },
                  emphasis: {
                      label: {
                          show: true
                      }
                  },
                  data:[{name:'广西',value:100}],
              }, */
          ]
      };;
      if (option && typeof option === "object") {
          myChart.setOption(option, true);
      }
      myChart.on('click', function (params) {   
               console.log(params);         //逻辑控制
      });
    }
  }
};
</script>
<style lang="scss">
$url: "../../../assets/image/";
.home {
  .compre-hensive {
    .aside {
      width: 413px;
      .side-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .card {
          width: 100%;
          height: 446px;
          background: url(#{$url}cloud/index/leftbar.png);
          background-size: 100% 100%;
          h4.title {
            line-height: 60px;
            padding: 0 37px 0 6px;
            text-align: left;
            font-size: 18px;
            font-weight: 400;
            .icon-type {
            }
            .iconfont.icon-Up {
              display: inline-block;
              transform: rotate(90deg);
              font-size: 24px;
            }
            p {
              position: relative;
              .sort-type {
                position: absolute;
                width: 16px;
                height: 18px;
                line-height: 18px;
                left: -20px;
                top: 12px;
                cursor: pointer;
                background: rgba(170, 29, 48, 1);
                border-radius: 4px;
                text-align: center;
                font-size: 16px;
                .iconfont {
                  font-size: 12px;
                  margin-right: 0;
                }
              }
              .sort-type.sort-type-true {
                background: #00d294;
              }
            }
          }
          .pie-chart {
            width: 100%;
            height: 142px;
            margin: 22px 0;
            position: relative;
            .border-dashed {
              position: absolute;
              width: 142px;
              height: 142px;
              border: 1px dashed #1a478b;
              border-radius: 50%;
              left: 27px;
              top: 0;
              z-index: 5;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .title {
                font-size: 12px;
                color: #f1f1f2;
              }
              .value {
                margin-top: 10px;
                font-size: 22px;
                color: #00d294;
              }
            }
            ul {
              position: absolute;
              height: 100%;
              top: 0;
              right: 40px;
              text-align: right;
              font-size: 17px;
              color: #f1f1f2;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }
          .top5 {
            padding: 0 22px;
            h5 {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              p {
                position: relative;
                .sort-type {
                  position: absolute;
                  width: 16px;
                  height: 18px;
                  line-height: 18px;
                  left: -20px;
                  top: -4px;
                  cursor: pointer;
                  background: rgba(170, 29, 48, 1);
                  border-radius: 4px;
                  .iconfont {
                    font-size: 12px;
                  }
                }
                .sort-type.sort-type-true {
                  background: #00d294;
                }
              }
            }
            ul {
              margin-top: 10px;
              li {
                display: flex;
                align-items: center;
                line-height: 30px;
                font-size: 14px;
                .index {
                  margin-right: 10px;
                }
                .device-type {
                  width: 80px;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .bar-out {
                  width: 140px;
                  height: 8px;
                  .bar-inner {
                    width: 0;
                    height: 100%;
                    transition: 0.3s;
                    background: #18de94;
                  }
                }
                .value {
                  width: 50px;
                  text-align: right;
                }
              }
            }
          }
          .item-list {
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
            line-height: 40px;
            color: #607ab3;
            li {
              .label {
                font-size: 16px;
              }
              .value {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
    .main {
      margin: 0 423px;
    }
  }
}
</style>
