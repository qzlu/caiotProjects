<template>
  <div class="Ins_records">
    <!-- 人工巡更月报 -->
    <el-dialog :visible.sync="showReport" width="1350px">
      <!--html-->
      <section class="ppt_item month-report" id="date-report" v-if="dateReport.Table">
        <div class="htbn">
          <section>
            <div class="hdr">
              <p class="pn02">巡更日报</p>
              <p class="l pn">
                项目名称：{{projectNames}}
                <!--新都汇-->
              </p>
              <p class="r pn03">日期：
                <!--2018-09-20-->
                {{time.toLocaleDateString().replace(/\//ig,'-')}}
              </p>
            </div>
            <div class="ng_item">
              <img
                src="../../../static/image/task/bicon_1.png"
                class="pimg"
                :class="{nnor:dateReport.Table1.length>0}"
              >
              <img
                src="../../../static/image/task/bicon_2.png"
                class="pimg"
                :class="{nnor:dateReport.Table1.length==0}"
              >
              <div class="r list">
                <ul v-for="item in dateReport.Table">
                  <li class="l">计划次数　<span>{{item.PatrolPlanCount}}次</span></li>
                  <li class="l">实际次数　<span>{{item.ActualCount}}次</span></li>
                  <li class="l">及时次数　<span>{{item.TestingCount}}次</span></li>
                  <li class="l">超时次数　<span>{{item.TimeoutCount}}次</span></li>
                  <li class="l">正常点数　<span>{{item.NormalCount||0}}个</span></li>
                  <li class="l">异常点数　<span class="no">{{item.FaultCount||0}}个</span></li>
                </ul>
              </div>
            </div>
          </section>
          <p class="title"><span class="icon"></span>超时详情</p>
          <div class="table-c">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="">巡更名称</td>
                <td width="">计划时间</td>
                <td width="">巡更点数</td>
                <td width="">待巡更点数</td>
                <td>正常点数</td>
                <td>异常点数</td>
                <td>巡更人</td>
              </tr>
              <tr v-for="(item,key) in  dateReport.Table1" :key='key'> 
                <td>{{item.PatrolLineName}}</td>
                <td>{{item.RunningOrderDateTime}}</td>
                <td >{{item.PatrolPointCount}}</td>
                <td>{{item.WaitingCount}}</td>
                <td>{{item.NormalCount}}</td>
                <td :class="{'red':item.FaultCount>0}">{{item.FaultCount}}</td>
                <td>{{item.FContacts}}</td>
              </tr>
            </table>
          </div>
          <p class="title"><span class="icon"></span>异常详情</p>
          <div class="table-red">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="gg">
                  <td width="14.2%">巡更名称</td>
                  <td width="14.2%">计划时间</td>
                  <td width="14.2%">巡更点数</td>
                  <td width="14.2%">待巡更点数</td>
                  <td width="14.2%">正常点数</td>
                  <td width="14.2%">异常点数</td>
                  <td width="14.2%">巡更人</td>
                </tr>
              </thead>
            </table>
            <ul class="tbody">
              <li v-for="(item,key) in  dateReport.Table2" :key='key'>
                <div class='header'>
                  <span>{{item.PatrolLineName}}</span>
                  <span>{{item.RunningOrderDateTime}}</span>
                  <span>{{item.PatrolPointCount}}</span>
                  <span>{{item.WaitingCount}}</span>
                  <span>{{item.NormalCount}}</span>
                  <span :class="{'red':item.FaultCount>0}">{{item.FaultCount}}</span>
                  <span>{{item.FContacts}}</span>
                </div>
                <ul class="body">
                  <li v-for="(obj,i) in item.Data" :key="i">
                    <span>{{obj.PatrolObject}}</span>
                    <span>{{obj.PatrolTime}}</span>
                    <span>{{obj.PatrolNote}}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- <div class="person">备注：</div> -->
          <div class="person_pg">
            <span style="width: 180px; height: 30px; display: inline-block; text-align: left;">巡更人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">审核人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">管理员:</span>
          </div>
        </div>
      </section>
      <p v-else style="padding:50px">暂无数据</p>
      <!--html-->
    </el-dialog>
    <!--弹出框-->
    <!---巡更记录-->
    <div class="bg_are">
      <ul class="ich record-header">
        <li class="l">
          <span class="label">日期</span>
          <el-date-picker
            class=""
            v-model="time"
            type="date"
            @change="selectTime"
            placeholder="选择日期"
          ></el-date-picker>
        </li>
<!--         <li class="l">
          <span class="label">巡更路线名称</span>
          <el-input class="search-input" v-model="filterText" placeholder="搜索路线关键字">
              <i class="el-icon-search" slot="suffix"></i>
          </el-input>
          <button class="zw-btn zw-btn-primary">查询</button>
        </li> -->
        <li class="l">
            <button class="zw-btn zw-btn-export" @click="exportFile">导出</button>
            <button class="zw-btn ntb03" @click="queryDateReport">报告预览</button>
        </li>
      </ul>
      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Automaticinspection abc"></span>
          <span>巡更总况</span>
        </p>
      </div>
      <section class="btn_baritems">
        <div class="l showitem01">
          <section id="record-chart" style="height:183px; width: 90%;">
            <pie-chart :data='chartData' :color='["#00D294", "#89192E","#2A91FC"]' :setting="{legend:{x:'210px'}}"></pie-chart>
          </section>
          <div>
            <div class="atc_title">
              <p>巡更点数</p>
              <p>
                {{totalInfo.PatrolPointCount}}
                <!--100-->
              </p>
            </div>
            <div class="act_num">待巡更计划：
              <span>
                <!--6-->
                {{totalInfo.WaitingCount}}个
              </span>
            </div>
            <div class="act_num02">
              <p>
                <!--70-->
                {{totalInfo.NormalCount?totalInfo.NormalCount:0}}
              </p>
              <p>
                <!--50-->
                {{totalInfo.FaultCount?totalInfo.FaultCount:0}}
              </p>
              <p>
                <!--50-->
                {{totalInfo.WaitingCount?totalInfo.WaitingCount:0}}
              </p>
            </div>
          </div>
          <!--	<img src="/static/image/task/test.png">-->
        </div>
        <ul>
          <li
            v-for="(item,key) in plans"
            :key="key"
            :class="{currt_ing:active==key}"
            @click="active=key;queryPlan(item.ID)"
          >
            <section class="ui_box">
              <h5>{{item.PatrolPlanName}}</h5>
              <div class="l status">
                  {{inspectionStateArr[item.PatrolState]}}
              </div>
              <div class="r itext">
                <p>
                  <span class="colors" style="background:#2A91FC"></span>
                  <span class="igh">待巡更</span>
                  <span class="hgy">
                    <!--70-->
                    {{item.PatrolPointCount - item.NormalCount - item.FaultCount}}
                  </span>
                </p>
                <p>
                  <span class="colors"></span>
                  <span class="igh">正常</span>
                  <span class="hgy">
                    <!--70-->
                    {{item.NormalCount}}
                  </span>
                </p>
                <p>
                  <span class="colors colors_red"></span>
                  <span class="igh">异常</span>
                  <span class="hgy">
                    <!--30-->
                    {{item.FaultCount}}
                  </span>
                </p>
              </div>
            </section>
            <p class="ghj_time">
              <span>
                <!--00:00-->
                {{item.PatrolStartDateTime?item.PatrolStartDateTime.split(' ')[1]:"--"}}
              </span>
              <span>
                {{item.FUserNickname}}
                <!--自动巡更-->
              </span>
            </p>
          </li>
        </ul>
      </section>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Inspectionreport abc"></span>
          <span>巡更记录</span>
        </p>
      </div>
      <div class="show_exl">
        <!--table-->
        <div id="is_table_spid">
            <el-table
               :data="records"
               max-height="360"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column type="index" label="序号" width="90"></el-table-column>
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                 show-overflow-tooltip
                >
               </el-table-column>
            </el-table>
        </div>

        <!--end of table-->
        <!--<iframe :src="exl_url"    frameborder="0" scrolling="yes"  class="iframe_tiem"></iframe>-->
      </div>
    </div>
  </div>
</template>
<script>
import html2Canvas from "html2canvas";
var echarts = require("echarts");
import * as comm from "@/caiot/assets/js/pro_common";
import {Inspection,FileUpLoad,project,Patrol} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {pieChart} from '@/caiot/zw-components/index'
import '../InspectionRecords.scss';
export default {
  mixins:[table],
  data() {
    return {
      //人工巡更
      projectNames: localStorage.getItem("projectname"),
      time:new Date(),
      filterText:'',
      totalInfo:0,//巡更总况统计信息
      waitingPlan:0,
      pointsInfo:{},
      plans:[],
      active:0,//默认选中第一个计划
      planID:'',
      records:[],
      showReport:false,
      dateReport:{},
      chartData:{},
      tableLabel:[
          {
            prop: 'PatrolItem',
            label: '巡更项'
          },
          {
              prop: 'PatrolObject',
              label: '巡更点'
          },
          {
              prop: 'PatrolTime',
              label: '巡更时间',
              width:160
          },
          {
              prop: 'PatrolResult',
              label: '巡更结果'
          },
          {
              prop: 'PatrolNote',
              label: '异常描述'
          }
      ],
      inspectionStateArr:['待巡更','巡更中','已完成','逾期'],
    };
  },
  components:{
    pieChart
  },
  methods: {
    /**
     * 人工巡更选择时间
     */
    selectTime(val){
      this.queryPlanRecord()
    },
    /**
     * 164.查询人工巡更计划信息
     */
    queryPlanRecord(){
        Patrol({
          FAction:'QueryUPatrolPlanByCount',
          StartDateTime:this.time.toLocaleDateString().replace(/\//g,'-'),
          EndDateTime:this.time.toLocaleDateString().replace(/\//g,'-')
        })
        .then(data => {
          this.totalInfo = data.FObject.Table?data.FObject.Table[0]:{}
          this.plans = data.FObject.Table1?data.FObject.Table1.filter(item => item.PatrolState>0):[]
          let datas = [{value:this.totalInfo.NormalCount,name:"正常"},{value:this.totalInfo.FaultCount,name:"异常"},{value:this.totalInfo.WaitingCount,name:"待巡更"}]
          this.chartData = {
            columns:['正常','异常','待巡更'],
            rows:datas
          }
          if(this.plans[0]){
            this.queryPlan(this.plans[0].ID)
          }else{
            this.records = []
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    /**
     * 根据计划ID查询巡更记录(168.查询人工巡更记录)
     * id 计划ID
     */
    queryPlan(id){
        this.planID = id
        Patrol({
          FAction:'QueryUPatrolPlanRecord',
          ID:id
        })
        .then(data => {
          this.records = data.FObject
        })
        .catch(error => {
          console.log(error);
        })
    },
    /**
     * 查询人工巡更日报
     */
    async queryDateReport(){
      await new Promise((resolve,reject) => {
        Patrol({
          FAction:'QueryUPatrolReportErrByDay',
          FDateTime:this.time.toLocaleDateString().replace(/\//ig,'-')
        })
        .then(data => {
          console.log(data)
          this.dateReport = data.FObject
          this.showReport = true
        })
        .catch(error => {
          reject()
        })
      })
      if(this.dateReport.Table2.length ===0){
        return
      }
      let fileName = localStorage.getItem("projectname") + '人工巡更' +  this.time.getFullYear() + comm.formatNumber(this.time.getMonth()+1)+comm.formatNumber((this.time.getDate()))
      await new Promise(resolve => {
        this.$nextTick(() => {
          resolve()
        })
      })
      this.getPdf('#date-report', fileName);
      this.fileUpload('#date-report',fileName)
    },
    /**
     * exportFile 导出
     */
    exportFile(){
        Patrol({
            FAction:'QueryExportUPatrolPlanRecord',
            ID:this.planID,
            FDateTime:this.time.toLocaleDateString(),
        })
        .then(data => {
            window.location = "http://www.szqianren.com/" + data.FObject;
        })
        .catch(error => {
            this.$message({
              type: 'error',
              message: '导出失败!请重试'
            });
        })
    },
    
  },
  watch:{

  },
  created() {
    this.queryPlanRecord()
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' >
$img-url:'../../../static/image/';
.Ins_records  {
  .ppt_item.month-report{
    .ng_item{
      height: 150px;
      padding-bottom: 10px;
      overflow: hidden;
      .pimg{
        top: 0;
      }
    }
    .title{
      margin-left: -14px;
      line-height: 40px;
      text-align: left;
      font-size: 20px;
      .icon{
        display: inline-block;
        width: 4px;
        height: 18px;
        background: #1d7bce;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
    .tbody{
      >li{
        .header{
          display: flex;
          line-height: 34px;
          background: rgba($color: #f3afaf, $alpha: 0.4);
          span{
            flex: 1;
          }
        }
        .body{
          li{
            line-height: 34px;
            display: flex;
            justify-content: flex-start;
            border: 1px solid rgba($color: #f3afaf, $alpha: 0.4);
            span{
              text-align: left;
            }
            span:first-of-type{
              width: 100px;
              margin-left: 168px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            span:nth-of-type(2){
              width: 200px;
            }
            span:last-of-type{
              white-space: nowrap;
            }
          }
        }
      }
    }
    .red{
      color:#ef0f24
    }
  }

  .bg_are{
    .ich{
      .ntb02{
        background-size: 100% 100%;
        padding-left: 14px;
      }
      .ntb02:hover,.ntb02:active{
        background-size: 100% 100%;
      }
    }
  }
}
</style>
