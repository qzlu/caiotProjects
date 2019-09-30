<template>
	<div id="line_bar02"  style="height: 250px;"></div>	
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
			  	var dom = document.getElementById("line_bar02");
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
				            data : ['1#冷水机', '2#冷水机', '1#冷冻泵', '2#冷冻泵', '3#冷冻泵', '2#冷冻泵',],
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
				            name:'直接访问',
				            type:'bar',
				            barWidth: '30',
				            data:[900, 302, 200, 534, 890, 330]
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