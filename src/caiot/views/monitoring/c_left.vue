<template>
  <div class="left_ab">
    <ul>
      <li v-for="(item, index) in datalist">
        <p class="text">
          <span class="tc">{{item.TotalTitle}}</span>
        </p>
        <div class="ball_outsi">
          <div class="show_mon" :id="setdocID + index"></div>
          <div class="tl">
            <p style="color: #F1F1F2; font-size: 10px;">{{item.TargetTitle}}</p>
            <p style="color: #F1F1F2; font-size: 22px;">{{item.TargetValue}}</p>
          </div>

          <div class="numb" :class="'ghabc_'+item.TargetDetail.length">
            <!--{{item.TargetDetail.length}}-->
            <div v-for="(dnb, key) in item.TargetDetail">
              <p>
                {{dnb.STargetValue}}
                <span v-if="item.TargetDetail.length!=1">
                  <!--%-->
                </span>
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
var echarts = require("echarts");
import * as comm from "@/caiot/assets/js/pro_common";
import { project } from "@/caiot/request/api";
export default {
  props: ["data"],
  data() {
    return {
      datalist: "",
      setdocID: "pong_"
    };
  },
  created() {},
  methods: {
    Pro() {
      return new Promise((resolve, reject) => {
				project({
					FAction: "GetPrjTotalInfo",
				})
				.then(data => {
          this.datalist = data.FObject;
          resolve("succ");
				})
				.catch(err => {
					reject()
				})
			});
    },

    Pro2() {
      let _this = this;
      //返回一个Promise对象
      return new Promise(function(resolve, reject) {
        let arr = _this.datalist;
        for (var g = 0; g < _this.datalist.length; g++) {
          _this.Pie_list(_this.setdocID + g, g);
        }
      });
    },
    /*....处理图表....*/
    Pie_list(d, n) {
      var arrs01 = [],
        arrs02 = [],
        gcolor = [];
      var arr03 = this.datalist[n].TargetDetail;
      for (var j = 0; j < arr03.length; j++) {
        arrs02.push(arr03[j].STargetTitle); //取['运行','停止','故障'],
        arrs01.push({
          value: arr03[j].STargetValue,
          name: arr03[j].STargetTitle,
          color: arr03[j].SColor
        }); //取{value:10, name:'运行',}

        gcolor.push(comm.resetColor(arr03[j].SColor)); //设置图色
      }

      var dom_right = document.getElementById(d);
      var myChart = echarts.init(dom_right);
      var app = {};
      app.title = "环形图";
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "175px",
          y: "center",
          //data:['运行','停止','故障'],
          data: arrs02,
          textStyle: { color: "#fff" },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 15
        },
        series: [
          {
            // name:'访问来源',
            type: "pie",
            center: ["35%", "51%"], //图形显示位置
            radius: ["50", "60"],
            label: {
              normal: {
                show: false, //文字显示在图中间位置
                position: "center"
              }
            },

            /* data:[
											{value:10, name:'运行',},
											{value:30, name:'停止'},
											{value:60, name:'故障'},
									] */
            data: arrs01
          }
        ],
        //color:['#1bd1a1','#73777a','#8f1c2d']
        color: gcolor
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
  },

  mounted: function() {
    let _this = this;

    function settimeouts_data() {
      _this
        .Pro()
        .then(function(d) {
          return _this.Pro2(d);
        })
        .then(function() {})
        .catch(function(err) {
          //  throw new Error(err)
        });

      setTimeout(settimeouts_data, 6000);
    }

    settimeouts_data();
  }
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
.monitoring .left .left_item02 ul {
  width: 100%;
}
.monitoring .left .left_item02 ul li {
  width: 100%;
  margin: 0 0 21px 0;
  height: 200px;
  background: url(../../static/image/index/leftbar_bg_1.png);
  padding-top: 14px;
}
.monitoring .left .left_item02 ul li .text {
  width: 273px;
  height: 35px;
  background: url(../../static/image/index/leftbar_bg_2.png) 5px 14px no-repeat;
  margin: 0px 0 0 8px;
}
.monitoring .left .left_item02 ul li .text .tc {
  float: left;
  margin: -2px 0 0 12px;
  font-size: 18px;
  color: #f1f1f2;
}
.monitoring .left .left_item02 ul li.top .time {
  color: #607ab3;
  font-size: 20px;
  padding: 15px 0 5px 0;
}
.monitoring .left .left_item02 ul li.top .date {
  color: #607ab3;
  font-size: 18px;
  padding: 3px 0 5px 0;
}
.monitoring .left .left_item02 ul li.top .sd img {
  width: 70px;
  height: 60px;
  vertical-align: -16px;
}
.monitoring .left .left_item02 ul li.top .sd i {
  font-size: 32px;
  color: #2a91fc;
  padding: 0 2px 0 10px;
}
.monitoring .left .left_item02 ul li.top .sd i.sm {
  font-size: 26px;
  color: #525e7e;
  padding: 0;
}

.monitoring .left .left_item02 ul li .ball_outsi {
  position: relative;
  overflow: hidden;
}
.monitoring .left .left_item02 ul li .ball_outsi .show_mon {
  height: 146px;
  margin: 5px 10px;
  background: url(/static/image/index/leftbar_bg_circle.png) no-repeat 26px 4px;
  color: #fff;
}
.monitoring .left .left_item02 ul li .ball_outsi .tl {
  position: absolute;
  top: 62px;
  left: 56px;
  width: 100px;
  text-align: center;
}
.monitoring .left .left_item02 ul li .ball_outsi .numb {
  position: absolute;
  top: 37px;
  right: 24px;
  font-size: 20px;
  line-height: 27px;
}
.monitoring .left .left_item02 ul li .ball_outsi .t {
  position: absolute;
  top: 51px;
  right: 12px;
}

.monitoring .left .left_item02 ul li .ball_outsi .ghabc_1 {
  top: 65px;
}
.monitoring .left .left_item02 ul li .ball_outsi .ghabc_2 {
  top: 52px;
  right: 14px;
}
.monitoring .left .left_item02 ul li .ball_outsi .ghabc_3 {
  top: 38px;
  right: 14px;
}
.monitoring .left .left_item02 ul li .ball_outsi .n1 {
  top: 52px;
}
.monitoring .left .left_item02 ul li .ball_outsi .n2 {
  top: 52px;
  right: 18px;
}
</style>
