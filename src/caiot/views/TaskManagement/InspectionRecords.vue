<template>
  <div class="Ins_records">
    <!--弹出框(物联巡检)-->
    <!-- <el-button type="text" @click="make_paf">点击打开 Dialog</el-button>append-to-body-->
    <el-dialog :visible.sync="centerDialogVisible" append-to-body class="Ins_records" width="1350px">
      <!--html-->
      <section class="ppt_item" id="pdf_htmls">
        <div class="htbn">
          <section v-for="(item,key) in Dialog_table0">
            <div class="hdr">
              <p class="pn02">物联巡检日报</p>
              <p class="l pn">
                项目名称：{{projectNames}}
                <!--新都汇-->
              </p>
              <p class="r pn03">日期：
                <!--2018-09-20-->
                {{item.InspectionDate.split(" ")[0]}}
              </p>
            </div>
            <div class="ng_item">
              <img
                src="/static/image/task/bicon_1.png"
                class="pimg"
                :class="{nnor:Dialog_table2.length>0}"
              >
              <img
                src="/static/image/task/bicon_2.png"
                class="pimg"
                :class="{nnor:Dialog_table2.length==0}"
              >
              <div class="r list">
                <ul>
                  <li>巡检次数:
                    <span>
                      {{item.InspectionCount}}
                      <!--4-->
                      次
                    </span>
                  </li>
                  <li>巡检点数:
                    <span>
                      {{item.InspectionDeviceCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                  <li>正常点数:
                    <span>
                      {{item.NormalCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                  <li>异常点数:
                    <span class="no">
                      {{item.FaultCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div class="table-c">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="28%">巡检区域</td>
                <td width="18%">巡检情况</td>
                <td width="18%">巡检点数</td>
                <td width="18%">正常点数</td>
                <td width="18%">异常点数</td>
              </tr>
              <tr v-for="(item,key) in Dialog_table1" :key="key">
                <td>{{item.AreaName}}</td>
                <td :class="{reding:item.InspectionState=='异常'}">{{item.InspectionState}}</td>
                <td>{{item.InspectionDeviceCount}}</td>
                <td>{{item.NormalCount}}</td>
                <td :class="{reding:item.FaultCount>0}">{{item.FaultCount}}</td>
              </tr>
            </table>
          </div>

          <div class="table-red">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="25%">异常巡检点名称</td>
                 <td width="25%">时间</td>
                <td width="25%">异常描述</td>
                <td width="25%">处理情况</td>
              </tr>
              <tr v-for="(item,key) in  Dialog_table2">
                <td>{{item.InspectionObject}}</td>
                <td>{{item.InspectionTime}}</td>
                <td style="color: red;">{{item.InspectionResult}}</td>
                <td></td>
              </tr>
            </table>
          </div>

          <div class="person">备注：</div>
          <div class="person_pg">
            <span style="width: 180px; height: 30px; display: inline-block; text-align: left;">巡检人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">审核人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">管理员:</span>
          </div>
        </div>
      </section>
      <!--html-->
    </el-dialog>
    <!-- 人工巡检日报 -->
    <el-dialog :visible.sync="showReport" class="Ins_records" append-to-body width="1350px">
      <!--html-->
      <section class="ppt_item" id="date-report" v-if="dateReport">
        <div class="htbn">
          <section>
            <div class="hdr">
              <p class="pn02">人工巡检日报</p>
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
                src="/static/image/task/bicon_1.png"
                class="pimg"
                :class="{nnor:dateReport.Table[0].FaultCount>0}"
              >
              <img
                src="/static/image/task/bicon_2.png"
                class="pimg"
                :class="{nnor:dateReport.Table[0].FaultCount==0}"
              >
              <div class="r list">
                <ul>
                  <li>巡检次数:
                    <span>
                      {{dateReport.Table[0].InspectionCount}}
                      <!--4-->
                      次
                    </span>
                  </li>
                  <li>待巡检:
                    <span>
                      {{dateReport.Table[0].WaitingCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                  <li>正常点数:
                    <span>
                      {{dateReport.Table[0].NormalCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                  <li>异常点数:
                    <span class="no">
                      {{dateReport.Table[0].FaultCount}}
                      <!--4-->
                      个
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div class="table-c">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="28%">巡检区域</td>
                <td width="14%">巡检情况</td>
                <td width="14%">巡检点数</td>
                <td width="14%">待巡检</td>
                <td width="14%">正常点数</td>
                <td width="14%">异常点数</td>
              </tr>
              <tr v-for="(item,key) in dateReport.Table1">
                <td>{{item.AreaName}}</td>
                <td :class="{reding:item.InspectionResult=='异常'}">{{item.InspectionResult}}</td>
                <td>{{item.ALLPointCount}}</td>
                <td>{{item.waitingCount}}</td>
                <td>{{item.NormalCount?item.NormalCount:0}}</td>
                <td :class="{reding:item.FaultCount>0}">{{item.FaultCount?item.FaultCount:0}}</td>
              </tr>
            </table>
          </div>

          <div class="table-red">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="25%">异常巡检点名称</td>
                 <td width="25%">时间</td>
                <td width="25%">异常描述</td>
                <td width="25%">处理情况</td>
              </tr>
              <tr v-for="(item,key) in  dateReport.Table2">
                <td>{{item.InspectionObject}}</td>
                <td>{{item.InspectionTime}}</td>
                <td style="color: red;">{{item.InspectionNote}}</td>
                <td></td>
              </tr>
            </table>
          </div>

          <div class="person">备注：</div>
          <div class="person_pg">
            <span style="width: 180px; height: 30px; display: inline-block; text-align: left;">巡检人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">审核人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">管理员:</span>
          </div>
        </div>
      </section>
      <!--html-->
    </el-dialog>
    <!--弹出框-->
    <!---巡检记录-->
    <div class="top">
      <ul>
        <li :class="{active:activeIndex === 0}" @click="activeIndex = 0">物联巡检</li>
        <li :class="{active:activeIndex === 1}" @click="activeIndex = 1">人工巡检</li>
        <!-- <li>综合巡检</li> -->
      </ul>
    </div>
    <div class="bg_are" v-if="activeIndex === 0">
      <div class="ich">
        <div
          class="gre_btns02"
          style="position: absolute; top: 57px; left: 839px; height: 46px; width: 84px; background: #093b7c; opacity: 0.8;"
        ></div>

        <div class="time">
          <p class="l name">日期</p>
          <div class="date_chs">
            <div class="block" style="margin-top: 5px; height: 20px;">
              <el-date-picker
                v-model="value1"
                value-format="yyyy-MM-dd"
                type="date"
                @change="start_barData"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
<!--         <div
          class="ntb01_pp"
          :class="{divsh:currt==0}"
          style="position: absolute; top: 57px; left: 358px; height: 46px; width: 119px; background: #093b7c; opacity: 0.8;"
        ></div>
        <div
          class="ntb01_pp yuh"
          :class="{isod:exl_hef!=''}"
          style="position: absolute; top: 57px; left: 741px; height: 46px; width: 86px; background: #093b7c; opacity: 0.8;"
        ></div> -->
        <button class="zw-btn ntb01"  @click="one_change">一键巡检</button>
        <div class="ntb02" @click="showSetTime = true">设置自动巡检</div>
        <div class="ntb03" @click="make_paf">报告预览</div>
        <a :href="exl_hef">
          <div class="ntb04">导出</div>
        </a>
        <div class="ntb05">审核</div>
        <el-dialog title='设置一键巡检' :visible.sync="showSetTime" class="set-inspection-time zw-dialog" width="450px">
          <div style="margin:30px 0">
           <span style="font-size:14px">设置时间</span>
           <el-select
             v-model="timesArr"
             multiple
             collapse-tags
             style="margin-left: 10px;"
             placeholder="请选择">
             <el-option
               v-for="(item,i) in 24"
               :key="i"
               :label="i<10?'0'+ i +':00':i+':00'"
               :value="i">
             </el-option>
           </el-select>
          </div>
          <div style="text-align:center;margin-bottom:30px">
            <button class="zw-btn zw-btn-primary" @click="setInspectionTime()">确定</button>
          </div>
        </el-dialog>
      </div>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Automaticinspection abc"></span>
          <span>巡检总况</span>
        </p>
      </div>
      <section class="btn_baritems">
        <div class="l showitem01" v-if="bar_value">
          <section id="show_bar" style="height:183px; width: 90%;">
            <pie-chart :data="chartData" :color='["#00D294", "#89192E"]' :setting="{legend:{x:'220px'}}"></pie-chart>
          </section>
          <div>
            <div class="atc_title">
              <p>巡检点数</p>
              <p>
                {{bar_value.InspectionDeviceCount}}
                <!--100-->
              </p>
            </div>
            <div class="act_num">巡检次数：
              <span>
                <!--6-->
                {{bar_value.InspectionCount}}次
              </span>
            </div>
            <div class="act_num02">
              <p>
                <!--70-->
                {{bar_value.NormalCount}}
              </p>
              <p>
                <!--50-->
                {{bar_value.FaultCount}}
              </p>
            </div>
          </div>
          <!--	<img src="/static/image/task/test.png">-->
        </div>
        <ul>
          <li
            v-for="(item,key) in table2"
            :class="{currt_ing:ings==key}"
            @click="li_item_click(key,item.InspectionTime,item.ID)"
          >
            <section class="ui_box">
              <img src="/static/image/task/icon_1.png" class="l" style="margin: 5px 0 0 12px;">
              <div class="r itext">
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
                {{item.InspectionBy === '自动巡检'?'自动巡检':`一键巡检`}}
                <!-- 一键巡检 -->
                <span>{{item.InspectionTime.split(" ")[1]}}</span>
              </span><br>
              <span v-if="item.InspectionBy !== '自动巡检'">{{item.InspectionBy}}</span>
            </p>
          </li>

          <!--
	  		  		<li :class="{currt_ing:ings==1}"  @click="click_btn(1)">
	  		  		<section class="ui_box">
	  		  		<img src="/static/image/task/icon_1.png" class="l" style="margin: 5px 0 0 12px;">
	  		  		<div class="r itext">
	  		  			<p><span class="colors"></span><span class="igh">正常</span><span class="hgy">70</span></p>
	  		  			<p><span class="colors colors_red"></span><span class="igh">异常</span><span class="hgy">30</span></p>
	  		  		</div>
	  		  		</section>
	  		  		<p class="ghj_time"><span >04:00</span><span>一键巡检</span></p>
	  		  	</li>		
          -->
        </ul>
      </section>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Inspectionreport abc"></span>
          <span>巡检记录</span>
        </p>
      </div>
      <div class="show_exl">
        <!--table-->
        <div id="is_table_spid">
            <el-table
               :data="all_table"
               max-height="360"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               v-loadmore="loadMore"
               >
               <el-table-column type="index" label="序号" width="80">

               </el-table-column>
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 show-overflow-tooltip
                >
               </el-table-column>
            </el-table>
        </div>

        <!--end of table-->
        <!--<iframe :src="exl_url"    frameborder="0" scrolling="yes"  class="iframe_tiem"></iframe>-->
      </div>
    </div>
    <div class="bg_are" v-if="activeIndex === 1">
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
          <span class="label">巡检路线名称</span>
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
          <span>巡检总况</span>
        </p>
      </div>
      <section class="btn_baritems">
        <div class="l showitem01">
          <section id="record-chart" style="height:183px; width: 90%;">
            <pie-chart :data="chartData1" :color='["#00D294", "#89192E", "#2A91FC"]' :setting="{legend:{x:'210px'}}"></pie-chart>
          </section>
          <div>
            <div class="atc_title">
              <p>巡检点数</p>
              <p>
                {{points}}
                <!--100-->
              </p>
            </div>
            <div class="act_num">待巡检计划：
              <span>
                <!--6-->
                {{waitingPlan}}个
              </span>
            </div>
            <div class="act_num02">
              <p>
                <!--70-->
                {{pointsInfo.NormalCount?pointsInfo.NormalCount:0}}
              </p>
              <p>
                <!--50-->
                {{pointsInfo.FaultCount?pointsInfo.FaultCount:0}}
              </p>
              <p>
                <!--50-->
                {{pointsInfo.WaitingCount?pointsInfo.WaitingCount:0}}
              </p>
            </div>
          </div>
          <!--	<img src="/static/image/task/test.png">-->
        </div>
        <ul>
          <li
            v-for="(item,key) in plans"
            :class="{currt_ing:active==key}"
            @click="active=key;queryPlan(item.ID)"
          >
            <section class="ui_box">
              <h5>{{item.InspectionPlanName}}</h5>
              <div class="l status">
                  {{inspectionStateArr[item.InspectionState]}}
              </div>
              <div class="r itext">
                <p>
                  <span class="colors" style="background:#2A91FC"></span>
                  <span class="igh">待巡检</span>
                  <span class="hgy">
                    <!--70-->
                    {{item.InspectionCount - item.NormalCount - item.FaultCount}}
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
                {{item.InspectionDatetime.split(' ')[1]}}
              </span>
              <span>
                {{item.FContacts}}
                <!-- 一键巡检 -->
              </span>
            </p>
          </li>
        </ul>
      </section>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Inspectionreport abc"></span>
          <span>巡检记录</span>
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
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
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
import * as comm from "../../assets/js/pro_common";
import {Inspection,FileUpLoad,project} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {pieChart} from '@/caiot/zw-components/index'
import './InspectionRecords.scss';
export default {
  mixins:[table],
  data() {
    return {
      projectNames: localStorage.getItem("projectname"),
      centerDialogVisible: false, //用于弹出框
      htmlTitle: "巡检报告", //巡检报告生成名称
      Dialog_table0: [], //巡检报告弹出框正常、框异值-总数表格
      Dialog_table1: [], //巡检报告弹出框正常值-表格
      Dialog_table2: [], //巡检报告弹出框异常值-表格

      value1: new Date(), //时间选择值
      bar_value: "", //把环形图值付给这里
      table2: "",
      ings: 0, //点击巡检li标签高亮
      exl_url: "", //用于在div内浏览的地址
      exl_hef: "", //用于导出exl，用split()分割后，得到直接地址
      currt: 0, //一键巡检遮罩层
      timesArr:[],//设置物联巡检时间
      showSetTime:false,//设置一键巡检弹框是否显示
      all_table: [], //所有表格数据。
      activeIndex: 0,
      chartData:{},
      // exl_url:"http://www.szqianren.cn/CreateFile/新都汇/新都汇物联巡检记录2018112612.xls",
      //人工巡检
      time:new Date(),
      filterText:'',
      points:0,//巡检点总数
      waitingPlan:0,
      pointsInfo:{},
      plans:[],
      active:0,//默认选中第一个计划
      planID:'',
      planID1:'',
      records:[],
      showReport:false,
      dateReport:null,
      pageIndex1:1,
      chartData1:{},
      tableLabel:[
          {
              prop: 'AreaName',
              label: '区域名称'
          },
          {
              prop: 'InspectionObject',
              label: '巡检点'
          },
          {
              prop: 'InspectionTime',
              label: '巡检时间'
          },
          {
              prop: 'InspectionItem',
              label: '巡检项'
          },
          {
              prop: 'InspectionValue',
              label: '巡检值'
          },
          {
              prop: 'LimitValue',
              label: '越限值'
          },
          {
              prop: 'InspectionResult',
              label: '巡检结果'
          },
          {
              prop: 'InspectionNote',
              label: '备注'
          }
      ],
      inspectionStateArr:['待巡检','巡检中','已完成','逾期']
    };
  },
  components:{
    pieChart
  },
  methods: {
    async make_paf() {
      //生成pdf文件的方法
      /*巡检报告弹ajax请求数据*/
      let ch_time = "";
      if (this.value1 == "" || this.value1 == null) {
        ch_time = comm.CurentTime().clock.split(" ")[0]; //默认为当天
      } else {
        ch_time = this.value1;
      }
      await new Promise((resolve,reject) => {
        Inspection({
          FAction: "QueryInspectionReportByDate",
          FDateTime: ch_time
        })
        .then(data => {
          this.Dialog_table0 = data.FObject.Table;
          this.Dialog_table1 = data.FObject.Table1;
          this.Dialog_table2 = data.FObject.Table2;
          resolve()
        })
        .catch(error => {
          reject()
        })
      })
      /*巡检报告弹ajax请求数据*/

      this.centerDialogVisible = true; //弹出-弹出框
      /*生成pdf名称*/
      let now_times = ""; //如果日期为空，默认为昨天的
      now_times = this.value1.getFullYear()+comm.formatNumber((this.value1.getMonth()+1))+comm.formatNumber((this.value1.getDate()))
      /*生成pdf名称*/
        if (this.Dialog_table2 != "") {
          //如果没有数据，就不生成pdf文件
          let fileName = localStorage.getItem("projectname") + '物联巡检' +  now_times
          await new Promise(resolve => {
            this.$nextTick(() => {
              resolve()
            })
          })
          this.getPdf('#pdf_htmls',fileName);
          this.fileUpload('#pdf_htmls',fileName)
        }
    },

    logTimeChange(val) {
      //选择时间
      //console.log(this.value1)
    },

    li_item_click(x = 0, gettime, id,scroll = false) {
      //点击巡检总况 列表事件,把id带过来，去查列表数据
      this.ings = x; //当前的点击的li高亮
      this.planID1 = id
      if(!scroll){
        this.pageIndex1 = 1
      }
      Inspection({
        FAction: "QueryInspectionRecord",
        ID: id,
        PageIndex:this.pageIndex1,
        PageSize:20
      })
      .then(data => {
        if(scroll){
          this.all_table.push(...data.FObject)
          if(!data.FObject.length){
            this.pageIndex1 --
          }
        }else{
          this.all_table = data.FObject
        }
      })
      .catch(error => {

      })
      if (this.table2 != "" && x == 0) {
        gettime = this.table2[0].InspectionTime; //默认为第一个li的时间值
      }
      let dates = gettime.split(" ")[0];
      dates = dates.replace(/-/gi, "");
      let hour =
        gettime.split(" ")[1].split(":")[0] +
        gettime.split(" ")[1].split(":")[1]; //加上时分秒
      let groud_time = dates + hour;
      let urls =
        "https://view.officeapps.live.com/op/view.aspx?src=http://www.szqianren.cn/CreateFile/PID/ABC物联巡检记录time.xls";
      let reg_urls = urls
        .replace(/ABC/gi, localStorage.getItem("projectname"))
        .replace(/time/i, groud_time)
        .replace(/PID/i, localStorage.getItem("projectid"));
      //console.log(this.table2)
      if (this.table2 == "") {
        //如果没有数据，exl路径就清空
        reg_urls = "";
        this.exl_hef = ""; //如果没有数据，导出exl的a href="" 路径就清空
      } else {
        this.exl_hef = reg_urls.split("=")[1]; //分割地址，用于导出exl文档
      }

      this.exl_url = reg_urls;

      //  console.log(reg_urls)
    },
    loadMore(){
      this.pageIndex1 ++
      this.li_item_click(this.ings,this.value1,this.planID1,true)
    },
    start_barData(val) {
      //初始化取数据及点击时间选择器
      let timesh = "";
      if (!val) {
        timesh = comm.CurentTime().clock.split(" ")[0] + " " + "00:00:00"; //传当前时间
      } else {
        timesh = val + " " + "00:00:00"; //传当前时间
        /*如果选择时间为今天时间，一键巡检就可以点击*/

        if (val == comm.CurentTime().clock.split(" ")[0]) {
          this.currt = 0;
        } else {
          this.currt = 1;
        }
        /*enf of 如果选择时间为今天时间，一键巡检就可以点击*/
      }
      project({
        FAction: "GetPrjInspection",
        ProjectID: localStorage.getItem("projectid"),
        FDateTime: timesh,
      })
      .then(data => {
          this.bar_value = data.FObject.Table[0]; //把环形图值付给它。再在页面读取总数等值
          this.table2 = data.FObject.Table1; //把巡检总况列表值付给table2。
          let datas = [{value:data.FObject.Table[0].NormalCount,name:"正常"},{value:data.FObject.Table[0].FaultCount,name:"异常"}]
          this.chartData = {
            columns:['正常','异常'],
            rows:datas
          }
          if (data.FObject.Table1.length > 0) {
            this.li_item_click("0", timesh, data.FObject.Table1[0].ID); //默认第一个li点击，把第一个id带过去
          }
      })
      .catch(error => {

      })
    },

    one_change() {
      //一键巡检只能查当前的
      project({
        FAction: "CreateCaiotInspectionByProject",
      })
      .then(data => {
        window.location = "http://www.szqianren.com/" + data.FObject;
        setTimeout(() => {
          this.start_barData()
        },1000)
      })
      .catch(error => {
        this.$message({
          type:'warning',
          message:'操作太频繁，请稍后重试！'
        })
      })
    },
    /**
     *  230.查询物联物联巡检配置信息 (物联巡检时间)
     */
    queryUInspectionConfig(){
      Inspection({
        FAction:'QueryUInspectionConfig'
      })
      .then(data => {
        this.timesArr = data.FObject.map(item => parseInt(item.Hour))
      })
      .catch(err => {})
    },
    /**
     * 设置物联巡检时间
     */
    setInspectionTime(){
      Inspection({
        FAction:'AddUInspectionConfig',
        FData:this.timesArr.join(',')
      })
      .then(data => {
      })
      .catch(err => {
        this.queryUInspectionConfig()
      })
      .finally(() => {
        this.showSetTime = false
      })
    },
    /**
     * 人工巡检选择时间
     */
    selectTime(val){
      this.queryPlanRecord()
    },
    /**
     * 查询人工巡检信息
     */
    queryPlanRecord(){
        Inspection({
          FAction:'QueryUInspectionPlanByCount',
          StartDateTime:this.time.toLocaleDateString() +' 00:00',
          EndDateTime:this.time.toLocaleDateString() +' 23:59'
        })
        .then(data => {
          this.points = data.FObject.Table?data.FObject.Table[0].Count:0
          this.pointsInfo = data.FObject.Table1?data.FObject.Table1[0]:{}
          this.plans = data.FObject.Table2?data.FObject.Table2.filter(item => item.InspectionState > 0):[]
          this.waitingPlan = data.FObject.Table3?data.FObject.Table3[0].WaitingPlanCount:0
          let datas = [{value:this.pointsInfo.NormalCount,name:"正常"},{value:this.pointsInfo.FaultCount,name:"异常"},{value:this.pointsInfo.WaitingCount,name:"待巡检"}]
          this.chartData1 = {
            columns:['正常','异常','待巡检'],
            rows:datas
          }
          if(this.plans.length){
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
     * 根据计划ID查询巡检记录
     */
    queryPlan(id){
      this.planID = id
      Inspection({
        FAction:'QueryUInspectionPlanRecord',
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
     * 查询人工巡检日报
     */
    async queryDateReport(){
      await new Promise((resolve,reject) => {
        Inspection({
          FAction:'QueryUInspectionDaily',
          StartDateTime:this.time,
          EndDateTime:this.time,
        })
        .then(data => {
          this.dateReport = data.FObject
          this.showReport = true
          resolve()
        })
        .catch(error => {
          reject()
        })
      })
      if(this.dateReport.length ===0){
        return
      }
      let fileName = localStorage.getItem("projectname") + '人工巡检' +  this.time.getFullYear()+comm.formatNumber((this.time.getMonth()+1))+comm.formatNumber((this.time.getDate()))
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
        Inspection({
            FAction:'QueryExportUInspectionPlanRecord',
            ID:this.planID
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
    this.start_barData();
    this.queryPlanRecord()
    // let tt = comm.CurentTime().clock.split(" ")[0];
    this.queryUInspectionConfig()
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
$img-url:'../../static/image/';
.set-inspection-time{
  .el-dialog{
    background: url(#{$img-url}task/inspection.png);
    background-size: 100% 100%;
    .el-input__inner{
      height: 46px;
      background: #18406b;
      border: 1px solid #05679e;
    }
  }
}
</style>
