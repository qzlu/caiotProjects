<template>
  <div :id="id" style="width:100%;height:100%"></div>
</template>
<script>
//引入uuid文件
import uuidv1 from "uuid/v1";
import echarts from "echarts";
export default {
  data() {
    return {
      id: "",
      myChart:null
    };
  },
  props: {
    data: {
      type: Object
    },
    setting: {
      type: Object
    }
  },
  created() {
    this.id = uuidv1(); //获取随机id
  },
  mounted() {
    this.$nextTick(() => {
      this.showChart();
    });
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.showChart();
      });
    }
  },
  methods: {
    /**
     * 绘制柱形图
     * @param {Object}  图标数据
     */
    showChart() {
      //生成line 坐标图
      var dom = document.getElementById(this.id);
      !this.myChart&&(this.myChart = echarts.init(dom));
      if (!this.$props.data.columns) {
        return;
      }
      var app = {};
      var option = null;
      option = {
        title: {
          text: this.data.title||'',
          textStyle: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "normal"
          },
          top: "15",
          left: "left"
        },
        tooltip: {
          trigger: "axis"
        },
        textStyle: {
          fontWeight: "normal", //标题颜色
          color: "#fff"
        },
        legend: {
          show: true,
          itemWidth:10,
          itemHeight:10,
          x: "right", //x,y 显示位置
          y: "15",
          textStyle: {
            fontWeight: "normal", //标题颜色
            color: "#fff",
            fontSize: '12px'
          }
        },
        grid: {
          top: "60",
          left: "10",
          right: "10",
          bottom: "40",
          containLabel: true
        },
        toolbox: {
          feature: {}
        },
/*         dataZoom: [
          {
            type: "inside",
            throttle: "50",
            start: 0,
            end:
              this.$props.data.columns.length <= 5
                ? 100
                : Math.floor((5 / this.$props.data.columns.length) * 100)
          }
        ], */
        xAxis: {
          type: "category",
          boundaryGap: true,
          nameLocation: "center",
          axisLine: {
            //x轴色
            lineStyle: {
              color: "#FFFFFF",
              width: 1
            }
          },
          axisLabel: {
            color: "#FFFFFF",
            interval: 0
          },
          axisTick: {
            show: false
          },
          nameTextStyle: {
            fontSize: 12
          },
          data: this.$props.data.columns
        },
        yAxis: [
          {
            type: "value",
            splitLine: { show: false }, //去除网格线
            minInterval:1,
            axisLine: {
              //y轴色
              lineStyle: {
                color: "#FFFFFF",
                width: 1
              }
            },
            axisLabel: {
              color: "#FFFFFF",
              interval: 0,
              formatter:val => {
                return val>10000?val/10000+'w':val
              },
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: this.$props.data.rows,
        color: this.$props.data.colorsArr || ["#1bd1a1"]
      };
      if (option && typeof option === "object") {
        this.myChart.setOption(option, true);
      }
    }
  }
};
</script>