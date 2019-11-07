<template>
  <div class="height-100">
    <layout formName='给排水云平台'>
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="10"></number>
            <span>实时告警</span>
          </div>
          <div class="side-content">
            <ul class="list">
              <li class="">
                <h4 class="title">
                  <i class="iconfont icon-Statementstatistics"></i>
                  <span>设备类型数量统计</span>
                </h4>
                <div class="chart">
                  <bar-chart :data="deviceCounData" :grid="{top:'20',left:'10',right:'10',bottom:'10',containLabel: true}" lableRotate="0"></bar-chart>
                </div>
              </li>
              <li class="">
                <h4 class="title">
                  <i class="iconfont icon-Usage"></i>
                  <span>设备类型完好率</span>
                </h4>
                <div class="chart">
                  <line-chart 
                   :data="deviceAvailability" 
                   yFormatter="{value}%" 
                   :color="['rgba(42, 145, 252, 1)','rgba(24, 222, 148, 1)']" 
                   :grid="{top:'20',left:'10',right:'20',bottom:'10',containLabel: true}" 
                   :legend="{top:'0px',
                    right:'10px',
                    icon:'circle',
                    itemWidth:10,
                    textStyle: {
                      fontWeight: 'normal', //标题颜色
                      color: '#F1F2F2'
                    }}">
                  </line-chart>
                </div>
              </li>
              <li class="">
                <h4 class="title">
                  <i class="iconfont icon-Numberofwarning"></i>
                  <span>告警统计</span>
                </h4>
                <div class="chart">
                  <pie-chart 
                    :series="alarmCount"
                   :color='["#03cd82","rgba(137, 25, 46, 1)"]'
                   :showLegend="false"
                   >
                  </pie-chart>
                  <div class="border-dashed">
                    <p class="title">今日告警</p>
                    <p class="value">{{20}}</p>
                  </div>
                </div>
              </li>
              <li class="card">
                <h4 class="title">
                  <i class="iconfont icon-Statementstatistics"></i>
                  <span>告警类型排名</span>
                  <p class="r" style="margin-right:0">
                    <span
                      :class="['sort-type','sort-type-'+sortType]"
                      style="top:-4px"
                      @click="sortType = !sortType ;"
                    >
                      <i :class="['iconfont',sortType?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP5
                  </p>
                </h4>
                <div class="chart" style="height:180px;">
                  <ul>
                    <li v-for="(item,i) in alarmIntactRate" :key="i">
                      <span class="index">{{i+1}}</span>
                      <span class="device-type" :title="item.AlarmTypeName">{{item.AlarmTypeName}}</span>
                      <div class="bar-out">
                        <div class="bar-inner" :style="{width:item.AlarmCount+'%'}"></div>
                      </div>
                      <span class="value">{{item.AlarmCount+'%'}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="left-side project-list aside r"> 
          <div class="side-header clearfix" style="margin-left: 54px;">
            <number class="l" :data="20" ></number>
            <span>今日告警</span>
          </div>
          <div class="side-content">
            <el-scrollbar>
                <ul class="list">
                    <li :class="{alarm:item.isAlarm,unnormal:item.unNormal}" v-for="(item,i) in projectList" :key="item.ProjectID" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
                        <div class="clearfix">
                            <h4 class="l">{{item.ProjectName}}</h4>
                            <div class="r" style="margin-right:20px;line-height:36px;font-size:16px;">
                                <i class="iconfont icon-Equipment"></i>
                                <span :class="{red:item.AlarmCount>0}">{{item.AlarmCount}}</span> / {{item.DeviceCount}}
                            </div>
                        </div>
                        <div class="list-content">
                           <div class="statu"></div>
                            <ul class="param">
                                <li v-for="(obj,j) in item.data.slice(0,4)" :key="j">
                                    <p class="l">
                                        <i :class="['iconfont',obj.IconName||'icon-FireControl']"></i>
                                        {{obj.DeviceTypeName||'变压器'}}
                                    </p>
                                    <span class="value">
                                        <span :class="{red:obj.AlarmCount>0}">{{obj.AlarmCount||0}} </span>/ {{obj.DeviceCount||0}}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </el-scrollbar>
          </div>
        </div>
        <div class="main">
          <ul class="main-header">
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Numberofentry"></i>
                </p>
                <p>项目数</p>
              </div>
              <p class="l">{{count.ProjectCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Equipment"></i>
                </p>
                <p>设备数</p>
              </div>
              <p class="l">{{count.DeviceCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Usage"></i>
                </p>
                <p>设备完好率</p>
              </div>
              <p class="l">{{count.TodayAlarmCount}}</p>
            </li>
          </ul>
          <div id="map">
            <echarts-map ref="map" ></echarts-map>
          </div>
          <div class="monitor-alarm">
            <h5><i class="iconfont icon-SZXFY-Earlywarning"></i> 实时告警 <i class="iconfont icon-Up"></i></h5>
            <table class="table-header">
              <tr>
                <th v-for="(item,i) in alarmLabels" :key="i" :width='item.width' :style="{'text-align':item.align}">{{item.label}}</th>
              </tr>
            </table>
            <div class="table-body" v-if="alarmData.length>0">
                <el-scrollbar>
                    <table>
                      <tr v-for="(obj,i) in alarmData" :key="i" @click="rowClick(obj)">
                        <td v-for="(item,j) in alarmLabels" :key="j" :width='item["width"]' :style="{'text-align':item.align,'color':item.color}" :title="item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]">{{item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]}}</td>
                      </tr>
                    </table>
                </el-scrollbar>
            </div>
          </div>
        </div>
    </layout>
  </div>
</template>
<script>
import { number, pieChart, barChart,lineChart } from "@/components/index.js";
import echartsMap from "../component/map.vue";
import layout from '../component/layout.vue'
import formatDate from '../../../utils/formatDate';
const OrderState = ['','待完成', '已完成', '待接单', '待派单', '已逾期']
import axios from 'axios';
export default {
  data(){
    return {
      count:{
        ProjectCount:50,
        DeviceCount:500,
        TodayAlarmCount:0
      },
      deviceCounData:{ //设备类型数量统计
        columns:['生活水泵','生活水池','生活污水泵','生活管网'],
        rows: [{
            type:'bar',
            barWidth: 18,
            data:[200,60,110,150]
        }],
        colorsArr: ["rgba(24, 222, 148, 1)"]
      },
      deviceAvailability:{ //设备类型完好率
        columns:['生活水泵','生活水池','生活污水泵','生活管网'],
        rows:[
          {
            name:'实际',
            type:'line',
            data:[100,50,20,60]
          },
          {
            name:'标准',
            type:'line',
            data:[50,30,70,82]
          },
        ]
      },
      alarmCount:[ //告警统计
        {
          type: "pie",
          radius: ["60", "68"],
          center: ["200", "80"],
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
            length2: 20,
            lineStyle:{
              color:'#B6C0DC',
              type:'dashed'
            }
          },
          data: [
            {
              name: "已恢复",
              value: 80
            },
            {
              name: "未恢复",
              value: 20
            }
          ]
        },
      ],
      sortType:false,
      alarmIntactRate:[
        {
          AlarmTypeName:'温度过高',
          AlarmCount:99,
        },
        {
          AlarmTypeName:'温度过低',
          AlarmCount:98.5,
        },
        {
          AlarmTypeName:'电压过高',
          AlarmCount:97,
        },
        {
          AlarmTypeName:'电压过低',
          AlarmCount:81,
        },
        {
          AlarmTypeName:'水浸',
          AlarmCount:74,
        }
      ],
      alarmLabels:[
          {
              prop: 'ProjectName',
              label: '项目名称',
              width: '20%'
          },
          {
              prop: 'AlarmTime',
              label: '告警时间',
              width: '20%',
              formatter:val => formatDate(val,'MM-DD HH:mm:ss')
          },
          {
              prop: 'AlarmText',
              label: '告警内容',
              width: '30%'
          },
          {
              prop: 'AlarmData',
              label: '当前值',
              width: '15%'
          },
          {
              prop: 'OrderState',
              label: '工单状态',
              width: '15%',
              formatter:val => OrderState[val]
          },
      ],
      alarmData:[//实时告警数据
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'1#配电柜过流',
          AlarmData:'888',
          OrderState:1
        },
      ],
      projectList:[ //项目列表
        {
          ProjectName:'中物互联',
          ProjectID:1,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
          ]
        },
        {
          ProjectName:'大族科技中心',
          ProjectID:2,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
          ]
        },
        {
          ProjectName:'易尚',
          ProjectID:3,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
          ]
        },
        {
          ProjectName:'新都汇',
          ProjectID:4,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
          ]
        },
        {
          ProjectName:'物有所智',
          ProjectID:5,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
          ]
        },
              {
          ProjectName:'腾讯科技',
          ProjectID:6,
          AlarmCount:1,
          DeviceCount:Math.floor(Math.random()*99+1),
          data:[
            {
              IconName:'',
              DeviceTypeName:'生活水泵',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            }
          ]
        },
      ]
    }
  },
  components:{
    layout,
    number,
    pieChart,
    barChart,
    lineChart,
    echartsMap
  },
  created(){
    this.getData()
  },
  methods:{
    getData(){
      axios.get('http://47.106.64.130:58087/api/v1/GetImage?token=34020000001320000002&session=bd22d3d6-2669-425e-af21-bd84c553e044')
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        
      });
    }
  }
}
</script>
<style lang="scss">
</style>