<template>
  <section class="en_omm">
    <div class="entitle_">
      <p>分项能耗</p>
      <p>（kwh）</p>
    </div>
    <div class="en_lb_bar" id="en_lb_bar"></div>
  </section>
</template>
 <style>
</style>
<script>
var echarts = require("echarts");

export default {
  //	props:['data_item','free_name'],
  data() {
    return {
      gName: [], //['当日','昨日','历史平均']
      typeName: [],
      message: []
    };
  },
  components: {},
  methods: {
    getUser(x, y) {
      //console.log("哈哈哈哈哈getUsergetUsergetUser！！！！")
    },

    getMessage(d, legend_name) {
      //从父组件传过来的数组 	,然后组件
      this.typeName = [];
      this.message = [];
      this.gName = [];
      this.gName = legend_name; //['当日','昨日','历史平均']
      /*
  	  	 {
			            name:'当日',
			            type:'bar',
			            data:[22800.5, 4000.9,13500.6, 16200.2, 13200.6, 20000.0],
			            barWidth : 30,//柱图宽度
			        }
  	  	  */

      for (let ab of d) {
        this.typeName.push(ab.DeviceItemName); //组装分类名称["中央空调","电梯","照明"....]
      }
      for (var i = 0; i < legend_name.length; i++) {
        let arrs = [],
          o = { type: "bar", barWidth: 30 };
        o.name = legend_name[i];
        for (let bs of d) {
          if (i == 0) {
            arrs.push(bs.CurEnergy);
            //console.log(bs.CurEnergy)
          }
          if (i == 1) {
            arrs.push(bs.PriorEnergy);
          }
        }
        o.data = arrs;
        this.message.push(o);
      }
      // console.log(legend_name)

      this.line_barEg();
    },

    line_barEg() {
      let _this = this;
      // console.log(_this.typeName)
      var dom = document.getElementById("en_lb_bar");
      var myChart = echarts.init(dom);
      var app = {};
      var option = null;
      app.title = "折柱混合";

      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        textStyle: {
          fontWeight: "normal", //标题颜色
          color: "#fff"
        },

        legend: {
          // data:['今日','昨日','历史平均'],
          data: _this.gName,
          x: "right", //x,y 显示位置
          y: "0",
          textStyle: {
            fontWeight: "normal", //标题颜色
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            //data: ['空调','电梯','照明','会所','给排水','停车场'],
            data: _this.typeName,

            axisPointer: {
              type: "shadow"
            },

            axisLine: {
              //y轴色
              lineStyle: {
                color: "#fff",
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "电量",
            // min: 0,
            // max: 250000,
            // interval: 50000,
            splitLine: { show: false }, //去除网格线
            axisLabel: {
              // formatter: '{value} ml'
            },
            axisLine: {
              //y轴色
              lineStyle: {
                color: "#fff",
                width: 1
              }
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            show: false, //是否显示这个右边y轴
            axisLine: { show: false }, //控制y轴线是否显示
            axisTick: { show: false }, // 去除y轴上的刻度线

            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        /* series: [
			        {
			            name:'今日',
			            type:'bar',
			            data:[22800.5, 4000.9,13500.6, 16200.2, 13200.6, 20000.0],
			            barWidth : 30,//柱图宽度
			        },
			        {
			            name:'昨日',
			            type:'bar',
			            data:[ 12800.7, 17000.7, 17500.6, 18200.2, 48000.7, 18000.8],
			            barWidth : 30,//柱图宽度
			        },
			        {
			            name:'历史平均',
			            type:'line',
			            yAxisIndex: 1,
			            data:[ 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
			        }
			    ],*/
        series: _this.message,
        color: ["#18d094", "#1385f7", "#ff7201"]
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
  },
  mounted: function() {
    /*let _this=this;
  	setTimeout(function(){
  		
  		_this.getMessage(_this.data_item,_this.free_name)
  	
  	}, 200);*/
  },
  computed: {}
};
</script>
 
<style type="text/css" scoped>
.entitle_ {
  float: left;
  height: 150px;
  width: 100px;
  padding: 50px 0 0 50px;
  font-size: 18px;
}
.en_lb_bar {
  height: 275px;
  width: 1375px;
  float: left;
  margin: 55px 0 0 -28px;
}
</style>
