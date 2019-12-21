<template>
  <div>
    <div>
      <div class="compre-hensive">
        <div class="left-side aside l">
          <ul class="side-content">
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
        </div>
        <div class="left-side aside r">
          <ul class="side-content">
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
                任务态势
                <i class="iconfont icon-Up"></i>
              </h4>
              <div class="border">
              </div>
              <div class="icon">
              </div>
              <ul class="item-list">
                <li>
                  <p class="label">今日任务</p>
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
        </div>
        <div class="main">
          <div id="map" style="100%;height:600px">
            <echarts-map ref="map"></echarts-map>
            <div style="height:288px">
                <!-- <monitorData :alarmData='alarmData' :orderData='orderData'></monitorData> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { number, pieChart, barChart } from "@/components/index.js";
import echartsMap from "@/component/map.vue";
import monitorData from "./monitorData.vue"
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      guid:{IDStr:0}, //查询的IDStr
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
      count: {}, //设备统计  告警统计 任务统计
      sortType: 0, //设备完好率排序方式
      intactRate: [], //完好率排名
      sortType1: 0, //告警排名排序方式 0 为降序
      alarmIntactRate: [], //告警排名
      energyCount: {}, //能耗统计
      energyChartData: {}, //分项能耗
      orderChartData: {}, //任务类型柱形图数据
      timer:null,
    };
  },
  props:{
    alarmData:{
        type:Array
    },
    orderData:{
        type:Array
    },
    currentBlock:{
        type:Object
    }
  },
  components: {
    number,
    pieChart,
    barChart,
    echartsMap,
    monitorData
  },
  watch: {
    currentBlock(val){
        this.queryData()
        this.$refs.map.queryMapData(val.FGUID)
        this.queryBlocEnergyByMonth();
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    ready1(level) {
      /* this.queryData()
      this.queryBlocEnergyByMonth(); */
    },
    loadMapData(){
        this.$refs.map.queryMapData(this.currentBlock.FGUID)
    },
    /**
     * 点击地图上的区域时
     * @param {String} FAreaCode 区域，城市，编码
     */
    areaClick(FAreaCode){
        this.guid.IDStr = FAreaCode
        this.queryData()
        this.queryBlocEnergyByMonth();
    },
    queryData(){
      clearTimeout(this.timer)
      this.timer = null
      this.queryDeviceTypeRanking();
      this.queryBlocAlarmRanking();
      this.queryBlocCompleteOrder();
      this.queryUSituationStatistics()
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
     * 53.集团首页--综合态势柱形（任务类型完成率及时率)
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
            title: "任务类型（%）",
            rows,
            columns,
            colorsArr: ["#2A91FC", "#18DE94"]
          };
        })
        .catch(err => {});
    },
    /**
     * 386.综合态势（设备统计  告警统计 任务统计）
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
  }
};
</script>
<style lang="scss">

</style>
