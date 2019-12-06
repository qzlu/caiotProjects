<template>
  <div>
    <div>
      <div class="compre-hensive">
        <div class="left-side aside l">
          <div class="side-content">   
            <ul class="list" >
                <li :class="{alarm:item.FState>0}" v-for="(item,i) in systemList[0]||[]" :key="i">
                    <a v-if="item.FUrl" :href="item.FUrl" target="_blank">
                    </a>
                    <router-link v-if="routerList[item.ParamID].length>0" :to="routerList[item.ParamID]"></router-link>
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
        </div>
        <div class="left-side aside r">
          <div class="side-content">   
            <ul class="list" >
                <li :class="{alarm:item.FState>1}" v-for="(item,i) in systemList[1]||[]" :key="i">
                    <a v-if="item.FUrl" :href="item.FUrl" target="_blank">
                    </a>
                    <router-link v-if="routerList[item.ParamID].length>0" :to="routerList[item.ParamID]"></router-link>
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
        </div>
        <div class="main">
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
import { number } from "@/components/index.js";
import echartsMap from "../component/map.vue";
import monitorData from "./monitorData.vue"
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      guid:{IDStr:0}, //查询的IDStr
      count: {}, //设备统计  告警统计 任务统计
      systemList:[], //系统态势列表
      timer:null,
      routerList:['','/powerSystem','/waterSystem','','','','/smartParking','/smartDoor','/smartVideo'], //路由信息
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
    },
    /**
     * 点击地图上的区域时
     * @param {String} FAreaCode 区域，城市，编码
     */
    areaClick(FAreaCode){
        this.guid.IDStr = FAreaCode
        this.queryData()
    },
    queryData(){
      clearTimeout(this.timer)
      this.timer = null
      this.queryUSituationStatistics()
      this.queryBlocSystemAlarmByCount()
      this.timer = setTimeout(() => {
        this.queryData()
      },1000*10)
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
  }
};
</script>
<style lang="scss">
</style>
