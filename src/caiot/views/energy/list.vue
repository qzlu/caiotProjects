

<template>
  <section class="en_container">
    <section class="e_header">
      <div class="en_left">
        <p class="titles">总能耗</p>
        <section class="ech_time">
          <div class="e_tg">
            <ul style="width: 102px;">
              <li :class="{en_active:active==i}" v-for="(item,i) in dateTypeList" :key="i" @click="selectDateType(i)">
                {{item.label}}
              </li>
            </ul>
            <div class="e_set_time">
              <p class="l">
                <i class="iconfont icon-Leftparentheses pointer" @click="pre()"></i>
              </p>
              <div class="en_tpn">
                <el-date-picker
                  v-model="value1"
                  :type="dateTypeList[active].type"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
              <p class="l">
                <i class="iconfont icon-Rightparentheses pointer" @click="next()"></i>
              </p>
            </div>
            <button class="zw-btn zw-btn-export" @click="exportEnergyReportData">导出</button>
          </div>
        </section>

        <section class="e_bigdate">
          <div class="it01" style="width: 205px;">
            <p class="t">
              <!--当日-->
              {{dateTypeList[active].current}}
            </p>
            <p class="nt" style="font-size: 20px;">
              {{energyCount.CurEnergy}}
              <!--20357-->
            </p>
            <p
              class="gc"
              :class="energyCount.PriorPercent>0 ? '' : 'gy'"
            >
              {{Math.abs(energyCount.PriorPercent)}}%
              <!--15%-->
            </p>
          </div>
          <div class="it01 nobg" style="width: 205px;">
            <p class="t">
              <!--昨日-->
              {{dateTypeList[active].pre}}
            </p>
            <p class="np">{{energyCount.PriorEnergy}}</p>
          </div>
          <div class="it01 nobg" style="display: none;">
            <p class="t">历史平均</p>
            <p class="np">{{energyCount.HisAvgEnergy}}</p>
            <p class="gc" :class="energyCount.PriorPercent>0 ? '' : 'gy'">
              {{energyCount.PriorPercent}}
              <!--15-->
              %
            </p>
          </div>
        </section>
      </div>
      <div class="en_right">
        <div class="itext" style="float: left; width: 150px; padding: 30px 15px;">
          <p style="font-size: 18px; ">总能耗</p>
          <p style="font-size: 18px; line-height: 35px;">（kwh）</p>
        </div>
        <div id="en_line" class="en_line" @click="getDatas()">
          <line-chart :data='totalEnergy' :color="['#18d094','#1385f7']">
          </line-chart>
        </div>
      </div>
    </section>

    <section class="big_Are">
      <div class="en_bigitem01" style="height: 347px; overflow: hidden;">
        <div>
          <bar-chart :data="itemEnergy" @chartClick="chartClick">
          </bar-chart>
        </div>
        <div>
          <bar-chart :data="areaEnergy" @chartClick="chartClick1">
          </bar-chart>
        </div>
      </div>
      <div class="en_bigitem02" style="height: 306px; overflow: hidden;padding: 0px 20px 20px 20px;">
        <bar-chart :data="keyEnergy">
        </bar-chart>
      </div>
    </section>
  </section>
</template>
 <style>
.en_container .el-input__suffix {
  right: -25px;
  display: none;
}
.en_container .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  font-size: 12px;
}
.en_container .el-input--suffix .el-input__inner {
  padding-right: 0;
}
.en_container .el-input__inner {
  height: 20px;
  text-align: center;
  background: none;
  border: none;
  color: #fff;
}
.en_container .el-input__icon {
  line-height: 20px;
}
</style>
<script>
var week_start = 0;

