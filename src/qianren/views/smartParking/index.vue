<template>
  <div class="height-100">
    <layout formName='智慧停车场云平台'>
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="150"></number>
            <span>进场数量</span>
          </div>
          <div class="side-content">
            <ul class="list">
              <li class="">
                <h4 class="title">
                  <i class="iconfont icon-Statementstatistics"></i>
                  <span>24小时进出流量统计</span>
                </h4>
                <div class="chart">
                  <line-chart 
                   :data="parkFlow" 
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
                  <i class="iconfont icon-Thetotalamount"></i>
                  <span>24小时车场收入统计</span>
                </h4>
                <div class="chart">
                  <line-chart 
                   :data="income" 
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
              <li class="card">
                <h4 class="title">
                  <i class="iconfont icon-Turnoverrate_huaban"></i>
                  <span>项目周转率</span>
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
                    <li v-for="(item,i) in incomeRate" :key="i">
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
              <li class="card" >
                <h4 class="title">
                  <i class="iconfont icon-JTJC-Accountreceivable"></i>
                  <span>项目收入排名（万元）</span>
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
                    <li v-for="(item,i) in incomeRate" :key="i">
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
            <span>出场数量</span>
          </div>
          <div class="side-content">
            <el-scrollbar>
                <ul class="list">
                    <li :class="{alarm:item.isAlarm,unnormal:item.unNormal}" v-for="(item,i) in projectList" :key="item.ProjectID" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
                        <div class="clearfix">
                            <h4 class="l">{{item.ProjectName}}</h4>
                            <div class="r" style="margin-right:20px;line-height:36px;font-size:16px;">
                                <i class="iconfont icon-Turnoverrate_huaban"></i>
                                <span>80%</span>
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
                  <i class="iconfont icon-Park"></i>
                </p>
                <p>车场数</p>
              </div>
              <p class="l">{{count.DeviceCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Totalspace"></i>
                </p>
                <p>车位总数</p>
              </div>
              <p class="l">{{count.DeviceCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Usage"></i>
                </p>
                <p>使用率</p>
              </div>
              <p class="l">{{count.TodayAlarmCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Turnoverrate_huaban"></i>
                </p>
                <p>周转率</p>
              </div>
              <p class="l">{{count.TodayAlarmCount}}</p>
            </li>
          </ul>
          <div id="map">
            <ul class="map-left map-aside">
              <li>
                <div class="icon">
                    <p><i class="iconfont icon-JTJC-Accountreceivable"></i></p>
                    <p>应收金额（万元）</p>
                </div>
                <p class="value">{{count.DeviceCount||0}}</p>
              </li>
              <li>
                <div class="icon">
                    <p><i class="iconfont icon-JTJC-actualpayment"></i></p>
                    <p>实收金额（万元）</p>
                </div>
                <p class="value">{{count.DeviceCount||0}}</p>
              </li>
            </ul>
            <ul class="map-right map-aside">
              <li>
                <p class="value">{{count.DeviceCount||0}}</p>
                <div class="icon">
                    <p><i class="iconfont icon-Thetotalamount"></i></p>
                    <p>交易次数</p>
                </div>
              </li>
              <li>
                 <p class="value">{{count.DeviceCount||0}}</p>
                <div class="icon">
                    <p><i class="iconfont icon-JTJC-Pricespread"></i></p>
                    <p>差额（万元）</p>
                </div>
              </li>
            </ul>
            <echarts-map ref="map" ></echarts-map>
          </div>
          <div class="monitor-alarm">
            <h5><i class="iconfont icon-Numberofentry"></i> 实时进出场信息 <i class="iconfont icon-Up"></i></h5>
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
const OrderState = ['','进场', '已完成', '待接单', '待派单', '已逾期']
export default {
  data(){
    return {
      count:{
        ProjectCount:50,
        DeviceCount:500,
        TodayAlarmCount:0
      },
      parkFlow:{ //流量统计
        columns:['04:00','08:00','12:00','16:00','20:00','24:00'],
        rows:[
          {
            name:'进场数量',
            type:'line',
            data:[1000,500,1500,1200,400,300]
          },
          {
            name:'出场数量',
            type:'line',
            data:[500,1000,1200,700,600,400]
          },
        ]
      },
      income:{ //收入统计
        columns:['04:00','08:00','12:00','16:00','20:00','24:00'],
        rows:[
          {
            name:'应收金额',
            type:'line',
            data:[1000,500,1500,1200,400,300]
          },
          {
            name:'实收金额',
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
      alarmCount:[ //告警统计
        {
          type: "pie",
          radius: ["60", "68"],
          center: ["200", "80"],
          label: {
            show:true,
            formatter:'{b}:{c}%',
            textStyle:{
              fontSize: '16',
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
      incomeRate:[ //收入排名
        {
          AlarmTypeName:'中物互联',
          AlarmCount:99,
        },
        {
          AlarmTypeName:'新都汇',
          AlarmCount:98.5,
        },
        {
          AlarmTypeName:'腾讯科技',
          AlarmCount:97,
        },
        {
          AlarmTypeName:'物有所智',
          AlarmCount:81,
        },
        {
          AlarmTypeName:'大族科技',
          AlarmCount:74,
        }
      ],
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
              label: '进出时间',
              width: '20%',
              formatter:val => formatDate(val,'MM-DD HH:mm:ss')
          },
          {
              prop: 'AlarmText',
              label: '车场',
              width: '30%'
          },
          {
              prop: 'AlarmData',
              label: '车牌号',
              width: '15%'
          },
          {
              prop: 'OrderState',
              label: '进出状态',
              width: '15%',
              formatter:val => OrderState[val]
          },
      ],
      alarmData:[//实时告警数据
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
          OrderState:1
        },
        {
          ProjectName:'中物互联',
          AlarmTime:new Date(),
          AlarmText:'天安数码城停车场',
          AlarmData:'粤B88888',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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
              IconName:'icon-Thetotalamount',
              DeviceTypeName:'交易次数',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Accountreceivable',
              DeviceTypeName:'应收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-actualpayment',
              DeviceTypeName:'实收金额（万元）',
              AlarmCount:Math.floor(Math.random()*9+1),
              DeviceCount:Math.floor(Math.random()*49+1)
            },
            {
              IconName:'icon-JTJC-Pricespread',
              DeviceTypeName:'差额（万元）',
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