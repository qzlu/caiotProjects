<template>
  <div :id="id" style="width:100%;height:100%;z-index:10"></div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
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
     * 绘制雷达图
     * id 图形容器id
     * data 数据
     */
    showPieChart() {
      var dom = document.getElementById(this.id);
      !this.myChart&&(this.myChart = echarts.init(dom));
      var option = null;
      option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    fontSize:16,
                    color: '#F1F1F2',
                }
            },
            splitNumber:4,
            radius: 100,
            indicator:this.$props.data&&this.$props.data.columns
        },
        series: this.series || [
          {
            type: 'radar',
            lineStyle: {
                width:6,
                color:'#1CA7FF',
                shadowColor: '#1CA7FF',
                shadowBlur: 20
            },
            // areaStyle: {normal: {}},
            data:this.$props.data.rows
          }
        ],
      };
      if (option && typeof option === "object") {
        this.myChart.setOption(option, true);
      }
    }
  },
};
</script>