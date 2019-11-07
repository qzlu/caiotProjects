<template>
  <div>
    <div>
      <div class="compre-hensive">
        <div class="left-side aside l">
          <div class="side-header clearfix">
            <number class="l" :data="count.RealAlarmCount"></number>
            <span>实时告警</span>
          </div>
          <ul class="side-content">
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
            <span>实时任务</span>
          </div>
          <ul class="side-content">
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
                  任务数量排名
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
                            <span class="value">任务数量</span>
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
                <p>今日任务</p>
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
            <div style="height:288px">
                <monitorData :alarmData='alarmData' :orderData='orderData'></monitorData>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { number} from "@/components/index.js";
import echartsMap from "../component/map.vue";
import monitorData from "./monitorData.vue"
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      guid:{IDStr:0}, //查询的IDStr
      activeLevel: {}, //当前选中的架构等级
      count: {}, //设备统计  告警统计 任务统计
      intactRateTop10:[], //综合排名设备完好率排名
      recoverRate:[], //恢复率
      energyRate:[], //本月能耗排名
      orderRate:[], //任务数量排名
      sortType2:0, //完好率排序方式
      sortType3:0, //能耗排名排序方式
      sortType4:0, //告警恢复率排序方式
      sortType5:0, //任务数量排名排序方式
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
    echartsMap,
    monitorData
  },
  watch: {
    currentBlock(val){
        this.queryData()
        this.queryBlocQueryEnergyByMonth()
        this.$refs.map.queryMapData(val.FGUID)
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
      this.queryData()
      this.queryBlocQueryEnergyByMonth()
    },
    /**
     * 点击地图上的区域时
     * @param {String} FAreaCode 区域，城市，编码
     */
    areaClick(FAreaCode){
        this.guid.IDStr = FAreaCode
        this.queryData()
        this.queryBlocQueryEnergyByMonth()
    },
    queryData(){
      clearTimeout(this.timer)
      this.timer = null
      this.queryUSituationStatistics()
      this.queryBlocQueryDeviceRanking()
      this.queryBlocQueryAlarmRanking()
      this.queryBlocQueryOrderByCount()
      this.timer = setTimeout(() => {
        this.queryData()
      },1000*10)
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
        })
        .catch(err => {});
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
     * 集团首页—综合排名—查询任务排名
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
    }
  }
};
</script>
<style lang="scss">
</style>
