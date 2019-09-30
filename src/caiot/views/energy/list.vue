

<template>
  <section class="en_container">
    <section class="e_header">
      <div class="en_left">
        <p class="titles">总能耗</p>
        <!--<p class="en_refre"><img src="/static/image/energy/refre.png"></p>-->
        <section class="ech_time">
          <div class="e_tg">
            <ul style="width: 102px;">
              <li :class="{en_active:active==0}" @click="ech_date(0)">日</li>
              <!--<li :class="{en_active:active==1}" @click="ech_date(1)">周</li>-->
              <li :class="{en_active:active==2}" @click="ech_date(2)">月</li>
              <li :class="{en_active:active==3}" @click="ech_date(3)" style="border: none;">年</li>
            </ul>
            <div class="e_set_time">
              <p class="l">
                <img src="../../static/image/energy/button_1.png" @click="next_day(active,0)">
              </p>
              <!--<div class="en_tpn">2018-10-15</div>-->
              <div class="en_tpn">
                <el-date-picker
                  v-model="value1"
                  :type="ityle"
                  value-format="yyyy-MM-dd"
                  @change="Change_time()"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
              <p class="l">
                <img src="../../static/image/energy/button_2.png" @click="next_day(active,1)">
              </p>
            </div>
          </div>
        </section>

        <section class="e_bigdate">
          <div class="it01" style="width: 205px;">
            <p class="t">
              <!--当日-->
              {{titles[0]}}
            </p>
            <p class="nt" style="font-size: 20px;">
              {{table_data01.CurEnergy}}
              <!--20357-->
            </p>
            <p
              class="gc"
              :class="table_data01.PriorPercent>0 ? '' : 'gy'"
            >
              {{Math.abs(table_data01.PriorPercent)}}%
              <!--15%-->
            </p>
          </div>
          <div class="it01 nobg" style="width: 205px;">
            <p class="t">
              <!--昨日-->
              {{titles[1]}}
            </p>
            <p class="np">{{table_data01.PriorEnergy}}</p>
          </div>
          <div class="it01 nobg" style="display: none;">
            <p class="t">历史平均</p>
            <p class="np">{{table_data01.HisAvgEnergy}}</p>
            <p class="gc" :class="table_data01.PriorPercent>0 ? '' : 'gy'">
              {{table_data01.PriorPercent}}
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
        <div id="en_line" class="en_line"></div>
      </div>
    </section>

    <section class="big_Are">
      <div class="en_bigitem01" style="height: 347px; overflow: hidden;">
        <!--中间图表组件-->
        <line_bar ref="editchi"></line_bar>
      </div>
      <div class="en_bigitem02" style="height: 347px; overflow: hidden;">
        <!--底下图表组件-->
        <line_bar02 ref="editchi02"></line_bar02>
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
import line_bar from "./line_bar.vue"; //中间图片
import line_bar02 from "./line_bar02.vue"; //中间图片
var echarts = require("echarts");
export default {
  data() {
    return {
      value1: comm.getNowFormatDate(), //下拉初始化时间

      d_tyle: "Day", //点击年月日,ajax传给后台的类型
      ityle: "date", //点击年月日，右边时间下拉框类型
      active: 0,
      titles: ["当日", "昨日"],
      table_data01: "", //年月日按钮数据，左上1图

      table_data02: "", //曲线图右上1
      table_data02_name: [], //组装分类名称[当日,昨日,平均值]
      table_data02_value: [], //组装数组数据
      table_data02_xAxis: "", //x标尺数组

      table_data03: "", //组件bar数据
      table_data04: "" //组件bar数据
    };
  },
  components: {
    line_bar,
    line_bar02
  },
  methods: {
    Change_time(val) {
      //console.log(this.d_tyle)
      //console.log(this.value1)

      if (this.d_tyle == "Year") {
        this.titles = ["今年", "上年"];
        this.getDatas(this.value1.split("-")[0], this.d_tyle);
      } else if (this.d_tyle == "Month") {
        this.titles = ["本月", "上月"];
        var str = this.value1.split("-")[0] + "-" + this.value1.split("-")[1];
        this.getDatas(str, this.d_tyle);
      } else {
        this.titles = ["当日", "昨日"];
        this.getDatas(this.value1, this.d_tyle);
      }
    },
    formatDate(date) {
      //处理返回当周week的日期
      var year = date.getFullYear() + "-";
      var month = date.getMonth() + 1 + "-";
      var day = date.getDate() + "";
      return year + month + day;
    },

    getPreMonth(date) {
      //上一月
      var arr = date.split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      var t2 = year2 + "-" + month2;

      this.value1 = t2;

      //return t2;
    },

    /**
         * 获取下一个月@date 格式为yyyy-mm-dd的日期，如：2014-01-25

         */

    getNextMonth(date) {
      //获取下一个月
      var arr = date.split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }

      var t2 = year2 + "-" + month2;
      this.value1 = t2;
      // return t2;
    },

    ech_date(x) {
      //点击日期显示
      week_start = 0; //初始化周
      this.active = x;
      if (x == 0) {
        (this.ityle = "date"), //日期显示类型
          (this.d_tyle = "Day"), //ajax传给后台的类型
          (this.titles = ["当日", "昨日"]);
        this.value1 = comm.getNowFormatDate();
      }
      if (x == 1) {
        (this.ityle = "date"),
          (this.d_tyle = "Week"), //ajax传给后台的类型
          (this.titles = ["本周", "上周"]);
        var now = new Date();
        var day = now.getDay();
        var week = "7123456";
        var first = 0 - week.indexOf(day);
        var f = new Date();
        f.setDate(f.getDate() + first);
        var last = 6 - week.indexOf(day);
        var l = new Date();
        l.setDate(l.getDate() + last);

        var year = f.getFullYear() + "-";
        var month = f.getMonth() + 1 + "-";
        var day = f.getDate();
        this.value1 = year + month + day;
      }
      if (x == 2) {
        (this.ityle = "month"),
          (this.d_tyle = "Month"), //ajax传给后台的类型
          (this.titles = ["本月", "上月"]);
        var now_gh = new Date();
        var year = now_gh.getFullYear() + "-";
        var month = now_gh.getMonth() + 1;
        this.value1 = year + month;
      }
      if (x == 3) {
        (this.ityle = "year"),
          (this.d_tyle = "Year"), //ajax传给后台的类型
          (this.titles = ["今年", "上年"]);
        var now_gvg = new Date();
        var year2 = now_gvg.getFullYear() + "-";
        var month2 = now_gvg.getMonth() + 1;

        this.value1 = year2 + month2;
      }

      //this.value1为年月日时间，this.d_tyle为年、月、周、日等类型
      //console.log(this.value1)
      //console.log(this.d_tyle)
      /*if(this.d_tyle=="Year"){ //不用组装，后台处理
  			this.getDatas(this.value1.split("-")[0],this.d_tyle)
  		}else{
  			this.getDatas(this.value1,this.d_tyle)
  		}*/

      this.getDatas(this.value1, this.d_tyle);
    },

    next_day(type, x) {
      //选择周日月年
      let _this = this;
      var curDate = new Date(this.value1);
      if (type == 0) {
        //type==0为日
        if (x == 0) {
          var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
          this.value1 = preDate;
          //return preDate;
        } else {
          var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //后一天
          this.value1 = nextDate;
          //return nextDate;
        }
      }

      if (type == 1) {
        //type==0为周

        let _this = this;

        var addDate = function(date, n) {
          date.setDate(date.getDate() + n);
          return date;
        };
        var setDate = function(date) {
          var week = date.getDay();
          date = addDate(date, week * -1);
          _this.currentFirstDate = new Date(date);
          _this.value1 = _this.formatDate(_this.currentFirstDate); // console.log(_this.formatDate(_this.currentFirstDate))
        };
        if (week_start == 0) {
          setDate(new Date());
        }
        week_start = 1;

        if (x == 0) {
          setDate(addDate(_this.currentFirstDate, -7));
        } else {
          setDate(addDate(_this.currentFirstDate, 7));
        }
      }

      if (type == 2) {
        //点击按月份
        var aaa = "";
        if (this.value1 == "") {
          aaa = comm.getNowFormatDate();
        } else {
          aaa = this.value1;
        }

        if (x == 0) {
          this.getPreMonth(aaa);
        } else {
          this.getNextMonth(aaa);
        }
      }

      if (type == 3) {
        //点击按年份
        var bbb = "";
        if (this.value1 == "") {
          var date = new Date();
          var year = date.getFullYear();
        } else {
          bbb = this.value1;
        }

        if (x == 0) {
          var arr_y = this.value1.split("-");
          var year_y = parseInt(arr_y[0]) - 1; //获取当前日期的年份
          var t2_y = year_y + "-";
          this.value1 = t2_y;
        } else {
          var arr_y = this.value1.split("-");
          var year_y = parseInt(arr_y[0]) + 1; //获取当前日期的年份
          var t2_y = year_y + "-";
          this.value1 = t2_y;
        }
      }

      /*if(this.d_tyle=="Year"){  //不用组装，后台处理
  			this.getDatas(this.value1.split("-")[0],this.d_tyle)
  		}else{
  			this.getDatas(this.value1,this.d_tyle)
  		}*/
      this.getDatas(this.value1, this.d_tyle);
    },

    getDatas(gettime, day) {
      let _this = this;
      _this.$axios
        .post("Project", {
          FTokenID: localStorage.getItem("Token"),
          FAction: "GetPrjEnergy",
          FVersion: "1.0.0",
          FType: day, //day默认为天，没有参数的情况默认为"Day"
          ProjectID: localStorage.getItem("projectid"),
          FDateTime: gettime
        })
        .then(function(jsons) {
          //jsons.data.FObject数据：1.Table：总能耗统计数据 ，2Table1：能耗曲线数据，3.Table2：分项能耗数据，4.Table3：重点能耗数据（根据FType为天、周、月、年返回对应值）
          _this.table_data01 = jsons.data.FObject.Table[0]; //左上1
          _this.table_data02 = jsons.data.FObject.Table1; //右上1
          _this.table_data03 = jsons.data.FObject.Table2; //中间
          _this.table_data04 = jsons.data.FObject.Table3; //底下
          _this.table_data02_value = [];
          _this.table_data02_name = [];
          for (let obj of jsons.data.FObject.Table1) {
            _this.table_data02_name.push(obj.Cycle); //把分类名称写入数组[当日,昨日,平均值]
          }

          /*组装成线条bar数据
								  {
			               name:'当日',
			               type:'line',
			               stack: '总量',
			               data:[120, 132, 101, 134, 90, 230, 210, 310, 210]
			             } 
								  * */

          for (let obj2 of jsons.data.FObject.Table1) {
            let arrs = [],
              o = { type: "line" };
            let arrs_x = [];
            for (let i in obj2) {
              arrs.push(obj2[i]);
              arrs_x.push(i);
            }
            o.name = arrs[arrs.length - 1];
            arrs = arrs.slice(0, arrs.length - 1);
            o.data = arrs;
            _this.table_data02_value.push(o); //写入bar数据

            _this.table_data02_xAxis = arrs_x.slice(0, arrs_x.length - 1); //xAxis,x轴数据
          }
          /*end of 装成线条bar数据*/
          // console.log(_this.table_data02_value)
          _this.e_line01();

          //this.table_data03,this.table_data02_name 子组件1
          //console.log(_this.table_data02_name);
          _this.$refs.editchi.getMessage(
            _this.table_data03,
            _this.table_data02_name
          ); //调用子组件的方法
          //this.table_data04,this.table_data02_name 子组件2
          _this.$refs.editchi02.getMessage02(
            _this.table_data04,
            _this.table_data02_name
          ); //调用子组件的方法
        })
        .catch(function(err) {});
    },

    e_line01() {
      var dom = document.getElementById("en_line");
      var myChart = echarts.init(dom);
      var app = {};
      var option = null;
      option = {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: "axis"
        },
        textStyle: {
          fontWeight: "normal", //标题颜色
          color: "#fff"
        },
        legend: {
          //  data:['当日','昨日','历史平均'],
          data: this.table_data02_name,
          x: "right", //x,y 显示位置
          y: "20px",
          textStyle: {
            fontWeight: "normal", //标题颜色
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          axisLine: {
            //y轴色
            lineStyle: {
              color: "#7f7f7f",
              width: 1
            }
          },
          // boundaryGap: false,
          // data: ['周一','周二','周三','周四','周五','周六','周日'],
          data: this.table_data02_xAxis
        },
        yAxis: {
          type: "value",
          //min: 0,
          //  max:600,
          axisLine: {
            //y轴色
            lineStyle: {
              color: "#7f7f7f",
              width: 1
            }
          },
          splitLine: { show: false } //去除网格线
        },
        series: this.table_data02_value,
        color:["#18d094","#1385f7","#ff7206"]
       /*  color: ["#1385f7", "#18d094", "#ff7206"] */
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
  },
  mounted: function() {
    let _this = this;
    let times = comm.getNowFormatDate();
    this.getDatas(times, "");
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
  width: 320px;
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
</style>
