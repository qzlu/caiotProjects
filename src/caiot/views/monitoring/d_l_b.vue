<template>
  <section class="table_bh">
    <div style=" margin-top: 25px;" class="btn_jrh">
      <!--<p @click="tagchange(0)"  :class="{'active':currt==0}">资料</p>-->
      <p :class="{'active':currt==1}" @click="tagchange(1)">基本信息</p>
    </div>

    <div class="Titems_a" :class="{'showing':currt==0}">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="220"
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
        :default-sort="{prop: 'numbers', order: 'descending'}"
      >
        <el-table-column prop="numbers" label="序号" sortable width="180"></el-table-column>
        <el-table-column prop="name" label="资料名称" sortable width="180"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>

        <el-table-column prop="date" label="上传日期"></el-table-column>

        <el-table-column prop="alls" label="是否通用"></el-table-column>

        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="Titems_b" :class="{'showing':currt==1}">
      <div class="tin_left">
        <div class="tin_t1" v-for="(items,key) in data_information" style="position: relative;">
          <ul class="clearfix l">
            <li>设备编码：
              <span>{{items.DeviceCode}}</span>
            </li>
            <li>设备名称：
              <span>{{items.DeviceName}}</span>
            </li>
            <!--<li>设备类型：<span>供配电</span></li>-->
            <li>生产厂家：
              <span>{{items.Manufacturer}}</span>
            </li>
            <li>出厂型号：
              <span>{{items.SpecificationsCode}}</span>
            </li>
            <li>出厂编号：
              <span>{{items.ManufacturingNumber}}</span>
            </li>
            <li>出厂日期：
              <span>{{items.ManufacturingTime}}</span>
            </li>
            <li>使用年限：
              <span>{{items.ServiceLife}}年</span>
            </li>
          </ul>
          <div  style="position: absolute; top: 35px; right: -600px; width: 750px;">
            <div style="float: right; margin: 0 10px;">
              <p>
                <img v-bind:src="img_url+items.DevicePhoto">
                <!--<img src="/static/image/indexdetail/test011.png">-->
              </p>
              <p>设备照片</p>
            </div>
            <div style="float: right;margin: 0 10px;">
              <p>
                <img v-bind:src="img_url+items.DeviceQrCode">
                <!--<img src="/static/image/indexdetail/test011.png">-->
              </p>
              <p>二维码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
.table_bh .el-table th > .cell {
  text-align: center;
}
.table_bh .el-table td,
.el-table th.is-leaf {
  border: none;
  color: #fff;
}
.table_bh .el-table td:hover .table_bh .el-table {
  background: red;
  color: red;
}

.table_bh .el-table th,
.el-table tr {
  background: none;
}
.table_bh .el-table th,
.el-table tr.warning-row {
  background: #042960;
}
.table_bh .el-table th,
.el-table tr.warning-no {
  background: #0b3975;
}
.table_bh .el-table tr:hover {
  background: none !important;
}
.table_bh .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #10468e !important;
}
.table_bh .el-table--enable-row-transition .el-table__body td {
  transition: none;
}
</style>
<script>
import * as comm from "@/caiot/assets/js/pro_common";
import {project} from '@/caiot/request/api';
export default {
  data() {
    return {
      currt: 1,
      img_url: '../../static/imgage',
      data_information: [],
      tableData: [
        {
          id: "1",
          numbers: "11",
          name: "王小虎",
          type: "供配电",
          date: "2016-05-02",
          alls: "是"
        },
        {
          id: "2",
          numbers: "13",
          name: "王小虎",
          type: "供配电",
          date: "2016-04-02",
          alls: "是"
        },
        {
          id: "2",
          numbers: "14",
          name: "王小虎",
          type: "供配电",
          date: "2016-03-02",
          alls: "是"
        },
        {
          id: "4",
          numbers: "16",
          name: "王小虎",
          type: "供配电",
          date: "2016-06-02",
          alls: "是"
        }
      ]
    };
  },
  created() {
    this.getSingleDeviceBaseInfo()
  },
  methods: {
    getSingleDeviceBaseInfo(){
      project({
        FAction: "GetSingleDeviceBaseInfo",
        DeviceID: this.$route.params.id
      })
      .then(data => {
        this.data_information = data.FObject;
        this.$emit("ready", data.FObject[0]);
      })
      .catch(err => {})
    },
    handleClick(row) {
      console.log(row);
    },
    /*table 样式色修改*/
    tableRowStyle({ row, rowIndex }) {
      //  return 'background-color: #0b3975'
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #03234c;color: #fff;";
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "warning-no";
      }
    },
    /*end of table 样式色修改*/

    /*tag切换*/
    tagchange(x) {
      this.currt = x;
    }
    /*tag切换*/
  },
  mounted: function() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
a {
  color: #42b983;
}

.table_bh {
  padding: 15px 25px 5px 25px;
}
.table_bh .btn_jrh {
  height: 46px;
}
.table_bh .btn_jrh p {
  cursor: pointer;
  font-size: 16px;
  color: #f1f1f2;
  width: 137px;
  height: 46px;
  line-height: 46px;
  float: left;
  background: url(/static/image/indexdetail/tool_nor_Information.png);
}
.table_bh .btn_jrh p.active {
  background: url(/static/image/indexdetail/tool_sel_Information.png);
}

.table_bh .Titems_b,
.table_bh .Titems_a {
  display: none;
}
.table_bh .showing {
  display: block;
}
.Titems_b .tin_left {
  height: 190px;
  padding: 10px 0 0 0;
  border: solid 2px #0f2e5c;
}
.Titems_b .tin_left .tin_t1 {
  width: 800px;
  float: left; /*overflow: hidden;*/
  padding: 10px 0 0 30px;
}
.Titems_b .tin_left .tin_t1 ul li {
  color: #737373;
  height: 40px;
  line-height: 40px;
  width: 350px;
  float: left;
  font-size: 17px;
  text-align: left;
}
.Titems_b .tin_left .tin_t1 ul li span {
  color: #00d294;
  padding-left: 10px;
}

.Titems_b .tin_left .tin_t2 {
  overflow: hidden;
  float: right;
}
.Titems_b .tin_left .tin_t2 > div {
  float: left;
  margin: 15px 25px 0 0;
  font-size: 17px;
}
.Titems_b img{
  width:120px;
  height: 120px;
}
</style>