import * as comm from "../../assets/js/pro_common";
import {lineChart,barChart} from '@/caiot/zw-components/index.js'
import {project,Energy} from '@/caiot/request/api.js'
import formatDate from '@/utils/formatDate.js'
export default {
  data() {
    return {
      dateTypeList:[
        { 
          label:'日',
          type:'date',
          FType:'Day',
          pre:'昨日',
          current:'当日',
          preFun:() => {
            return new Date(this.value1).setDate(this.value1.getDate()-1)
          },
          nextFun:() => {
            return new Date(this.value1).setDate(this.value1.getDate()+1)
          }
        },
        {
          label:'月',
          type:'month',
          FType:'Month',
          pre:'上月',
          current:'本月',
          preFun:() => {
            return new Date(this.value1).setMonth(this.value1.getMonth()-1)
          },
          nextFun:() => {
            return new Date(this.value1).setMonth(this.value1.getMonth()+1)
          }
        },
        {
          label:'年',
          type:'year',
          FType:'Year',
          pre:'上年',
          current:'今年',
          preFun:() => {
            return new Date(this.value1).setFullYear(this.value1.getFullYear()-1)
          },
          nextFun:() => {
            return new Date(this.value1).setFullYear(this.value1.getFullYear()+1)
          }
        },
      ],
      value1: new Date(), //下拉初始化时间
      active: 0,
      energyCount:{}, //能耗统计数据
      totalEnergy:{}, //总能耗曲线图
      itemEnergy:{}, //分项能耗
      areaEnergy:{}, //分区能耗
      keyEnergy:{}, //重点设备能耗
      table2:[], // 分项能耗原始数据
      table4:[], //分区能耗原始数据
      disabled:false
    };
  },
  components: {
    lineChart,
    barChart,
  },
  watch:{
    value1(){
      this.getDatas()
    }
  },
  methods: {
    selectDateType(index){
      if(this.disabled){
        this.$message({
          type:'warning',
          message:'操作太频繁！'
        })
        return
      }
      this.value1 = new Date()
      this.active = index
      this.getDatas()
    },
    pre(){
      let date = this.dateTypeList[this.active].preFun()
      this.value1 = new Date(date)
    },
    next(){
      let date = this.dateTypeList[this.active].nextFun()
      this.value1 = new Date(date)
    },
    /**
     * 格式化总能耗数据
     */
    formatterLineData(arr){
      let columns = []
      let rows = arr.map((item,i) => {
        let data = []
        for(let key in item){
          if(key !== 'Cycle'){
            data.push(item[key])
            if(i === 0){
              columns.push(key)
            }
          }
        }
        return {
          name:item.Cycle,
          type:'line',
          data:data
        }
      })
      return {
        name:arr.map(item => item.Cycle),
        columns:columns,
        rows:rows,
      }
    },
    /**
     * 格式化柱形图数据
     */
    formatBarData(arr){
        let columns = arr.map(item => item.DeviceItemName)
        let rows = []
        return {
          colorsArr:["#18d094", "#1385f7"],
          name:this.totalEnergy.name,
          columns:columns,
          rows:this.totalEnergy.name.map((item,i) => {
            let data = arr.map(obj => {
              if(i === 0){
                return obj.CurEnergy
              }else{
                return obj.PriorEnergy
              }
            })
            return {
              name:item,
              type:"bar",
              barWidth:20,
              data:data
            }
          })
        }
    },
    getDatas() {
      this.disabled = true
      project({
        FAction: "GetPrjEnergy",
        FType: this.dateTypeList[this.active].FType,
        FDateTime: formatDate(this.value1,'YYYY-MM-DD')
      })
      .then((result) => {
        let {Table,Table1,Table2,Table3,Table4} = result.FObject
        this.table2 = Table2
        this.table4 = Table4
        this.energyCount = Table&&Table[0]||{}
        this.totalEnergy = this.formatterLineData(Table1 || [])
        this.itemEnergy = this.formatBarData(Table2 || [])
        this.itemEnergy.title = '分项能耗（kwh）'
        this.keyEnergy = this.formatBarData(Table3 || [])
        this.keyEnergy.title = '重点设备能耗（kwh）'
        this.areaEnergy = this.formatBarData(Table4||[])
        this.areaEnergy.title = '分区能耗（kwh）'
      }).catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.disabled = false
      })
    },
    exportEnergyReportData(){
      Energy({
        FAction:'ExportEnergyReportData',
        FType: this.dateTypeList[this.active].FType,
        FDateTime: formatDate(this.value1,'YYYY-MM-DD')
      })
      .then((result) => {
        window.location = "http://www.szqianren.com/" + result.FObject;
      }).catch((err) => {
        this.$message({
          type:'error',
          message:'导出失败'
        })
      });
    },
    /**
     * 409.查询能源配置设备能耗
     */
    queryDeviceEnergy(device){
      project({
        FAction:'QueryDeviceEnergy',
        ID:device.EnergyConfigID,
        FType:this.dateTypeList[this.active].FType,
        FDateTime:formatDate(this.value1,'YYYY-MM-DD')
      })
      .then((result) => {
        this.keyEnergy = this.formatBarData(result.FObject||[])
        this.keyEnergy.title = device.DeviceItemName+'(kwh)'
      }).catch((err) => {
        console.log(err);
      });
    },
    chartClick(param){
      let device = this.table2[param.dataIndex]
      device&&this.queryDeviceEnergy(device)
    },
    chartClick1(param){
      let device = this.table4[param.dataIndex]
      device&&this.queryDeviceEnergy(device)
    }
  },
  mounted: function() {
    this.getDatas();
  },
  computed: {}
};
</script>
 
