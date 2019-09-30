<template>
	<div id="line_bar01"  style="height: 250px;"></div>	
</template>

<script>
	

 var echarts = require('echarts');
export default {
  data () {
    return {
      
    }
  },
  components: {
    
  },
  methods: {
  	
           line_bar_(){
			  	var dom = document.getElementById("line_bar01");
				var myChart = echarts.init(dom);
				var app = {};
				var option = null;
				app.title = '坐标轴刻度与标签对齐';
				
				option = {
				    color: ['#3398DB'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : ['1#配电房', '2#配电房', '1#水泵房', '中央空调机房', '电梯机房'],
				            axisTick: {
				                alignWithLabel: true
				            },
				            axisLine:{ //y轴色
								   lineStyle:{
								   color:'#d5d5d5',
								    width:1,
								   }
								  }
				        },
				        
				    ],
				    yAxis : [
				        {
				            type : 'value',
				             splitLine:{show: false},//去除网格线
				             axisLine:{ //y轴色
								   lineStyle:{
								   color:'#d5d5d5',
								    width:1,
								   }
								  }
				        }
				    ],
				    series : [
				        {
				            name:'数据访问',
				            type:'bar',
				            barWidth: '30',
				            data:[900, 302, 200, 534, 890]
				        }
				    ]
				};
				;
				if (option && typeof option === "object") {
				    myChart.setOption(option, true);
				}
			  },
			  	
  	
  	
  	
  },
  mounted:function(){
   this.line_bar_()
  
  },
  computed: {
    
  }
}	
	
</script>

<style scoped>

</style>