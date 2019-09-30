<template>
  <div class="Ins_records">
    <!--弹出框(物联抄表)-->
    <!-- <el-button type="text" @click="make_paf">点击打开 Dialog</el-button>-->
    <el-dialog :visible.sync="centerDialogVisible" append-to-body class="Ins_records" width="1350px">
      <!--html-->
      <section class="ppt_item month-report" id="pdf_htmls" v-if="monthReport1.Table">
        <div class="htbn">
          <section>
            <div class="hdr">
              <p class="pn02">物联抄表月报</p>
              <p class="l pn">
                项目名称：{{projectNames}}
                <!--新都汇-->
              </p>
              <p class="r pn03">日期：
                <!--2018-09-20-->
                {{time.getFullYear() + '-' + (time.getMonth()+1)}}
              </p>
            </div>
            <div class="ng_item">
              <img
                src="../../../static/image/task/bicon_1.png"
                class="pimg"
                :class="{nnor:monthReport1.Table2.length>0}"
              >
              <img
                src="../../../static/image/task/bicon_2.png"
                class="pimg"
                :class="{nnor:monthReport1.Table2.length==0}"
              >
              <div class="r list">
                <ul v-for="item in monthReport1.Table">
                  <li class="l">{{item.EnergyTypeName}}　<span>{{item.EnergyTypeUnit}}</span></li>
                  <li class="l">抄表点数　<span>{{item.PointCount}}</span></li>
                  <li class="l">能耗正常　<span>{{item.NormalCount}}</span></li>
                  <li class="l">能耗异常　<span class="no">{{item.FaultCount}}</span></li>
                  <!-- <li class="l">设备异常　<span>{{item.DeviceFaultCount}}</span></li> -->
                </ul>
              </div>
            </div>
          </section>

          <div class="table-c">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="12.5%">能源类型</td>
                <td width="12.5%">分区能耗</td>
                <td width="12.5%">上次读数</td>
                <td width="12.5%">本次读数</td>
                <td width="12.5%">用量</td>
                <td width="12.5%">能耗情况</td>
              </tr>
              <tr v-for="(item,key) in monthReport1.Table1">
                <td>{{item.EnergyTypeName}}</td>
                <td>{{item.CountName}}</td>
                <td >{{item.LastMeterReadingValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.NowMeterReadingValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.NowDiffValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.MeterReadingResult}}</td>
              </tr>
            </table>
          </div>

          <div class="table-red">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="33%">异常抄表点名称</td>
                 <td width="33%">时间</td>
                <td width="33%">异常描述</td>
                <!-- <td width="25%">处理情况</td> -->
              </tr>
              <tr v-for="(item,key) in  monthReport1.Table2">
                <td>{{item.DeviceName}}</td>
                <td>{{item.NowMeterReadingDateTime}}</td>
                <td style="color: red;">{{item.MeterReadingResult}}</td>
                <!-- <td></td> -->
              </tr>
            </table>
          </div>

          <div class="person">备注：</div>
          <div class="person_pg">
            <span style="width: 180px; height: 30px; display: inline-block; text-align: left;">抄表人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">审核人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">管理员:</span>
          </div>
        </div>
      </section>
      <!--html-->
    </el-dialog>
    <!-- 人工抄表月报 -->
    <el-dialog :visible.sync="showReport" append-to-body class="Ins_records" width="1350px">
      <!--html-->
      <section class="ppt_item month-report" id="month-report" v-if="monthReport.Table">
        <div class="htbn">
          <section>
            <div class="hdr">
              <p class="pn02">物联抄表月报</p>
              <p class="l pn">
                项目名称：{{projectNames}}
                <!--新都汇-->
              </p>
              <p class="r pn03">日期：
                <!--2018-09-20-->
                {{time.getFullYear() + '-' + (time.getMonth()+1)}}
              </p>
            </div>
            <div class="ng_item">
              <img
                src="../../../static/image/task/bicon_1.png"
                class="pimg"
                :class="{nnor:monthReport.Table2.length>0}"
              >
              <img
                src="../../../static/image/task/bicon_2.png"
                class="pimg"
                :class="{nnor:monthReport.Table2.length==0}"
              >
              <div class="r list">
                <ul v-for="item in monthReport.Table">
                  <li class="l">{{item.EnergyTypeName}}　<span>{{item.EnergyTypeUnit}}</span></li>
                  <li class="l">抄表点数　<span>{{item.PointCount}}</span></li>
                  <li class="l">能耗正常　<span>{{item.NormalCount}}</span></li>
                  <li class="l">能耗异常　<span class="no">{{item.FaultCount}}</span></li>
                  <!-- <li class="l">设备异常　<span>{{item.DeviceFaultCount}}</span></li> -->
                </ul>
              </div>
            </div>
          </section>

          <div class="table-c">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="12.5%">能源类型</td>
                <td width="12.5%">分区能耗</td>
                <td width="12.5%">上次读数</td>
                <td width="12.5%">本次读数</td>
                <td width="12.5%">用量</td>
                <td width="12.5%">能耗情况</td>
              </tr>
              <tr v-for="(item,key) in monthReport.Table1">
                <td>{{item.EnergyTypeName}}</td>
                <td>{{item.CountName}}</td>
                <td >{{item.LastMeterReadingValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.NowMeterReadingValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.NowDiffValueSum}} {{item.EnergyTypeUnit}}</td>
                <td>{{item.MeterReadingResult}}</td>
              </tr>
            </table>
          </div>

          <div class="table-red">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr class="gg">
                <td width="33%">异常抄表点名称</td>
                 <td width="33%">时间</td>
                <td width="33%">异常描述</td>
                <!-- <td width="25%">处理情况</td> -->
              </tr>
              <tr v-for="(item,key) in  monthReport1.Table2">
                <td>{{item.MeterReadingObject}}</td>
                <td>{{item.MeterReadingTime}}</td>
                <td style="color: red;">{{item.PointResult}}</td>
                <!-- <td></td> -->
              </tr>
            </table>
          </div>

          <div class="person">备注：</div>
          <div class="person_pg">
            <span style="width: 180px; height: 30px; display: inline-block; text-align: left;">抄表人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">审核人:</span>
            <span style="width: 180px;height: 30px;display: inline-block;text-align: left;">管理员:</span>
          </div>
        </div>
      </section>
      <p v-else style="padding:50px">暂无数据</p>
      <!--html-->
    </el-dialog>
    <!-- 设置一键抄表 -->
    <el-dialog title="设置一键抄表" :visible.sync="showSetTimeDialog" top="350px" class="zw-dialog set-time-dialog">
      <div style="margin-top:30px;">
        <span>抄表时间</span>
        <el-select v-model="month" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="n in 12"
            :key="n"
            :label="n+'月'"
            :value="n">
          </el-option>
        </el-select>
        <div class="date-select">
                <ul class="l clearfix time-content">
                    <li  style="margin-top:0" v-for="(time, i) in timeArr" :key="i">{{time[0]}}号　{{time[1]}}<i class="el-icon-circle-close-outline" @click="deleteTime('timeArr',i)"></i></li>
                </ul>
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              v-model='showPopover'
              popper-class='select-week-popover'
             >
               <i class="el-icon-circle-plus-outline" slot="reference"></i>
               <div class="clearfix">
                    <div class="l" >
                         <p class="time-title">选择日期</p>
                         <el-scrollbar>
                             <ul class="week-select">
                                 <li v-for="i in 28" :class="{active:date==i}" :key="i" @click="date=i ">{{i}}号</li>
                             </ul>
                         </el-scrollbar>
                    </div>
                    <div class="r" style="width:194px;">
                         <p class="time-title">选择时间</p>
                         <div class="clearfix">
                             <div class="l time-select-main">
                               <el-scrollbar>
                                   <ul class="time-select">
                                       <li v-for="i in 24" :class="{active:h==i-1}" :key="i" @click="h=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="h==i-1">时</span></li>
                                   </ul>
                               </el-scrollbar>
                             </div>
                             <div class="r time-select-main">
                               <el-scrollbar>
                                   <ul class="time-select">
                                       <li v-for="i in 60" :class="{active:m==i-1}" :key="i" @click="m=i-1">{{((i-1)<10)?'0'+(i-1):i-1}} <span v-if="m==i-1">分</span></li>
                                   </ul>
                               </el-scrollbar>
                             </div>
                         </div>
                    </div>
               </div>
              <div class="time-select-footer">
                 <a @click="showPopover = false">取消</a>
                 <a @click="selectDate()">确定</a>
              </div>
            </el-popover>
        </div>
      </div>
      <div style="margin-top:20px;text-align:center"><button class="zw-btn zw-btn-primary" @click="AddUMeterReadingConfig">确定</button></div>
    </el-dialog>
    <!--弹出框-->
    <!---抄表记录-->
    <div class="top">
      <ul>
        <li :class="{active:activeIndex === 0}" @click="activeIndex = 0">物联抄表</li>
        <li :class="{active:activeIndex === 1}" @click="activeIndex = 1">人工抄表</li>
        <!-- <li>综合抄表</li> -->
      </ul>
    </div>
    <div class="bg_are" v-if="activeIndex === 0">
      <div class="ich">
        <div class="time">
          <p class="l name">日期</p>
          <div class="date_chs">
            <div class="block">
              <el-date-picker
                v-model="value1"
                type="month"
                @change="start_barData"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </div>

        <div class="ntb01" @click="one_change">一键抄表</div>
        <div class="ntb02" @click="showSetTimeDialog = true" >设置自动抄表</div>
        <div class="ntb03" @click="make_paf">报告预览</div>
        <div class="ntb04" @click="queryExportUMeterReadingRecordInfo">导出</div>
        <!-- <div class="ntb05">审核</div> -->
      </div>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Automaticinspection abc"></span>
          <span>抄表总况</span>
        </p>
      </div>
      <section class="btn_baritems">
        <div class="l showitem01" v-if="bar_value">
          <section id="show_bar" style="height:183px; width: 90%;">
            <pie-chart :data="chartData" :color='["#00D294", "#89192E"]' :setting="{legend:{x:'220px'}}"></pie-chart>
          </section>
          <div>
            <div class="atc_title">
              <p>抄表点数</p>
              <p>
                {{bar_value.MeterReadingCount}}
                <!--100-->
              </p>
            </div>
            <div class="act_num">抄表次数：
              <span>
                <!--6-->
                {{bar_value.PlanCount}}次
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
            @click="li_item_click(key,item.ID)"
          >
            <section class="ui_box">
              <h5>{{item.MeterReadingPlanName}}</h5>
              <img src="../../../static/image/task/icon_1.png" class="l" style="margin: 5px 0 0 12px;">
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
                {{item.ReadingBy === '自动抄表' ? '自动抄表':'一键抄表'}}
                <!-- 自动抄表 -->
              </span>
              <span>
                <!--00:00-->
                {{item.MeterReadingTime}}
              </span>
              <br>
              <span>
                {{item.ReadingBy}}
              </span>
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
	  		  		<p class="ghj_time"><span >04:00</span><span>一键抄表</span></p>
	  		  	</li>		
          -->
        </ul>
      </section>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Inspectionreport abc"></span>
          <span>抄表记录</span>
        </p>
      </div>
      <div class="show_exl">
        <!--table-->
        <div id="is_table_spid">
            <el-table
               :data="all_table"
               max-height="360"
               style="width: 100%"
               v-loadmore='loadMore1'
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column type="index" width="80" label="序号">
               </el-table-column>
               <el-table-column
                 v-for="item in tableLabel1"
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
    <div class="bg_are" v-if="activeIndex === 1">
      <ul class="ich record-header">
        <li class="l">
          <span class="label">日期</span>
          <el-date-picker
            class=""
            v-model="time"
            type="month"
            @change="selectTime"
            placeholder="选择日期"
          ></el-date-picker>
        </li>
