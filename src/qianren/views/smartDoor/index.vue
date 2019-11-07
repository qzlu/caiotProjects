<template>
  <div class="height-100">
    <layout formName='智慧门禁云平台'>
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="10"></number>
            <span>进门次数</span>
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
                  <i class="iconfont icon-FireDoor"></i>
                  <span>24小时出入次数统计</span>
                </h4>
                <div class="chart">
                  <line-chart 
                   :data="peopleFlow" 
                   yFormatter="{value}" 
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
                  <i class="iconfont icon-ZS-themanonwatch"></i>
                  <span>进出门身份分析</span>
                </h4>
                <div class="chart">
                  <pie-chart 
                    :series="peopleType"
                   :color='["#00D294","#FBA31E","#747474"]'
                   :showLegend="false"
                   >
                  </pie-chart>
                  <div class="border-dashed">
                    <p class="title">进出人数</p>
                    <p class="value">{{10500}}</p>
                  </div>
                </div>
              </li>
              <li>
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
            </ul>
          </div>
        </div>
        <div class="left-side project-list aside r"> 
          <div class="side-header clearfix" style="margin-left: 54px;">
            <number class="l" :data="20" ></number>
            <span>出门次数</span>
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
                                        <span>{{obj.DeviceCount||0}} </span>
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
          </ul>
          <div id="map">
            <echarts-map ref="map" ></echarts-map>
          </div>
          <div class="monitor-alarm">
            <h5><i class="iconfont icon-Numberofentry"></i> 实时进出门信息 <i class="iconfont icon-Up"></i></h5>
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
const OrderState = ['','进门', '已完成', '待接单', '待派单', '已逾期']
export default {
  data(){
    return {
      count:{
        ProjectCount:50,
        DeviceCount:500,
        TodayAlarmCount:0
      },
      deviceCounData:{ //设备类型数量统计
        columns:['指纹','刷卡','人脸','二维码','蓝牙'],
        rows: [{
            type:'bar',
            barWidth: 18,
            data:[200,60,110,150,80]
        }],
        colorsArr: ["rgba(24, 222, 148, 1)"]
      },
      peopleFlow:{ //出入次数统计
        columns:['04:00','08:00','12:00','16:00','20:00','24:00'],
        rows:[
          {
            name:'出门次数',
            type:'line',
            data:[1000,500,1500,1200,400,300]
          },
          {
            name:'进门次数',
            type:'line',
            data:[500,1000,1200,700,600,400]
          },
        ]
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
      peopleType:[ //进出门身份分析
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
              name: "访客",
              value: 35
            },
            {
              name: "业主",
              value: 35
            },
            {
              name: "陌生人",
              value: 30
            }
          ]
        },
      ],
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
              label: '门禁时间',
              width: '20%',
              formatter:val => formatDate(val,'MM-DD HH:mm:ss')
          },
          {
              prop: 'AlarmText',
              label: '进出位置',
              width: '30%'
          },
          {
              prop: 'AlarmData',
              label: '身份',
              width: '15%'
          },
          {
              prop: 'OrderState',
              label: '出入状态',
              width: '15%',
              formatter:val => OrderState[val]
          },
      ],
      alarmData:[//实时告警数据
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'业主',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'访客',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'陌生人',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'业主',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'陌生人',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'访客',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城正门',
          AlarmData:'陌生人',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
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
              IconName:'icon-Timeout1',
              DeviceTypeName:'运行',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-Fault',
              DeviceTypeName:'故障',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-FireDoor',
              DeviceTypeName:'进门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Goout',
              DeviceTypeName:'出门次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
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