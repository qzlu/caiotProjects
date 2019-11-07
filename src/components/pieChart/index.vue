<template>
  <div :id="id" style="width:100%;height:100%;z-index:10"></div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
import echarts from 'echarts'
export default {
  data() {
    return {
        id:'',
        myChart:null
    };
  },
  props: {
    data: {
      type: Object
    },
    series: Array,
    color:{
        type:Array,
    },
    setting:{
        type:Object
    },
    showLegend:{
      default:true,
      type:Boolean
    },
    label:{
      type:Object,
      default:() => {
        return {
          show:false
        }
      }
    }
  },
  created(){
    this.id = uuidv1() //获取随机id
  },
  mounted() {
    this.$nextTick(() => {
        (this.data||this.series) && this.showPieChart()
    })
  },
  watch: {
    data(value){
        this.$nextTick(() => {
            value && this.showPieChart()
        })
    },
    series(value){
        this.$nextTick(() => {
            value && this.showPieChart()
        })
    }
  },
  methods: {
    /**
     * 绘制饼图
     * id 图形容器id
     * data 数据
     */
    showPieChart() {
      var dom = document.getElementById(this.id);
      !this.myChart&&(this.myChart = echarts.init(dom));
      var app = {};
      var option = null;
      app.title = "环形图"
      option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          show:this.showLegend,
          orient: "vertical",
          x: this.$props.setting&&this.$props.setting.legend?this.$props.setting.legend.x:'195px',
          y: "center",
          textStyle: { color: "#fff" },
          itemWidth: 13,
          itemHeight: 13,
          data: this.$props.data&&this.$props.data.columns  
        },
        series: this.series || [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50", "60"],
            avoidLabelOverlap: true,
            center:this.setting&&this.setting.center||['50%','50%'],
            label: {
              normal: this.label,
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data:this.$props.data.rows
          }
        ],
        color:this.$props.color && this.$props.color
      };
      if (option && typeof option === "object") {
        this.myChart.setOption(option, true);
      }
    }
  },
};
</script>