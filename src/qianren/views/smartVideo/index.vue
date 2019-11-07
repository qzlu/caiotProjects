<template>
  <div class="height-100">
    <layout formName='智慧视频云平台'>
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="10"></number>
            <span>实时告警</span>
          </div>
          <div class="side-content">
            <ul class="list">
              <li class="">
                <h4 class="title">
                  <i class="iconfont icon-Numberofwarning"></i>
                  <span>告警类型统计</span>
                </h4>
                <div class="chart" style="height:180px;top:-20px">
                  <pie-chart 
                    :series="alarmCount"
                   :color='["#2A91FC","#FBA31E","#747474","#00D294"]'
                   :showLegend="false"
                   >
                  </pie-chart>
                  <div class="border-dashed" style="top:20px;">
                  </div>
                </div>
              </li>
              <li style="height:676px;">
                <h4 class="title">
                  <i class="iconfont icon-Camera"></i>
                  <span>集团重点视频监测</span>
                </h4>
                <div class="video-container">
                    <el-scrollbar>
                        <ul class="video-list">
                          <li :class="{'top10':i>1}" v-for="(item,i) in 10" :key="i">
                              <img src="@/disanping/assets/image/bg_img_2.jpg" alt="">
                          </li>
                        </ul>
                    </el-scrollbar>
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
                    <li v-for="(item,i) in projectList" :key="i">
                        <div class="clearfix">
                            <h4 class="l">{{item.ProjectName}}</h4>
                            <div class="r" style="margin-right:20px;line-height:36px;font-size:16px;">
                                <i class="iconfont icon-Equipment"></i>
                                <span>{{item.DeviceCount}}</span>
                            </div>
                        </div>
                        <div class="project-video">
                            <img src="@/disanping/assets/image/bg_img_2.jpg" alt="">
                            <div class="more">
                                全部<i class="el-icon-d-arrow-right"></i>
                            </div>
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
                  <i class="iconfont icon-Camera"></i>
                </p>
                <p>重点视屏</p>
              </div>
              <p class="l">{{count.TodayAlarmCount}}</p>
            </li>
          </ul>
          <div id="map">
            <echarts-map ref="map" ></echarts-map>
          </div>
          <div class="monitor-alarm">
            <h5><i class="iconfont icon-Incident"></i> 实时异常事件 <i class="iconfont icon-Up"></i></h5>
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
      alarmCount:[ //告警类型统计
        {
          type: "pie",
          radius: ["0","58"],
          center: ["200", "60%"],
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
              name: "黑名单",
              value: 10,
              selected:true
            },
            {
              name: "非法开门",
              value: 15,
              selected:true
            },
            {
              name: "高危人员",
              value: 10,
              selected:true
            },
            {
              name: "重要区域入侵",
              value: 65,
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
              label: '安装位置',
              width: '30%'
          },
          {
              prop: 'AlarmData',
              label: '事件',
              width: '15%'
          },
          {
              prop: 'OrderState',
              label: '位置',
              width: '15%',
          },
      ],
      alarmData:[//实时告警数据
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城大门',
          AlarmData:'越界告警',
          OrderState:'周界'
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

  },
  methods:{

  }
}
</script>
<style lang="scss">
</style>