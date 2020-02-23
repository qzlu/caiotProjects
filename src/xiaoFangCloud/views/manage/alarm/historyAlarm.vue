

<template>
  <div class="report">
    <Table
      ref="table"
      :showAdd="false"
      :tableLabel="tableLabel"
      :getData="queryData"
      :filter="false"
      :exportData="exportFile"
      :showOperationColumn="false"
    >
      <template slot="operation">
        <li class="l" style="margin-left:378px;">
          <span class="label">设备名称</span>
          <el-input class="search-input" v-model="filterText"></el-input>
        </li>
<!--         <li class="l">
          <span class="label">告警级别</span>
          <el-select v-model="Alarm_levid">
            <el-option v-for="(item,index) in Alarm_lev" :key="index" :value="index" :label="item"></el-option>
          </el-select>
        </li> -->
        <li class="l">
          <span class="label">平台类型</span>
          <el-select v-model="systemId">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="(item,index) in sysTemList" :key="index" :value="item.ID" :label="item.FormName"></el-option>
          </el-select>
        </li>
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
        <li class="l" @click="$refs.table.queryData()">
          <el-button><i class="iconfont icon-search"></i>查询</el-button>
        </li>
      </template>
    </Table>
  </div>
</template>
<script>
import { Alarm, Device } from "@/xiaoFangCloud/request/api.js";
const alarmLevel = ["全部", "提示", "一般", "严重"]
import Table from '../layout/table.vue'
const orderState={
  1:'待完成',
  2:'已完成',
  3:'待接单',
  4:'待派单',
  5:'已逾期',
  6:'未完成',
  7:'误报',
  8:'转单',
  9:'到场',
  10:'处理中'
}
export default {
  data() {
    return {
      tableLabel: [
        {
            prop:'FormName',
            label:'应急系统'
        },
        {
            prop: 'ShortName',
            label: '项目名称',
            width:160
        },
        {
            prop: 'AlarmTime',
            label: '告警时间',
            width:160
        },
        {
            prop: 'AlarmTypeName',
            label: '告警类型',
        },
        {
            prop: 'DeviceName',
            label: '设备名称',
            width:160
        },
        {
            prop: 'Duration',
            label: '告警级别',
            formatter: (row)=> alarmLevel[row['AlarmLevel']]
        },
        {
            prop:'AlarmText',
            label:'告警内容',
            width:160
        },
        {
            prop:'AlarmData',
            label:'当前值',
        },
        {
            prop:'OrderState',
            label:'确认进度',
            formatter:(row, column, cellValue, index) => orderState[row.OrderState]
        },
        {
            prop:'ID',
            label:'救援单号',
        },
        {
            prop:'IsRecovery',
            label:'告警状态',
            formatter:(row, column, cellValue, index) => row.IsRecovery == 1?'已恢复':'未恢复'
        },
        {
            prop:'RecoveryTime',
            label:'恢复时间',
        },
      ],
      time: [new Date(), new Date()], //时间选择参数
      AlarmType: {}, //告警类型
      Alarm_Typeid: 0, //告警类型id,默认为0，
      Alarm_lev: alarmLevel, //告警级别
      Alarm_levid: 0, //告警级别 对应id,默认为0
      systemId:0,
      filterText:''
    };
  },
  components:{
    Table
  },
  computed:{
    sysTemList(){
      return this.$store.state.sysTemList
    }
  },
  created() {
    this.querySystemAlarmType();
  },
  methods: {
    /*查询数据按钮*/
    queryData(data) {
        return Alarm({
          FAction: "QueryPageUAlarmListByDate",
          DeviceName: this.filterText,
          StartDateTime: this.time[0].toLocaleDateString() + " 00:00",
          EndDateTime: this.time[1].toLocaleDateString() + " 23:59",
          FormID:this.systemId,
          ...data
        })
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
      return Alarm({
        FAction: "CreateCaiotHistoryAlarmByProject",
        SearchKey: this.filterText,
        DeviceTypeID: "",
        AlarmLevel: this.Alarm_levid, //告警级别 (1~N的数字)
        AlarmTypeID: this.Alarm_Typeid, //告警类型ID
        StartDateTime: this.time[0].toLocaleDateString() + " 00:00",
        EndDateTime: this.time[1].toLocaleDateString() + " 23:59"
      })
    }
  },
  mounted: function() {}
};
</script>
