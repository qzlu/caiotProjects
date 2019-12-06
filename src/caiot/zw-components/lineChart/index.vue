<template>
  <div :id="id" style="width:100%;height:100%"></div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
import echarts from "echarts";
export default {
  data() {
    return {
        id:''
    };
  },
  props: {
    data: {
      type: Object
    },
    color:{
        type:Array,
        required:true
    },
    setting:{
        type:Object
    }
  },
  created(){
    this.id = uuidv1() //获取随机id
  },
  mounted() {
    this.$nextTick(() => {
        this.showChart()
    })
  },
  watch: {
    data(){
        this.$nextTick(() => {
            this.showChart()
        })
    }
  },
  methods: {
    /**
     * 绘制折现图
     */
    showChart() {
          //生成line 坐标图
          var dom = document.getElementById(this.id);
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
              data: this.$props.data.name,
              x: "right", //x,y 显示位置
              y: "15",
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
              }
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              axisLine: {
                //y轴色
                lineStyle: {
                  color: "#7f7f7f",
                  width: 1
                }
              },
              data: this.$props.data.columns
            },
            yAxis: {
              type: "value",
              splitLine: { show: false }, //去除网格线
              axisLine: {
                lineStyle: {
                  color: "#7f7f7f",
                  width: 1
                }
              }
            },
            series: this.$props.data.rows,
            color: this.$props.color
          };
          if (option && typeof option === "object") {
            myChart.setOption(option, true);
          }
    }
  },
};
</script>