<style type="text/css" scoped>
.en_container .big_Are {
  width: 1557px;
  height: 690px;
  background: url(../../static/image/indexdetail/content_fg_1.png);
}

.en_container .e_header {
  height: 227px;
  position: relative;
}
.en_container .e_header .en_left {
  position: relative;
  width: 459px;
  height: 224px;
  margin-top: -7px;
  background: url(../../static/image/energy/un_ger.png);
  float: left;
}
.en_container .e_header .en_left .en_refre {
  cursor: pointer;
  width: 20px;
  position: absolute;
  top: 36px;
  right: 11px;
}
.en_container .e_header .en_left .titles {
  width: 126px;
  height: 25px;
  position: absolute;
  top: 0;
  left: 0;
  color: #607ab3;
  font-size: 18px;
}
.en_container .e_header .en_left .ech_time {
  height: 35px;
  padding: 30px 0 0 0;
}
.en_container .e_header .en_left .ech_time .e_tg {
  width: 430px;
  height: 28px;
  float: right;
}
.en_container .e_header .en_left .ech_time .e_tg ul {
  width: 136px;
  height: 25px;
  float: left;
  border: 1px solid rgba(143, 156, 191, 1);
  border-radius: 5px;
}
.en_container .e_header .en_left .ech_time .e_tg ul li {
  cursor: pointer;
  float: left;
  width: 34px;
  height: 25px;
  line-height: 25px;
  border-right: 1px solid rgba(143, 156, 191, 1);
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}
.en_container .e_header .en_left .ech_time .e_tg ul li:nth-child(4) {
  border: none;
}
.en_container .e_header .en_left .ech_time .e_tg ul li.en_active {
  background: #0f7ae2;
}
.en_container .e_header .en_left .ech_time .e_tg .e_set_time {
  margin: 6px 0 0 20px;
  width: 150px;
  height: 20px;
  float: left;
  display: flex;
}
.en_container .e_header .en_left .ech_time .e_tg .en_tpn {
  cursor: pointer;
  width: 128px;
  height: 20px;
  float: left;
  font-size: 14px;
  color: #f1f1f2;
  margin: -2px 5px 0 0;
}

.en_container .e_header .e_bigdate {
  height: 125px;
  padding: 16px 15px;
}
.en_container .e_header .e_bigdate .it01 {
  width: 142px;
  height: 120px;
  float: left;
  background: #092962;
}
.en_container .e_header .e_bigdate .nobg {
  background: none;
}
.en_container .e_header .e_bigdate .it01 .t {
  color: #607ab3;
  font-size: 16px;
  padding: 25px 0 0 0;
  color: #dfeafc;
}
.en_container .e_header .e_bigdate .it01 .nt {
  font-size: 32px;
  padding-top: 12px;
}
.en_container .e_header .e_bigdate .it01 .np {
  font-size: 24px;
  color: #607ab3;
  padding-top: 10px;
}
.en_container .e_header .e_bigdate .it01 .gc {
  background: url(../../static/image/energy/ing_up.png) 3px 5px no-repeat #a21d32; /*background: #A21D32;*/
  margin: 10px 0 0 50px;
  width: 58px;
  height: 20px;
	margin-left:70px;
  line-height: 20px;
  border-radius: 5px;
	padding-left: 12px;
}
.en_container .e_header .e_bigdate .it01 .gy {
  background: url(../../static/image/energy/ing_down.png) 3px 5px no-repeat #06a167;
}
.en_container .e_header .en_right {
  width: 1086px;
  height: 227px;
  margin-top: -7px;
  margin-left: 18px;
  background: url(../../static/image/indexdetail/bg_blue_2.png) no-repeat;
  float: left;
}
.en_container .e_header .en_right .en_line {
  height: 200px;
  width: 845px;
  float: left;
  margin-top: 10px;
}
.en_bigitem01{
  display: flex
}
.en_bigitem01>div{
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 14px 0px 20px;
}
</style>
