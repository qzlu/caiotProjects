
<template>
  <div class="report">
    <!--实时告警页面-->
    <ul class="report-header clearfix">
      <li class="l">
        <a :href="xls_adress">
          <button class="zw-btn zw-btn-export">导出</button>
        </a>
      </li>
      <li class="l">
        <button class="zw-btn zw-btn-refrest" @click="queryData()" style="margin-left:10px;">刷新</button>
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
import table from "@/caiot/mixins/table"; //表格混入数据
import { Alarm } from "@/caiot/request/api.js";
export default {
  mixins: [table],
  data() {
    return {
      tableLabel: [
        {
          prop: "RowNum",
          label: "序号",
          width: 80
        },
        {
          prop: "AlarmTime",
          label: "告警时间"
        },
        {
          prop: "AreaName",
          label: "区域名称"
        },
        {
          prop: "DeviceName",
          label: "设备名称"
        },
        {
          prop: "AlarmLevel",
          label: "告警级别"
        },
        {
          prop: "AlarmTypeName",
          label: "告警类型"
        },
        {
          prop: "AlarmText",
          label: "告警内容"
        },
        {
          prop: "AlarmData",
          label: "告警值"
        },
        {
          prop: "LimitValue",
          label: "告警条件"
        }
      ],
      xls_adress: ""
    };
  },
  created() {
    this.queryData();
    this.exportFile();
  },
  methods: {
    queryData() {
      Alarm({
        FAction: "QueryCaiotRealTimeAlarmByProject",
        PageIndex: this.pageIndex,
        PageSize: 10
      },true).then(data => {
        this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0;
        this.tableData = data.FObject.Table1 ? data.FObject.Table1 : [];
      });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData();
    },
    /**
     * 导出文件
     */
    exportFile() {
      Alarm({
        FAction: "CreatCaiotRealTimeAlarmByProject"
      }).then(data => {
        this.xls_adress = data.FObject;
      });
    }
  },
  mounted: function() {}
};
</script>
 
