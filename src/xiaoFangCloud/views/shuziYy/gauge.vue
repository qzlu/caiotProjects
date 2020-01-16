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
      type: Number,
      default:0
    },
  },
  created(){
    this.id = uuidv1() //获取随机id
  },
  mounted() {
    this.$nextTick(() => {
       this.showPieChart()
    })
  },
  watch: {
    data(value){
        this.$nextTick(() => {
            value && this.changeValue(value)
        })
    },
  },
  methods: {
    /**
     * 绘制仪表盘
     * id 图形容器id
     * data 数据
     */
    showPieChart() {
        var dom = document.getElementById(this.id);
        !this.myChart&&(this.myChart = echarts.init(dom));
        var option = null;
        option = {
          tooltip: {
              formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
              {
                name: '业务指标',
                type: 'gauge',
                startAngle:200,
                endAngle:-25,
                radius:150,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, '#2A91FC'], [0.82, '#2A91FC'], [1, '#2A91FC']],
                        width: 4,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 20
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    fontWeight: 'bolder',
                    color: '#fff',
                    fontSize:18,
                   /*  shadowColor: '#fff', //默认透明
                    shadowBlur: 10 */
                },
                axisTick: {            // 坐标轴小标记
                    length: 8,        // 属性length控制线长
                    splitNumber:2,
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#FFFFFF',
                      /*   shadowColor: '#fff', //默认透明
                        shadowBlur: 10 */
                    }
                },
                splitLine: {           // 分隔线
                    length: 16,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                        color: '#fff',
                        /* shadowColor: '#fff', //默认透明
                        shadowBlur: 10 */
                    }
                },
                pointer: {           // 仪表盘指针。
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                detail: {
                    formatter:(value)=>{
                        return value+'%'
                    },
                    textStyle: {
                        color:'#F7F4F4',
                        fontSize:38
                    }
                },
                data: [{value: this.data}]
              }
          ]
        };
        this.myChart.setOption(option, true);
        this.option = option
 /*        let myChart = this.myChart
        setInterval(function () {
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            myChart&&myChart.setOption(option, true);
        },2000); */
    },
    changeValue(value){
            this.option.series[0].data[0].value = value
            this.myChart&&this.myChart.setOption(this.option, true);
    }
  },
};
</script>