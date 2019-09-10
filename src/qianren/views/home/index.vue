<template>
  <div class="home qianren">
    <div class="header">
      <el-button v-if="$route.path !=='/' " @click="$router.back()" class="back">
        <i class="icon el-icon-arrow-left"></i>返回
      </el-button>
      <span class="title">{{projectName}}智服云平台</span>
      <ul class="clearfix">
        <li class="l icon" v-if="$route.path !=='/'">
          <router-link :to="`/manage`" class="icon-item">
            <i class="iconfont icon-zs-backstage"></i>
          </router-link>
        </li>
        <li class="l icon">
            <router-link :to="`/manage`"  class="icon-item">
                <i class="iconfont icon-zs-backstage"></i>
            </router-link>
        </li>
        <li class="l icon" @click="switchAudio">
          <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
        </li>
        <li class="l icon">
          <el-dropdown>
            <div class="el-dropdown-link icon-item">
              <i class="iconfont icon-User"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="show = true">设置密码</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="l user-name">{{user}}</li>
        <!-- <set-password :show.sync='show' @confirm="changePassword"></set-password> -->
      </ul>
      <ul class="menu">
        <li :class="['menu-item',{'active':activeIndex ==0}]" @click="changeRoute(0)">集团态势</li>
        <li :class="['menu-item',{'active':activeIndex ==1}]" @click="changeRoute(1)">系统总览</li>
        <li :class="['menu-item',{'active':activeIndex ==2}]" @click="changeRoute(2)">综合排名</li>
        <li id="tree-project" class="menu-item" >
            <p @click="showProjectList = !showProjectList">项目导航 <i :class="showProjectList?'el-icon-caret-top':'el-icon-caret-bottom'"></i></p>
            <div class="tree-project" v-if="showProjectList">
                <div class="filter-box">
                    <el-input
                      placeholder="搜索关键字"
                      v-model="filterText">
                      <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                </div>
                <div class="tree-content">
                    <el-scrollbar>
                        <el-tree
                            ref="tree"
                           :data="treeData"
                           :props="treeProp"
                           default-expand-all
                           @node-click="slectBlock"
                           :expand-on-click-node="false"
                           :filter-node-method="filterNode"
                        >
                          <template v-slot="{node,data}">
                            <div>
                              <span v-if="data.FNodeType == 1">{{data.FSimpleName}}</span>
                              <a v-if="data.FNodeType == 2" :href="`https://www.szqianren.com/#/monitoring/systemBrowse?token=${token}&projectID=${data.ProjectID}&showMenu=2`" target="_blank">{{data.FSimpleName}}</a>
                            </div>
                          </template>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
        </li>
      </ul>
    </div>
    <div>
      <div class="compre-hensive">
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="count.RealAlarmCount"></number>
            <span>实时告警</span>
          </div>
          <ul class="side-content" v-if="activeIndex ==0">
            <li class="card">
              <h4 class="title">
                <i class="icon-type iconfont icon-Equipment"></i>
                设备态势
                <i class="iconfont icon-Up"></i>
              </h4>
              <div class="border">
              </div>
              <div class="icon">
              </div>
              <div class="pie-chart">
                <pie-chart
                  :data="deviceCount"
                  :color='["#03cd82","#b2b2b2","#Fe0000","#fe9a00", "#0eaff8"]'
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
              <div class="border">
              </div>
              <div class="icon">
              </div>
              <ul class="item-list">
                <li>
                  <p class="label">计划电耗</p>
                  <p
                    class="value"
                  >{{count.PlanElectrics>10000?`${(count.PlanElectrics/10000).toFixed(1)}万`:count.PlanElectrics||'--'}}</p>
                </li>
                <li>
                  <p class="label">本月电耗</p>
                  <p
                    class="value"
                  >{{count.ActualElectric>10000?`${(count.ActualElectric/10000).toFixed(1)}万`:count.ActualElectric||'--'}}</p>
                </li>
                <li>
                  <p class="label">上月电耗</p>
                  <p
                    class="value"
                  >{{count.LastMonthElectric>10000?`${(count.LastMonthElectric/10000).toFixed(1)}万`:count.LastMonthElectric||'--'}}</p>
                </li>
              </ul>
              <div class="chart">
                <bar-chart :data="energyChartData"></bar-chart>
              </div>
            </li>
          </ul>
          <div class="side-content" v-if="activeIndex ==1">   
            <ul class="list" >
                <li :class="{alarm:item.FState>0}" v-for="(item,i) in systemList[0]||[]" :key="i">
                    <a v-if="item.FUrl" :href="item.FUrl" target="_blank">
                    </a>
                    <h4>
                       <i :class="['iconfont',item.IconName]"></i>
                       <span>{{item.SystemParamName}}</span>
                       <i class="iconfont icon-Up"></i>
                        <p class="r">
                            <i class="iconfont icon-Equipment"></i>
                            <span :class="{red:item.AlarmCount>0}">{{item.AlarmCount}}</span> / {{item.DeviceCount}}
                        </p>
                    </h4>
                    <div class="border">
                    </div>
                    <div class="icon">
                    </div>
                    <div class="list-content">
                        <div :class="['statu1',{alarm:item.FState>0}]">
                          {{item.FState>0?'告警':'正常'}}
                        </div>
                        <ul class="param">
                            <li v-for="(obj,j) in item.DeviceTypeInfo.slice(0,4)" :key="j">
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
          </div>
          <ul class="side-content" v-if="activeIndex ==2">
              <li class="card">
                <h4 class="title">
                  <i class="icon-type iconfont icon-Equipment"></i>
                  设备完好率排名
                  <i class="iconfont icon-Up"></i>
                  <p class="r">
                    <span
                      :class="['sort-type','sort-type-'+sortType2]"
                      @click="sortType2 = !sortType2 ;queryBlocQueryDeviceRanking()"
                    >
                      <i :class="['iconfont',sortType2?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP10
                  </p>
                </h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <div class="top5">
                    <ul>
                        <li>
                            <span class="index" >排名</span>
                            <span class="device-type">{{activeLevel.FLevelName}}</span>
                            <div class="bar-out">
                            </div>
                            <span class="value">完好率</span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(item,i) in intactRateTop10" :key="i">
                            <span class="index">{{i+1}}</span>
                            <span class="device-type" :title="item.GroupName">{{item.GroupName}}</span>
                            <div class="bar-out">
                              <div class="bar-inner" :style="{width:(item.Report||0)+'%'}"></div>
                            </div>
                            <span class="value">{{(item.Report||0) +'%'}}</span>
                        </li>
                    </ul>
                </div>
              </li>
              <li class="card">
                <h4 class="title">
                  <i class="icon-type iconfont icon-JTJC-Totalenergyconsumption"></i>
                  本月电耗排名
                  <i class="iconfont icon-Up"></i>
                  <p class="r">
                    <span
                      :class="['sort-type','sort-type-'+sortType3]"
                      @click="sortType3 = !sortType3 ;queryBlocQueryEnergyByMonth()"
                    >
                      <i :class="['iconfont',sortType3?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP10
                  </p>
                </h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <div class="top5 energy-rate">
                    <ul>
                        <li>
                            <span class="index" >排名</span>
                            <span class="device-type">{{activeLevel.FLevelName}}</span>
                            <div class="bar-out" style="height:auto">
                              计划用量（kwh）
                            </div>
                            <span class="value">本月用量（kwh）</span>
                        </li>
                    </ul>
                    <ul class="list-body">
                        <li v-for="(item,i) in energyRate" :key="i">
                            <span class="index">{{i+1}}</span>
                            <span class="device-type" :title="item.GroupName">{{item.GroupName}}</span>
                            <div class="bar-out" style="height:auto">
                              {{item.EnergyPlanUsage||'- -'}}
                            </div>
                            <span class="value">{{item.Energy}}</span>
                        </li>
                    </ul>
                </div>
              </li>
          </ul>
        </div>
        <div class="left-side aside r">
          <div class="side-header clearfix" style="margin-left: 54px;">
            <number class="l" :data="count.RealOrderCount"></number>
            <span>实时工单</span>
          </div>
          <ul class="side-content" v-if="activeIndex ==0">
            <li class="card">
              <h4 class="title">
                <i class="icon-type iconfont icon-SZXFY-Earlywarning"></i>
                告警态势
                <i class="iconfont icon-Up"></i>
              </h4>
              <div class="border">
              </div>
              <div class="icon">
              </div>
              <div class="pie-chart">
                <pie-chart
                  :series="alarmCount"
                  :color='["#03cd82","#b2b2b2","#fe0000","#fde801"]'
                  :setting="{center:['98','50%']}"
                ></pie-chart>
                <div class="border-dashed">
                  <p class="title">今日告警</p>
                  <p class="value">{{count.TodayAlarmCount}}</p>
                </div>
                <ul>
                  <li v-for="(item,i) in alarmCount[0].data||[]" :key="i">{{item.value}}</li>
                  <li v-for="(item,i) in alarmCount[1].data||[]" :key="i+'2'">{{item.value}}</li>
                </ul>
              </div>
              <div class="top5">
                <h5>
                  <p>告警类型排名</p>
                  <p>
                    <span
                      :class="['sort-type','sort-type-'+sortType1]"
                      @click="sortType1 = !sortType1 ;queryBlocAlarmRanking()"
                    >
                      <i :class="['iconfont',sortType1?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP5
                  </p>
                </h5>
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
            <li class="card">
              <h4 class="title">
                <i class="icon-type iconfont icon-Workingodd"></i>
                工单态势
                <i class="iconfont icon-Up"></i>
              </h4>
              <div class="border">
              </div>
              <div class="icon">
              </div>
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
                <bar-chart :data="orderChartData"></bar-chart>
              </div>
            </li>
          </ul>
          <div class="side-content" v-if="activeIndex ==1">   
            <ul class="list" >
                <li :class="{alarm:item.FState>1}" v-for="(item,i) in systemList[1]||[]" :key="i">
                    <a v-if="item.FUrl" :href="item.FUrl" target="_blank">
                    </a>
                    <h4>
                       <i :class="['iconfont',item.IconName]"></i>
                       <span>{{item.SystemParamName}}</span>
                       <i class="iconfont icon-Up"></i>
                        <p class="r">
                            <i class="iconfont icon-Equipment"></i>
                            <span :class="{red:item.AlarmCount>0}">{{item.AlarmCount}}</span> / {{item.DeviceCount}}
                        </p>
                    </h4>
                    <div class="border">
                    </div>
                    <div class="icon">
                    </div>
                    <div class="list-content">
                        <div :class="['statu1',{alarm:item.FState>0}]">
                          {{item.FState>0?'告警':'正常'}}
                        </div>
                        <ul class="param">
                            <li v-for="(obj,j) in item.DeviceTypeInfo.slice(0,4)" :key="j">
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
          </div>
          <ul class="side-content" v-if="activeIndex ==2">
              <li class="card">
                <h4 class="title">
                  <i class="icon-type iconfont icon-SZXFY-Earlywarning"></i>
                  告警恢复率排名
                  <i class="iconfont icon-Up"></i>
                  <p class="r">
                    <span
                      :class="['sort-type','sort-type-'+sortType4]"
                      @click="sortType4 = !sortType4 ;queryBlocQueryAlarmRanking()"
                    >
                      <i :class="['iconfont',sortType4?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP10
                  </p>
                </h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <div class="top5">
                    <ul>
                        <li>
                            <span class="index" >排名</span>
                            <span class="device-type">{{activeLevel.FLevelName}}</span>
                            <div class="bar-out" style="height:auto">
                                已恢复 / 未恢复
                            </div>
                            <span class="value">恢复率</span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(item,i) in recoverRate" :key="i">
                            <span class="index">{{i+1}}</span>
                            <span class="device-type" :title="item.GroupName">{{item.GroupName}}</span>
                            <div class="bar-out" style="background:#AA1D30">
                              <div class="bar-inner" :title="(item.Report||0) +'%'" :style="{width:(item.Report||0)+'%'}"></div>
                            </div>
                            <span class="value">{{(item.Report||0) +'%'}}</span>
                        </li>
                    </ul>
                </div>
              </li>
              <li class="card">
                <h4 class="title">
                  <i class="icon-type iconfont icon-Workingodd"></i>
                  工单数量排名
                  <i class="iconfont icon-Up"></i>
                  <p class="r">
                    <span
                      :class="['sort-type','sort-type-'+sortType5]"
                      @click="sortType5 = !sortType5 ;queryBlocQueryOrderByCount()"
                    >
                      <i :class="['iconfont',sortType5?'icon-Godown':'icon-Goup']"></i>
                    </span>TOP10
                  </p>
                </h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <div class="top5 energy-rate">
                    <ul>
                        <li>
                            <span class="index" >排名</span>
                            <span class="device-type">{{activeLevel.FLevelName}}</span>
                            <div class="bar-out">
                              未完成 / 已完成
                            </div>
                            <span class="value">工单数量</span>
                        </li>
                    </ul>
                    <ul class="list-body">
                        <li v-for="(item,i) in orderRate" :key="i">
                            <span class="index">{{i+1}}</span>
                            <span class="device-type" :title="item.GroupName">{{item.FORGName}}</span>
                            <div class="bar-out">
                              <span :class="item.NotRecoveryCount>0&&'red'">{{item.NotRecoveryCount}}</span> / {{item.RecoveryCount}}
                            </div>
                            <span class="value">{{item.OrderCount||0}}</span>
                        </li>
                    </ul>
                </div>
              </li>
          </ul>
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
                  <i class="iconfont icon-SZXFY-Earlywarning"></i>
                </p>
                <p>今日告警</p>
              </div>
              <p class="l">{{count.TodayAlarmCount}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-Workingodd"></i>
                </p>
                <p>今日工单</p>
              </div>
              <p class="l">{{count.TodayOrder}}</p>
            </li>
            <li>
              <div class="l">
                <p>
                  <i class="iconfont icon-JTJC-Totalenergyconsumption"></i>
                </p>
                <p>本月电耗</p>
              </div>
              <p class="l">{{count.ActualElectric>10000?`${(count.ActualElectric/10000).toFixed(1)}万`:count.ActualElectric||'--'}}</p>
            </li>
          </ul>
          <div id="map" style="100%;height:600px">
            <echarts-map ref="map" @ready1="ready1" @change="queryData" @click-area="areaClick" :block="currentBlock"></echarts-map>
            <div style="height:310px">
                <monitorData :alarmData='alarmData' :orderData='orderData'></monitorData>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { number, pieChart, barChart } from "@/components/index.js";
import echartsMap from "../component/map.vue";
import monitorData from "./monitorData.vue"
import { setPassword } from "@/components/index.js";
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      user: sessionStorage.getItem("FContacts"), //用户名
      projectName: sessionStorage.getItem("FGroupName")||'中物运营',
      token:sessionStorage.getItem('FToken'),
      isOpen: 1,
      guid:{IDStr:0}, //查询的IDStr
      currentBlock:{},
      userType:sessionStorage.getItem('FUserType'),
      activeIndex:sessionStorage.getItem('activeIndex')||0,
      deviceCount: {
        colums: ["运行", "停止", "告警", "维修", "保养"],
        rows: [
          {
            name: "运行",
            value: 0
          },
          {
            name: "停止",
            value: 0
          },
          {
            name: "告警",
            value: 0
          },
          {
            name: "维修",
            value: 0
          },
          {
            name: "保养",
            value: 0
          }
        ]
      },
      alarmCount: [
        {
          type: "pie",
          radius: ["52", "60"],
          center: ["98", "50%"],
          label: {
            show: false
          },
          data: [
            {
              name: "已恢复",
              value: 200
            },
            {
              name: "未恢复",
              value: 50
            }
          ]
        },
        {
          type: "pie",
          radius: ["39", "44"],
          center: ["98", "50%"],
          label: {
            show: false
          },
          data: [
            {
              name: "严重",
              value: 10
            },
            {
              name: "一般",
              value: 240
            }
          ]
        }
      ],
      levelArr: [], //行政架构等级
      activeLevel: {}, //当前选中的架构等级
      count: {}, //设备统计  告警统计 工单统计
      sortType: 0, //设备完好率排序方式
      intactRate: [], //完好率排名
      sortType1: 0, //告警排名排序方式 0 为降序
      alarmIntactRate: [], //告警排名
      energyCount: {}, //能耗统计
      energyChartData: {}, //分项能耗
      orderChartData: {}, //工单类型柱形图数据
      alarmData:[],
      orderData:[],
      systemList:[], //系统态势列表
      treeData:[],
      showProjectList:false, //项目导航下拉
      treeProp:{
          children:'ListData',
          label:'FSimpleName'
      },
      filterText:'',
      intactRateTop10:[], //综合排名设备完好率排名
      recoverRate:[], //恢复率
      energyRate:[], //本月能耗排名
      orderRate:[], //工单数量排名
      sortType2:0, //完好率排序方式
      sortType3:0, //能耗排名排序方式
      sortType4:0, //告警恢复率排序方式
      sortType5:0, //工单数量排名排序方式
      timer:null
    };
  },
  components: {
    setPassword,
    number,
    pieChart,
    barChart,
    echartsMap,
    monitorData
  },
  watch: {
    filterText(val){
        this.$refs.tree.filter(val);
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      let el = document.querySelector('#tree-project')
      document.addEventListener('click', (e) => {
        if(!el.contains(e.target)){
          this.showProjectList = false
        }
      })
    })
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    /**
     * 切换TAB
     * @param {Number}
     */
    changeRoute(index){
        this.activeIndex = index,
        sessionStorage.setItem('activeIndex',index)
        this.queryData()
    },
    /**
     * 退出
     */
    logOut() {
      this.$router.push("/login");
    },
    /**
     * 修改密码
     */
    changePassword(newPsd, oldPsd) {
      System({
        FAction: "UpadatePassword",
        NewFPassword: newPsd,
        FPassword: oldPsd
      })
        .then(data => {
          this.$message({
            type: "success",
            message: "密码修改成功,3秒后退出登录",
            druration: 1000
          });
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        })
        .catch(err => {});
    },
    /**
     * 切换声音开关
     */
    switchAudio() {
      if (this.isOpen == 1) {
        this.isOpen = 0;
        localStorage.setItem("open", 0);
        document.getElementById("myAudio").pause();
      } else {
        this.isOpen = 1;
        localStorage.setItem("open", 1);
      }
    },
    ready1(level) {
      this.queryProject()
      this.queryData()
      this.queryBlocEnergyByMonth();
      this.queryBlocQueryEnergyByMonth()
    },
    /**
     * 点击地图上的区域时
     * @param {String} FAreaCode 区域，城市，编码
     */
    areaClick(FAreaCode){
        this.guid.IDStr = FAreaCode
        this.queryData()
        this.queryBlocEnergyByMonth();
        this.queryBlocQueryEnergyByMonth()
    },
    queryData(){
      clearTimeout(this.timer)
      this.timer = null
      this.queryDeviceTypeRanking();
      this.queryBlocAlarmRanking();
      this.queryBlocCompleteOrder();
      this.queryUSituationStatistics()
      this.queryBlocAlarmRealData()
      this.queryBlocPageUOrdersByDate()
      if(this.activeIndex == 1){
        this.queryBlocSystemAlarmByCount()
      }
      if(this.activeIndex == 2){
        this.queryBlocQueryDeviceRanking()
        this.queryBlocQueryAlarmRanking()
        this.queryBlocQueryOrderByCount()
      }
      /* console.log(this.timer,new Date(),'测试'); */
      this.timer = setTimeout(() => {
        this.queryData()
      },1000*10)
    },
    /**
     * 综合态势（设备类型完好率 top 5）
     */
    queryDeviceTypeRanking() {
      this.$post("QueryBlocQueryDeviceTypeRanking", {
        Sort: this.sortType ? "asc" : "desc",
        FORGGroupGUID: this.currentBlock.FGUID||'',
        ...this.guid
      })
        .then(result => {
          this.intactRate = result.FObject || [];
        })
        .catch(err => {});
    },
    /**
     * 集团首页—综合态势（告警类型排名TOP5）
     */
    queryBlocAlarmRanking() {
      this.$post("/QueryBlocAlarmRanking", {
        Sort: this.sortType1 ? "asc" : "desc",
        FORGGroupGUID: this.currentBlock.FGUID||'',
        ...this.guid
      })
        .then(result => {
          this.alarmIntactRate = result.FObject || [];
        })
        .catch(err => {});
    },
    /**
     * 获取能耗态势
     */
    queryBlocEnergyByMonth() {
      this.$post("/QueryBlocEnergyByMonth", {
        FORGGroupGUID: this.currentBlock.FGUID||'',
        ...this.guid
      })
        .then(result => {
          this.energyCount = result.FObject || {};
            let columns = result.FObject.Data ? result.FObject.Data.map(item => item.DeviceItemName):[];
            let rows = [
              {
                name: "上月",
                type: "bar",
                barWidth: 10,
                data: result.FObject.Data ? result.FObject.Data.map(item => item.PriorEnergy):[]
              },
              {
                name: "本月",
                type: "bar",
                barWidth: 10,
                data: result.FObject.Data ? result.FObject.Data.map(item => item.CurEnergy):[]
              }
            ];
            this.energyChartData = {
              title: "分项能耗（kwh）",
              rows,
              columns,
              colorsArr: ["#2A91FC", "#18DE94"]
            }
        })
        .catch(err => {
          console.log(err)
        });
    },
    /**
     * 53.集团首页--综合态势柱形（工单类型完成率及时率)
     */
    queryBlocCompleteOrder() {
      this.$post("/QueryBlocCompleteOrder", {
        FORGGroupGUID: this.currentBlock.FGUID||'',
        ...this.guid
      })
        .then(result => {
          let data = result.FObject || [];
          let columns = data.map(item => item.OrderTypeName);
          let rows = [
            {
              name: "完成率",
              type: "bar",
              barWidth: 10,
              data: data.map(item => item.Complete)
            },
            {
              name: "及时率",
              type: "bar",
              barWidth: 10,
              data: data.map(item => item.Timely)
            }
          ];
          this.orderChartData = {
            title: "工单类型（%）",
            rows,
            columns,
            colorsArr: ["#2A91FC", "#18DE94"]
          };
        })
        .catch(err => {});
    },
    /**
     * 386.综合态势（设备统计  告警统计 工单统计）
     */
    queryUSituationStatistics() {
        this.$post('/QueryBlocUSituationStatistics',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
          ...this.guid
        })
        .then(result => {
          this.count = result.FObject[0] || {};
          this.deviceCount = {
            colums: ["运行", "停止", "告警", "维修", "保养"],
            rows: [
              {
                name: "运行",
                value: this.count.RunCount
              },
              {
                name: "停止",
                value: this.count.StopCount
              },
              {
                name: "告警",
                value: this.count.AlarmCount
              },
              {
                name: "维修",
                value: this.count.RepairCount
              },
              {
                name: "保养",
                value: this.count.MaintainCount
              }
            ]
          };
          this.alarmCount = [
            {
              type: "pie",
              radius: ["52", "60"],
              center: ["98", "50%"],
              label: {
                show: false
              },
              data: [
                {
                  name: "已恢复",
                  value: this.count.RecoveryCount
                },
                {
                  name: "未恢复",
                  value: this.count.NotRecoveryCount
                }
              ]
            },
            {
              type: "pie",
              radius: ["39", "44"],
              center: ["98", "50%"],
              label: {
                show: false
              },
              data: [
                {
                  name: "严重",
                  value: this.count.SeriousCount
                },
                {
                  name: "一般",
                  value: this.count.CommonlyCount
                }
              ]
            }
          ];
        })
        .catch(err => {});
    },
    /**
     * 系统态势
     */
    queryBlocSystemAlarmByCount(){
        this.$post('/QueryBlocSystemAlarmByCount',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid
        })
        .then((result) => {
          /* console.log(result); */
            this.systemList = []
            let data = result.FObject || []
            this.systemList.push(...[data.slice(0,4),data.slice(4)])
        }).catch((err) => {
            
        });
    },
    /**
     * 57.集团首页--查询集团实时未恢复告警
     */
    queryBlocAlarmRealData(){
        this.$post('/QueryBlocAlarmRealData',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid
        })
        .then((result) => {
            this.alarmData = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 56查询未恢复工单
     */
    queryBlocPageUOrdersByDate(){
        this.$post('/QueryBlocPageUOrdersByDate',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid,
            OrderState:-1,
            PageIndex:1,
            PageSize:1000
        })
        .then((result) => {
            this.orderData = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 查询左边树形数据(258.组织架构--查询树状集团项目)
     */
    queryProject(){
        this.$post('/QueryTORGGroupProjectTree',{
          FORGGroupGUID: '',
        })
        .then((result) => {
          this.treeData = result.FObject||[]
          if(this.userType == 1){
            this.treeData.unshift({
              FGUID: "",
              FGroupCode: "",
              FGroupName: "中物运营",
              FNodeType: 1,
              FSimpleName: "中物运营",
            })
          }
        }).catch((err) => {
            
        });
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.FORGName.indexOf(value) !== -1;
    },
    /**
     * 设备完好率
     */
    queryBlocQueryDeviceRanking(){
        this.$post('/QueryBlocQueryDeviceRanking',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
          ...this.guid,
          Sort: this.sortType2 ? "asc" : "desc",
        })
        .then((result) => {
            this.intactRateTop10 = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 恢复率排名
     */
    queryBlocQueryAlarmRanking(){
        this.$post('/QueryBlocQueryAlarmRanking',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid,
            Sort: this.sortType4 ? "asc" : "desc",
        })
        .then((result) => {
            this.recoverRate = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 60.集团首页--综合排名--本月能耗排名
     */
    queryBlocQueryEnergyByMonth(){
        this.$post('/QueryBlocQueryEnergyByMonth',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid,
            Sort: this.sortType3 ? "asc" : "desc",
        })
        .then((result) => {
            this.energyRate = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 集团首页—综合排名—查询工单排名
     */
    queryBlocQueryOrderByCount(){
        this.$post('/QueryBlocQueryOrderByCount',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid,
            Sort: this.sortType5 ? "asc" : "desc",
        })
        .then((result) => {
            this.orderRate = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 选择集团
     */
    slectBlock(node){
      if(node.FNodeType == 1){
        this.currentBlock = node
        this.queryData()
        this.$refs.map.queryMapData(node.FGUID)
        this.queryBlocEnergyByMonth();
        this.queryBlocQueryEnergyByMonth()
      }
    }
  }
};
</script>
<style lang="scss">
$url: "../../../assets/image/";
.home.qianren {
  padding: 2px;
  background: url("#{$url}qianren/index-bg.jpg");
  .header {
    position: relative;
    ul.menu {
      margin-top: -60px;
      .menu-item {
        width: 170px;
        height: 44px;
        line-height: 44px;
        position: relative;
        display: inline-block;
        background: url(#{$url}qianren/menu-bg.png);
        color: #84f2ff;
        font-size: 20px;
        cursor: pointer;
      }
      .menu-item.active {
        background: url(#{$url}qianren/menu-active.png);
        color: #F5DCAD
      }
      .menu-item:nth-of-type(3) {
        margin-left: 512px;
      }
      .menu-item:nth-of-type(4){
        .tree-project{
            position: absolute;
            width: 282px;
            height: 320px;
            top: 60px;
            z-index: 100;
            background: #0D2F60;
            .filter-box{
                padding: 10px;
            }
            .tree-content{
                height: 280px;
                .el-tree{
                    color:#F1F1F2;
                    font-size: 18px;
                    background: #0D2F60;
                    &-node__content{
                        height: 40px;
                        line-height: 40px;
                        span{
                            font-size: 16px;
                        }
                        a{
                          color:#F1F1F2;
                          font-size: 16px;
                        }
                    }
                    .el-tree-node:hover,.el-tree-node:focus {
                        >.el-tree-node__content {
                            background:#355B95;
                        }
                    }
                }
            }
        }
      }
      .menu-item:nth-of-type(4):hover {
        background: url(#{$url}qianren/menu-active.png);
        color: #F5DCAD;
      }
    }
  }
  .compre-hensive {
    .aside {
      width: 413px;
      .side-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .border{
            height: 1px;
            margin: 9px 25px 0 13px;
            background: #07A6FF;
        }
        .icon{
            width: 100px;
            height: 6px;
            margin-left:13px;
            position: relative;
            background: #07A6FF;
        }
        .icon:after{
            display: block;
            width: 0px;
            height: 0px;
            position: absolute;
            right: -6px;
            border: 3px solid transparent;
            border-top-color: #07A6FF;
            border-left-color: #07A6FF;
            content: ""
        }
        .card {
          width: 100%;
          height: 446px;
          background: url(#{$url}cloud/index/leftbar.png);
          background-size: 100% 100%;
          h4.title {
            /* line-height: 40px; */
            padding: 20px 37px 0 6px;
            text-align: left;
            font-size: 18px;
            font-weight: 400;
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
                top: -10px;
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
              li{
                line-height: 24px;
              }
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
                    margin-right: 0;
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
                    display: inline-block;
                    width: 40px;
                    margin-right: 10px;
                }
                .device-type {
                  width: 100px;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .bar-out {
                  width: 190px;
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
          .top5.energy-rate{
            ul{
              li{
                .bar-out{
                  width: 130px;
                  height: auto;
                }
                .value{
                  width: 130px;
                  text-align: center
                }
              }
            }
            ul.list-body{
              .bar-out,.value{
                font-size: 20px;
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
          .chart {
            width: 100%;
            height: 313px;
          }
        }
        .list{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >li{
                position: relative;
                height: 219px;
                a{
                  width: 100%;
                  height: 100%;
                  display: block;
                  color: #a5effc;
                  position: absolute;
                  z-index: 10;
                }
                h4{
                    padding-top: 10px;
                    .iconfont.icon-Up{
                        display: inline-block;
                        transform: rotate(90deg);
                        font-size: 24px;
                    }
                    p.r{
                        margin-right: 20px;
                        .iconfont{
                          font-size: 20px;
                        }
                    }
                }
                .list-content{
                    height: 170px;
                    display: flex;
                    align-items: center;
                    .statu1{
                        width:72px;
                        height:124px;
                        line-height: 124px;
                        border:1px solid rgba(1,150,7,1);
                        border-radius:9px;
                        box-shadow:  0 0 14px rgba(1,150,7,1);
                        position: relative;
                        left:14px;
                        font-size: 28px;
                        font-weight: 500;
                        color: #02CD35;
                    }
                    .statu1::after{
                        content: "";
                        display: block;
                        background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 42%, #00ff33 100%);
                        width: 36px;
                        height: 36px;
                        position: absolute;
                        top: 26px;
                        left: 0;
                        animation: radar-beam 3s infinite;
                        animation-timing-function: linear;
                        transform-origin: bottom right;
                        border-radius: 100% 0 0 0;
                    }
                    .statu1.alarm{
                        border:1px solid #fb0d0d;
                        box-shadow:  0 0 14px #fb0d0d;
                        color: #fb0d0d;
                    }
                    .statu1.alarm::after{
                        background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #fb0d0d,$alpha:1));
                    }
                    @keyframes radar-beam {
                        from{transform: rotate(0deg)}
                        to{transform: rotate(360deg)}
                    }
                    .param {
                        right: 38px;
                        li{
                            height: 30px;
                            display: flex;
                            justify-content: space-between;
                            p{
                                display: flex;
                                align-items: center;
                            }
                        }
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