<!--         <li class="l">
          <span class="label">抄表路线名称</span>
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
          <span>抄表总况</span>
        </p>
      </div>
      <section class="btn_baritems">
        <div class="l showitem01">
          <section id="record-chart" style="height:183px; width: 90%;">
            <pie-chart :data='chartData1' :color='["#00D294", "#89192E", "#2A91FC"]' :setting="{legend:{x:'210px'}}"></pie-chart>
          </section>
          <div>
            <div class="atc_title">
              <p>抄表点数</p>
              <p>
                {{totalInfo.MeterReadingPointCount}}
                <!--100-->
              </p>
            </div>
            <div class="act_num">待抄表计划：
              <span>
                <!--6-->
                {{totalInfo.WaitingPlanCount}}个
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
            :key="item.ID"
            :class="{currt_ing:active==key}"
            @click="active=key;queryPlan(item.ID)"
          >
            <section class="ui_box">
              <h5>{{item.MeterReadingPlanName}}</h5>
              <div class="l status">
                  {{inspectionStateArr[item.MeterReadingState]}}
              </div>
              <div class="r itext">
                <p>
                  <span class="colors" style="background:#2A91FC"></span>
                  <span class="igh">待抄表</span>
                  <span class="hgy">
                    <!--70-->
                    {{item.MeterReadingPointCount - item.NormalCount - item.FaultCount}}
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
                {{item.MeterReadingStartDateTime?item.MeterReadingStartDateTime.split(' ')[1]:"--"}}
              </span>
              <span>
                {{item.FUserNickname}}
                <!--一键抄表-->
              </span>
            </p>
          </li>
        </ul>
      </section>

      <div class="title">
        <p class="l ti_n">
          <span class="icon iconfont icon-Inspectionreport abc"></span>
          <span>抄表记录</span>
        </p>
      </div>
      <div class="show_exl">
        <!--table-->
        <div id="is_table_spid">
            <el-table
               :data="records"
               max-height="360"
               style="width: 100%"
               v-loadmore='loadMore'
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
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
import * as comm from "@/caiot/assets/js/pro_common";
import {Inspection,FileUpLoad,project,MeterReading} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {pieChart} from '@/caiot/zw-components/index'
import '../InspectionRecords.scss';
import '../InspectionRoad.scss';
export default {
  mixins:[table],
  data() {
    return {
      projectNames: localStorage.getItem("projectname"),
      centerDialogVisible: false, //用于弹出框
      htmlTitle: "抄表报告", //抄表报告生成名称
      Dialog_table0: [], //抄表报告弹出框正常、框异值-总数表格
      Dialog_table1: [], //抄表报告弹出框正常值-表格
      Dialog_table2: [], //抄表报告弹出框异常值-表格

      value1: new Date(), //时间选择值
      bar_value: "", //把环形图值付给这里
      table2: "",
      ings: 0, //点击抄表li标签高亮
      exl_url: "", //用于在div内浏览的地址
      exl_hef: "", //用于导出exl，用split()分割后，得到直接地址
      currt: 0, //一键抄表遮罩层
      chartData:{},
      all_table: [], //所有表格数据。
      activeIndex: 0,
      // exl_url:"http://www.szqianren.cn/CreateFile/新都汇/新都汇物联抄表记录2018112612.xls",
      //人工抄表
      time:new Date(),
      filterText:'',
      totalInfo:0,//抄表总况统计信息
      waitingPlan:0,
      pointsInfo:{},
      plans:[],
      active:0,//默认选中第一个计划
      planID:'',
      records:[],
      showReport:false,
      monthReport:{},
      monthReport1:{},
      chartData1:{},
      tableLabel:[
          {
            prop: 'RowNum',
            label: '序号'
          },
          {
            prop: 'AreaName',
            label: '抄表区域'
          },
          {
              prop: 'MeterReadingObject',
              label: '抄表点'
          },
          {
              prop: 'EnergyTypeName',
              label: '能耗类型'
          },
          {
              prop: 'EnergyTypeUnit',
              label: '单位'
          },
          {
              prop: 'LastMeterReadingValue',
              label: '上次读数'
          },
          {
              prop: 'MeterReadingValue',
              label: '本次读数'
          },
          {
              prop: 'UseValue',
              label: '本期用量'
          },
          {
              prop: 'MeterReadingTime',
              label: '抄表时间',
              width:160
          },
          {
              prop: 'MeterReadingResult',
              label: '设备状态'
          },
          {
              prop: 'ComparedValue',
              label: '同比用量'
          },
          {
              prop: 'MeterReadingNote',
              label: '异常描述'
          }
      ],
      tableLabel1:[
          {
            prop: 'AreaName',
            label: '抄表区域'
          },
          {
              prop: 'DeviceName',
              label: '抄表点'
          },
          {
              prop: 'EnergyTypeName',
              label: '能耗类型'
          },
          {
              prop: 'EnergyTypeUnit',
              label: '单位'
          },
          {
              prop: 'LastMeterReadingValue',
              label: '上次读数'
          },
          {
              prop: 'NowMeterReadingValue',
              label: '本次读数'
          },
          {
              prop: 'NowDiffValue',
              label: '本期用量'
          },
          {
              prop: 'NowMeterReadingDateTime',
              label: '抄表时间',
              width:160
          },
          {
              prop: 'NowLastDiffPercent',
              label: '同比用量'
          },
          {
              prop: 'MeterReadingNote',
              label: '异常描述'
          }
      ],
      inspectionStateArr:['待抄表','抄表中','已完成','逾期'],
      showSetTimeDialog:false,
      showPopover:false,
      month:[],
      timeArr:[],
      date:'',
      h:null,
      m:null,
      pageIndex1:1,
      planID1:''
    };
  },
  components:{
    pieChart
  },
  methods: {
    async make_paf() {
      //生成pdf文件的方法
      /*抄表报告弹ajax请求数据*/
      await new Promise((resolve,reject) => {
        MeterReading({
          FAction: "QueryUMeterReadingInfoByMonthly",
          FDateTime: this.value1.toLocaleDateString()
        })
        .then(data => {
          this.monthReport1 = data.FObject
          resolve()
        })
        .catch(error => {
          reject()
        })
      })
      /*抄表报告弹ajax请求数据*/

      this.centerDialogVisible = true; //弹出-弹出框
      if(this.monthReport1.Table.length ===0){
        return
      }
      /*生成pdf名称*/
      let now_times = ""; //如果日期为空，默认为昨天的
      now_times = this.value1.getFullYear()+comm.formatNumber(this.value1.getMonth()+1);
      /*生成pdf名称*/
          let fileName = localStorage.getItem("projectname") + '物联抄表' +  now_times
          await new Promise(resolve => {
            this.$nextTick(() => {
              resolve()
            })
          })
          this.getPdf('#pdf_htmls',fileName);
          this.fileUpload("#pdf_htmls",fileName)
    },

    logTimeChange(val) {
      //选择时间
      //console.log(this.value1)
    },

    li_item_click(x, id, scroll = false) {
      //点击抄表总况 列表事件,把id带过来，去查列表数据
      this.ings = x; //当前的点击的li高亮
      this.planID1 = id
      if(!scroll){
        this.pageIndex1 = 1
      }
      MeterReading({
        FAction: "QueryUMeterReadingRecordInfo",
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
    },
      /**
     * 滚动加载
     */
    loadMore1(){
      this.pageIndex1 ++
      this.li_item_click(this.ings,this.planID1,true)
    },
    /**
     * 173.物联抄表查询
     */
    start_barData() {
      MeterReading({
        FAction: "QueryUMeterReadingInfo",
        FDateTime: this.value1.getFullYear() + '-' + comm.formatNumber(this.value1.getMonth()+1)
      })
      .then(data => {
          this.bar_value = data.FObject.Table[0]; //把环形图值付给它。再在页面读取总数等值
          this.table2 = data.FObject.Table1; //把抄表总况列表值付给table2。
          let datas = [{value:this.bar_value.NormalCount,name:"正常"},{value:this.bar_value.FaultCount,name:"异常"}]
          this.chartData = {
            columns:['正常','异常'],
            rows:datas
          }
          if (data.FObject.Table1.length > 0) {
            this.li_item_click("0", data.FObject.Table1[0].ID); //默认第一个li点击，把第一个id带过去
          }else{
            this.all_table = []
          }
      })
      .catch(error => {
        console.log(error);
      })
    },
    /**
     * 一键抄表
     */
    one_change() {
      MeterReading({
        FAction: "AddUMeterReadingInfoAndRecord",
      })
      .then(data => {
        this.start_barData()
      })
      .catch(error => {
        this.$message({
          type:'warning',
          message:'操作太频繁，请稍后重试！'
        })
      })
    },
    /**
     * 设置一键抄表时间
     */
    AddUMeterReadingConfig(){
      if(!this.month.length||!this.timeArr.length){
        this.$message({
          type: 'error',
          message: '请选择时间'
        });
        return
      }
      let year = new Date().getFullYear(),date = []
      this.month.forEach(month => {
        this.timeArr.forEach(time => {
          date.push(year + '-' + comm.formatNumber(month) + '-' + comm.formatNumber(time[0]) +'-'+time[1])
        })
      })
      MeterReading({
        FAction:'AddUMeterReadingConfig',
        mUMeterReadingConfig:{
          ProjectID:localStorage.getItem('projectid'),
          MeterReadingDateStr:date.join(','),
          EnergyTypeID:0,
          FDescription:''
        }
      })
      .then(data => {
        this.$message({
          type: 'success',
          message: '设置成功'
        });
      })
      .catch(err => {
        this.$message({
          type: 'error',
          message: '设置失败'
        });
      })
      .finally(() => {
        this.showSetTimeDialog = false
      })
    },
    /**
     * 231.获取物联抄表时间设置
     */
    queryUMeterReadingConfig(){
      MeterReading({
        FAction:'QueryUMeterReadingConfig'
      })
      .then(data => {
        this.month = data.FObject.Table.map(item => parseInt(item.MeterReadingMonth))
        this.timeArr = data.FObject.Table1.map(item => {
          return item.FDayAndTime.replace(/号/,'').split(' ')
        })
      })
      .catch(err => {})
    },
    /**
     * 导出（物联抄表）
     */
    queryExportUMeterReadingRecordInfo(){
      MeterReading({
        FAction:'QueryExportUMeterReadingRecordInfo',
        ID:this.planID1
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
    /**
     * 人工抄表选择时间
     */
    selectTime(val){
      this.queryPlanRecord()
    },
    /**
     * 查询人工抄表信息
     */
    queryPlanRecord(){
        this.active = 0
        MeterReading({
          FAction:'QueryUMeterReadingPlanByCount',
          StartDateTime:this.time.getFullYear() + '-' + comm.formatNumber(this.time.getMonth()+1),
          EndDateTime:this.time.getFullYear() + '-' + comm.formatNumber(this.time.getMonth()+1)
        })
        .then(data => {
          this.totalInfo = data.FObject.Table?data.FObject.Table[0]:{}
          this.plans = data.FObject.Table1?data.FObject.Table1.filter(item => item.MeterReadingState>0):[]
          let datas = [{value:this.totalInfo.NormalCount,name:"正常"},{value:this.totalInfo.FaultCount,name:"异常"},{value:this.totalInfo.WaitingCount,name:"待抄表"}]
          this.chartData1 = {
            columns:['正常','异常',"待抄表"],
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
     * 根据计划ID查询抄表记录
     * id 计划ID
     * scroll 为true时是滚动加载
     */
    queryPlan(id,scroll = false){
        if(!scroll){
          this.pageIndex = 1
        }
        this.planID = id
        MeterReading({
          FAction:'QueryUMeterReadingPlanRecord',
          FDateTime:this.time.getFullYear() + '-' + comm.formatNumber(this.time.getMonth()+1),
          ID:id,
          PageIndex:this.pageIndex,
          PageSize:'20'
        })
        .then(data => {
          if(scroll){
            if(data.FObject.length !==0){
              this.records.push(...data.FObject)
            }else{
              this.pageIndex--
            }
          }else{
            this.records = data.FObject
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    /**
     * 滚动加载
     */
    loadMore(){
      this.pageIndex ++
      this.queryPlan(this.planID,true)
    },
    /**
     * 查询人工抄表月报
     */
    async queryDateReport(){
      await new Promise((resolve,reject) => {
        MeterReading({
          FAction:'QueryUMeterReadingCountByMoneth',
          FDateTime:this.time.getFullYear() + '-' + comm.formatNumber(this.time.getMonth()+1) + '-01'
        })
        .then(data => {
          this.monthReport = data.FObject
          this.showReport = true
          resolve()
        })
        .catch(error => {
          reject()
        })
      })
      if(this.monthReport.Table.length ===0){
        return
      }
      let fileName = localStorage.getItem("projectname") + '人工抄表' +  this.time.getFullYear() + comm.formatNumber(this.time.getMonth()+1)
      await new Promise(resolve => {
        this.$nextTick(() => {
          resolve()
        })
      })
      this.getPdf('#date-report', fileName);
      this.fileUpload("#date-report",fileName)
    },
    /**
     * 设置一键抄表时间
     */
    selectDate(){
        if(this.date==null||this.h == null||this.m == null){
            this.$message({
                type:'warning',
                message:'请选择时间'
            })
            return
        }
        let  hh = this.h <10?'0'+this.h:this.h
        let  mm = this.m <10?'0'+this.m:this.m
        this.timeArr.push([this.date,hh+':'+mm])
        this.showPopover = false
    },
    /**
     * 删除时间
     */
    deleteTime(arr,i){
        this[arr].splice(i,1)
    },
    /**
     * exportFile 导出
     */
    exportFile(){
        MeterReading({
            FAction:'QueryExportUMeterReadingPlanRecord',
            ID:this.planID,
            FDateTime:this.time.getFullYear() + '-' + comm.formatNumber(this.time.getMonth()+1),
            FName:''
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
    this.queryUMeterReadingConfig()
    let tt = comm.CurentTime().clock.split(" ")[0];
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
      .list ul li{
        width: 25%
      }
    }
  }
  .zw-dialog.set-time-dialog{
    .el-dialog{
      width: 540px;
      height: 262px;
      background: url('#{$img-url}admin/btn3.png') center no-repeat;
      background-size: 100% 100%;
      .el-input{
        width: 150px;
        &__inner{
          background:rgba(24,64,107,1);
          border:1px solid rgba(5,103,158,1);
        }
      }
    }
  }
}
</style>
