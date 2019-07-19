

<template>
  <div class="report">
    <ul class="operation clearfix">
<!--       <li class="l" style="margin-right:286px;">
        <el-button @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button>
      </li> -->
      <li class="l">
        <span class="label">设备名称</span>
        <el-input class="search-input" v-model="filterText"></el-input>
      </li>
      <li class="l">
        <span class="label">告警级别</span>
        <el-select v-model="Alarm_levid">
          <el-option v-for="(item,index) in Alarm_lev" :key="index" :value="index" :label="item"></el-option>
        </el-select>
      </li>
      <li class="l">
        <span class="label">平台类型</span>
        <el-select v-model="systemId">
            <el-option :value="0" label="全部"></el-option>
            <el-option v-for="(item,index) in sysTemList" :key="index" :value="item.ID" :label="item.FormName"></el-option>
        </el-select>
      </li>
<!--       <li class="l">
        <span class="label">告警类型</span>
        <el-select v-model="Alarm_Typeid">
          <el-option :value="0" label="全部"></el-option>
          <el-option
            v-for="item in AlarmType"
            :key="item.AlarmTypeID"
            :value="item.AlarmTypeID"
            :label="item.AlarmTypeName"
          ></el-option>
        </el-select>
      </li> -->
      <li class="l">
        <span class="label">时间段</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </li>
      <li class="l" @click="queryData()">
        <el-button><i class="iconfont icon-search"></i>查询</el-button>
      </li>
    </ul>
    <div class="zw-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="el-table-header"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
          :sortable="item.sortble"
          :formatter="item.formatter"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <zw-pagination @pageIndexChange="handleCurrentChange" :pageIndex="pageIndex" :total="total"></zw-pagination>
  </div>
</template>
<script>
import table from "@/xiaoFangCloud/mixins/table"; //表格混入数据
import { Alarm, Device ,Project} from "@/xiaoFangCloud/request/api.js";
const alarmLevel = ["全部", "提示", "一般", "严重"]
export default {
  mixins: [table],
  data() {
    return {
      tableLabel: [
        {
          prop: "RowIndex",
          label: "序号",
          width: 80
        },
        {
          prop:"FormName",
          label:"平台类型"
        },
        {
          prop: "AlarmTime",
          label: "告警时间",
          width: 160
        },
        {
          prop: "DeviceName",
          label: "设备名称"
        },
        {
          prop: "AlarmLevel",
          label: "告警级别",
          formatter: (row)=> alarmLevel[row['AlarmLevel']]
        },
        {
          prop: "AlarmTypeName",
          label: "告警类型",
          width: 160
        },
        {
          prop: "AlarmText",
          label: "告警内容",
          width: 300
        },
        {
          prop: "AlarmData",
          label: "告警值"
        },
        {
          prop: "RecoveryTime",
          label: "恢复时间",
          width: 160
        },
        {
          prop: "IsRecovery",
          label: "告警状态",
          formatter: (row)=> row.IsRecovery?'已恢复':'未恢复'
        },
      ],
      time: [new Date(), new Date()], //时间选择参数
      AlarmType: {}, //告警类型
      Alarm_Typeid: 0, //告警类型id,默认为0，
      Alarm_lev: alarmLevel, //告警级别
      Alarm_levid: 0, //告警级别 对应id,默认为0
      sysTemList:[],
      systemId:0
    };
  },
  created() {
    this.queryData();
    this.querySystemAlarmType();
    this.querySForm()
  },
  methods: {
    /*查询数据按钮*/
    queryData() {
        Alarm({
          FAction: "QueryPageUAlarmInfo",
          FName: this.filterText,
          DeviceTypeID: "",
          AlarmLevel: this.Alarm_levid, //告警级别 (1~N的数字)
          AlarmTypeID: this.Alarm_Typeid, //告警类型ID
          StartDateTime: this.time[0].toLocaleDateString() + " 00:00",
          EndDateTime: this.time[1].toLocaleDateString() + " 23:59",
          PageIndex: this.pageIndex,
          PageSize: 10,
          FormID:this.systemId
        })
        .then(data => {
          this.total = data.FObject.FTotalCount || 0
          this.tableData = data.FObject.Data || []
        })
        .catch(err => {});
    },
    /**
     * 查询告警类型
     */
    querySystemAlarmType() {
        Device({
          FAction: "QuerySAlarmTypeList"
        })
        .then(data => {
          this.AlarmType = data.FObject;
        })
        .catch(err => {});
    },
    /**
     * 获取平台列表
     */
    querySForm(){
        Project({
            FAction:'QuerySForm'
        })
        .then((data) => {
            this.sysTemList = data.FObject
        }).catch((err) => {
            
        });
    },
    /**
     * 导出
     */
    exportFile() {
      if (
        Date.parse(this.time[1]) - Date.parse(this.time[0]) >
        6 * 24 * 60 * 60 * 1000
      ) {
        this.$alert("    最多导出七天的数据！", "提示", {
          customClass: "alert_notice",
          dangerouslyUseHTMLString: true
        });
        return;
      }
      Alarm({
        FAction: "CreateCaiotHistoryAlarmByProject",
        SearchKey: this.filterText,
        DeviceTypeID: "",
        AlarmLevel: this.Alarm_levid, //告警级别 (1~N的数字)
        AlarmTypeID: this.Alarm_Typeid, //告警类型ID
        StartDateTime: this.time[0].toLocaleDateString() + " 00:00",
        EndDateTime: this.time[1].toLocaleDateString() + " 23:59"
      })
        .then(data => {
          window.location = "http://www.szqianren.com/" + data.FObject;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "导出失败!请重试"
          });
        });
    }
  },
  mounted: function() {}
};
</script>
