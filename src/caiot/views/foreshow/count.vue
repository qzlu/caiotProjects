<template>
	<section class="icontainer">
		<!--告警统计-->
		<section class="det_top">
			
			  <div class="det_left">
			  	<div style=" position: absolute;top: 114px; right: 9px; width: 85px; height: 50px; ">
			  		<p v-for="(item,key) in table_data01.TargetDetail" style="text-align: left; font-size: 18px; line-height: 28px;">{{item.STargetValue}}</p>
			  		
			  	</div>
			  	<p class="dtitle">告警统计</p>
			  	<div  class="dmes" style="text-align: right;">
			  		<ul>
  		 	 	 	 	<li :class="{en_active:active==0}" @click="ech_date(0)">日</li>
  		 	 	 	 	<!--<li :class="{en_active:active==1}" @click="ech_date(1)">周</li>-->
  		 	 	 	 	
  		 	 	 	 	<li :class="{en_active:active==2}" @click="ech_date(2)">月</li>
  		 	 	 	 	<li :class="{en_active:active==3}" @click="ech_date(3)">年</li>
  		 	 	 	 </ul>
  		 	 	 	 
  		 	 	 	 
  		 	 	 	  <div class="e_set_time">
  		 	 	 	 	<p class="l"><img src="../../static/image/energy/button_1.png" @click="next_day(active,0)"></p>
  		 	 	 	 	<!--<div class="en_tpn">2018-10-15</div>-->
  		 	 	 	    	<div class="en_tpn"> 
  		 	 	 	    		<el-date-picker
								      v-model="value1"
								      :type="ityle"
								      value-format="yyyy-MM-dd"
								      @change="Change_time()"
								      placeholder="选择日期">
								    </el-date-picker>
  		 	 	 	    	</div>
  		 	 	 	 	<p class="l"><img src="../../static/image/energy/button_2.png" @click="next_day(active,1)"></p>
  		 	 	 	 </div>
  		 	 	 	 
			  		
			  	</div>
			  	<div  class="dt_kgs"><!----></div>
			  	<div class="de_arc_li" id="utb_01">
			  	
			  		
			  	</div>
			  		<div class="ge_pelin"><p><!--设备总数-->{{table_data01.TargetTitle}}</p><p style="font-size: 20px;">{{table_data01.TargetValue}}</p></div>
			  </div>
			  
			  <div class="det_rightItem">
			  	 <div class="det_titles">分类统计</div>
			  	 <section id="count_01" style="width: 900px; height: 185px; float: left; color: #fff; margin-top: 25px;" ></section>
			  	
			  </div>
		</section>
		
		
		<div class="con_bigAea">
			<section class="con_item01">
				<div class="con_a">
					  <div class="entitle_">
					   <p>设备类型统计</p>
					  </div>
				</div>
				
				<div class="con_b" id="count_02" >
					
				
				</div>
				
			</section>
			<section class="con_item01">
				<div class="con_a">
					  <div class="entitle_">
					   <p>告警排名Top10</p>
					  </div>
				</div>
				<div class="con_b" id="count_03" >
					<!--组件-->
					
					
				</div>
			</section>
			
			
		</div>
		
	</section>

</template>
<style>
 .icontainer .el-picker-panel{ z-index: 999;}
  .icontainer .el-input__icon{ height: 20px;}
  .icontainer .dmes   ul{ width: 102px; height: 25px; float: left; border:1px solid rgba(143,156,191,1);border-radius:5px}  
  .icontainer .dmes   ul li{ text-align: center; cursor: pointer; float: left; width: 34px; height: 25px; line-height: 25px; border-right:1px solid rgba(143,156,191,1) ;box-sizing:border-box;
-moz-box-sizing:border-box; /* Firefox */
-webkit-box-sizing:border-box; /* Safari */}
.icontainer .dmes  ul li:nth-child(3){ border: none;}
.icontainer .dmes  ul li.en_active{ background: #0f7ae2;}
.icontainer .dmes  .e_set_time{ margin: 6px 0 0 20px; width: 130px; height: 20px; float: left;}  
.icontainer .dmes  .en_tpn { cursor: pointer; width: 108px; height: 20px; float: left; font-size: 14px; color: #F1F1F2; margin: -2px 5px 0 0;} 

.icontainer .dmes .e_set_time{ margin: 6px 0 0 20px; width: 130px; height: 20px; float: left;}  
.icontainer .dmes .en_tpn { cursor: pointer; width: 108px; height: 20px; float: left; font-size: 14px; color: #F1F1F2; margin: 0px 5px 0 0;} 
.icontainer	.el-input__suffix{right: -25px; display: none;}
.icontainer .el-date-editor.el-input, .el-date-editor.el-input__inner{ width: 100%; font-size:12px ;  }
.icontainer  .el-input--suffix .el-input__inner{padding-right:0 ;}
.icontainer .el-input__inner{ height: 20px; text-align: center; background:none; border: none; color: #fff;}
.icontainer .el-input__icon{line-height: 20px;}
</style>
<script>
	var week_start=0;
	var echarts = require('echarts');
	import * as comm from '../../assets/js/pro_common';

 export default {
 	   
      data() {
        return {
           value1: comm.getNowFormatDate(),//下拉初始化时间
	       d_tyle:"Day",//点击年月日,ajax传给后台的类型
	       ityle:"date",//点击年月日，右边时间下拉框类型
	       active:0,
	       titles:['今日','昨日'],
	       table_data01:'',//年月日按钮数据，左上1图
	       
	       table_data02:'',//曲线图右上1
	       table_data02_name:[],//组装分类名称[今日,昨日,平均值]
	       table_data02_value:[],//组装数组数据
	       table_data02_xAxis:'',//x标尺数组
	       
	       table_data03:'',//组件bar数据
	       table_data04:'',//组件bar数据
			
        }
        
      },
	created(){
	let _this=this;
	
        
	},
	methods: {
		
	Change_time(val){
  		//console.log(this.d_tyle)
  		//console.log(this.value1)
  		
  		if(this.d_tyle=="Year"){
  			this.getDatas(this.value1.split("-")[0],this.d_tyle)
  		}else if(this.d_tyle=="Month"){
  			var str=this.value1.split("-")[0]+"-"+this.value1.split("-")[1]
  	      	this.getDatas(str,this.d_tyle)
  		}else{
  			this.getDatas(this.value1,this.d_tyle)
  		}
  		
  		
  	},
     formatDate(date){   //处理返回当周week的日期   
        var year = date.getFullYear()+'-';
        var month = (date.getMonth()+1)+'-';
        var day = date.getDate()+'';
        return year+month+day;
      },
  	
  	 getPreMonth(date) {//上一月
            var arr = date.split('-');
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
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 ;
            
            this.value1=t2
           
            //return t2;
       },
        
        /**
         * 获取下一个月@date 格式为yyyy-mm-dd的日期，如：2014-01-25

         */        
     getNextMonth(date) {//获取下一个月
            var arr = date.split('-');
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
                month2 = '0' + month2;
            }
        
            var t2 = year2 + '-' + month2 ;
             this.value1=t2
           // return t2;
        },
  	
  	
  	ech_date(x){ //点击日期显示
  		week_start=0//初始化周
  		this.active=x
  		if(x==0){
  			
  			this.ityle="date",//日期显示类型
  			this.d_tyle="Day",//ajax传给后台的类型
  			this.titles=['今日','昨日'];
  			this.value1=comm.getNowFormatDate()
  			}
  		if(x==1){
  			this.ityle="date",
  			this.d_tyle="Week",//ajax传给后台的类型
  			this.titles=['今周','上周']
  			var now = new Date;
        var day = now.getDay ();
        var week = "7123456";
        var first = 0 - week.indexOf (day);
        var f = new Date;
        f.setDate (f.getDate () + first);
        var last = 6 - week.indexOf (day);
        var l = new Date;
        l.setDate (l.getDate () + last);
        
        var year = f.getFullYear()+'-';
        var month = (f.getMonth()+1)+'-';
        var day = f.getDate();
         this.value1=year+month+day;
 			
  			}
  		if(x==2){
  			this.ityle="month",
  			this.d_tyle="Month",//ajax传给后台的类型
  			this.titles=['今月','上月'];
  			var now_gh = new Date;
        var year = now_gh.getFullYear()+'-';
        var month = (now_gh.getMonth()+1);
        this.value1=year+month
  			}
  		if(x==3){
  			this.ityle="year",
  			this.d_tyle="Year",//ajax传给后台的类型
  			this.titles=['今年','去年']
  			var now_gvg = new Date;
        var year2 = now_gvg.getFullYear()+'-';
        var month2 = (now_gvg.getMonth()+1);
      
        this.value1=year2+month2
  			}
  		
  		
  		
  		
  		this.getDatas(this.value1,this.d_tyle)
  		
  	},
  	
  	
  	next_day(type,x){ //选择周日月年
  		let _this=this;
  		var curDate = new Date(this.value1); 	
  		if(type==0){ //type==0为日 			
		  		if(x==0){
		  			var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
		  			this.value1=preDate;
		  			//return preDate;
		  		}else{
		  			var nextDate = new Date(curDate.getTime() + 24*60*60*1000); //后一天
		  			this.value1=nextDate;
		  			//return nextDate;
		  		}
    }
  		
  	if(type==1){ //type==0为周
  		
  	   let _this=this
	
      var addDate= function(date,n){   
        date.setDate(date.getDate()+n);
        return date;
      };
      var setDate = function(date){      
        var week = date.getDay();
        date = addDate(date,week*-1);
        _this.currentFirstDate = new Date(date);
        _this.value1=_this.formatDate(_this.currentFirstDate)
      // console.log(_this.formatDate(_this.currentFirstDate))
              
      }; 
       if(week_start==0){
       	setDate(new Date());
       }    
      
        week_start=1
        
        if(x==0){
        	  setDate(addDate(_this.currentFirstDate,-7))
        }else{
        	 setDate(addDate(_this.currentFirstDate,7));
        }

  	}
  	
  	if(type==2){//点击按月份
  		var aaa="";
  		if(this.value1==""){
  			  aaa=comm.getNowFormatDate()
  		}else{
  			 aaa=this.value1
  		}
  		
  		if(x==0){
  		  this.getPreMonth(aaa)	
  		}else{
  			 this.getNextMonth(aaa)	
  		}
	
  	}
  	
  	if(type==3){//点击按年份
  		var bbb="";
  		if(this.value1==""){
  			var date=new Date;
        var year=date.getFullYear();
         			  
  		}else{
  			bbb=this.value1	
  		}
  		
  		if(x==0){
  			var arr_y = this.value1.split('-');
        var year_y = parseInt(arr_y[0])-1; //获取当前日期的年份
        var t2_y = year_y + '-'  ;
        this.value1=t2_y
  		}else{
  	  	var arr_y = this.value1.split('-');
        var year_y = parseInt(arr_y[0])+1; //获取当前日期的年份
        var t2_y = year_y + '-'  ;
        this.value1=t2_y
  		}
  				
  		
  	}
  	
  	
  		
  		this.getDatas(this.value1,this.d_tyle)
  		
  	},
  	
  	
  	getDatas(gettime,day){ 
  		console.log(gettime,day)
  		   let _this=this;
  		   _this.$axios.post('Alarm',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"QueryTotalSituationCount",
						        "FVersion":"1.0.0",
						        "FType":day,  //day默认为天，没有参数的情况默认为"Day"
                                "ProjectID":localStorage.getItem("projectid"),
						        "FDateTime":gettime
							}).then(function(jsons){
								 console.log(jsons.data.FObject)   
	 //jsons.data.FObject数据：1.Table：总能耗统计数据 ，2Table1：能耗曲线数据，3.Table2：分项能耗数据，4.Table3：重点能耗数据（根据FType为天、周、月、年返回对应值）
	                            
                 				
                 				 _this.table_data01=jsons.data.FObject.table[0]; //左上1
                 				 _this.table_data02=jsons.data.FObject.table1;   //右上1
                 				 _this.table_data03=jsons.data.FObject.table2;    //中间
                 				 _this.table_data04=jsons.data.FObject.table3;    //中间
								_this.Chart_01()     //圆形图    
								_this.Chart_02(jsons.data.FObject.table1,"count_01") //右上柱形图
								_this.Chart_02(jsons.data.FObject.table2,"count_02")//中间柱形图
								_this.Chart_03()     //最底下图    
								
							}).catch(function(err){
							
							});
  	},
		
		
	Chart_01(){ //左1上图
		
		let arr01=this.table_data01
		let arr_name=arr01.TargetDetail.map(x=>x.STargetTitle);  //取得名称['运行','停止','故障']
		let arr_val=arr01.TargetDetail.map(x=>{
			return {value:x.STargetValue,name:x.STargetTitle}   //取得数值{value:10, name:'运行',},
		});
		let arr_color=arr01.TargetDetail.map(x=>{
			return  comm.resetColor(x.SColor)                   //取得色彩['#1bd1a1','#73777a']
		});
		
		
			/*左一图*/
				var dom = document.getElementById("utb_01");
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				app.title = '环形图';
				var option = {
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c} ({d}%)"
					},
					legend: {
							orient: 'vertical',
							x: '169px',
							y:'center',
						//data:['运行','停止','故障'],
				    	data:arr_name,
							textStyle: { color: '#fff' },
							itemWidth: 10,
							itemHeight: 10,
							itemGap: 15,
					
					},
					series: [
							{
									name:'显示来源',
									type:'pie',
							    	center : ['25%', '48%'], //图形显示位置
									radius: ['50', '60'],
									label: {
											normal: {
													show: false,//文字显示在图中间位置
													position: 'center',				
											}
									},
		                            data:arr_val
									 /*data:[
											{value:10, name:'运行',},
											{value:30, name:'停止'},
											{value:60, name:'故障'},
									]*/
									
							}
					],
					color:arr_color,
					//color:['#1bd1a1','#73777a','#8f1c2d']
				
				};
				
			
				if (option && typeof option === "object") {
				    myChart.setOption(option, true);
				}
		
		
	},
		
	Chart_02(data,Elements){//右上图及中间柱形图
		
		
       let o= comm.chart_utis(data)//调用组装成数据
       
		var dom = document.getElementById(Elements);
		var myChart = echarts.init(dom);
		var app = {};
		var option = null;
		app.title = '堆叠条形图';//右一
		
		option = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    legend: {
		    	 textStyle: {
				    fontWeight: 'normal',              //标题颜色
				    color:'#fff' , 		
					},
		      //  data: ['运行', '停止','营运']
		      data:o.arr
		     
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		    	 type: 'category',
		    	  axisLine:{ //y轴色
					 lineStyle:{
					 color:'#fff',
					 width:1,
					}
				 },
		    	 data:o.DeviceType
		        // data: ["变压器", "进线柜", "馈线柜", "联络柜1","联络柜2","联络柜3" ]
		         
		    },
		    yAxis: {
		         type: 'value',
				 splitLine:{show: false},//去除网格线
				 minInterval: 1,
		         axisLine:{ //y轴色
					 lineStyle:{
					 color:'#fff',
					 width:1,
					}
				 },
		         
		    },
		     series:o.series_arr,
		     color:o.color_change
		   
		};;
		if (option && typeof option === "object") {
		    myChart.setOption(option, true);
		}
		
				
		
		
		
	},	
	Chart_03(){//最底下的柱形图
		
		  /*下图*/
		  let arrs=this.table_data04;
		  let arrs_name=arrs.map(x=>x.TargetTitle);
		  let arrs_value=arrs.map(x=>x.TargetValue);
		  let arrs_color=comm.resetColor(arrs.map(x=>x.SColor)[0]);
          
          var dom = document.getElementById("count_03");
				var myChart = echarts.init(dom);
				var app = {};
				var option = null;
				app.title = '坐标轴刻度与标签对齐';
				
				option = {
				    color: ['#3398DB'],
				    tooltip : {
						formatter: function(params, ticket, callback) {
        				    return  params.name + "：" + params.value;
        				}
/* 				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        } */
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
				            data : arrs_name,
				           // data : ['供配电', '给排水', '中央空调', '电梯', '门禁', '门禁'],
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
							minInterval: 1,
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
				            name:'值',
				            type:'bar',
				            barWidth: '30',
				            data:arrs_value,
				           // data:[900, 302, 200, 534, 890, 330]
				        }
				    ],
				     color:arrs_color
				    
				};
				;
				if (option && typeof option === "object") {
				    myChart.setOption(option, true);
				}
          
          
		
		
	},
	
		
				
	},		
	mounted:function(){  
		
		let _this=this;
	    let times=comm.getNowFormatDate()
	    this.getDatas(times,"day")
							
					
			
    
         
          
	          
					
				}
     
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
	margin: 0;
}

.icontainer .con_bigAea{  width: 1557px; height: 690px;background: url(../../static/image/indexdetail/content_fg_1.png);}
.icontainer .con_bigAea .con_item01{height: 347px; overflow: hidden;}
.icontainer .con_bigAea .con_item01 .con_a{ float: left; height: 150px; width: 123px; padding: 50px 0 0 50px; font-size: 18px;}
.icontainer .con_bigAea .con_item01 .con_b{height:219px; width: 1375px; float: left; margin: 55px 0 0 -28px;}

.icontainer .con_bigAea .con_item02{height: 347px; overflow: hidden;}


.det_top{
    height: 226px;
    position: relative;
}

.det_top .det_left  {
    position: relative;
    margin-top: -15px;
    width: 456px;
    height: 236px;
    float: left;
    background: url(../../static/image/energy/un_ger.png) no-repeat -2px 10px;
    
}
.det_top .det_left .dtitle{
    height: 20px;
    width: 130px;
   
   
    overflow: hidden;
    font-size: 16px;
    color: #F1F1F2;
    position: absolute;
    top:13px; left: 0;
}

.det_top .det_left .dmes  {
    height: 25px;
    font-size: 15px;
    padding: 30px 50px 20px 0; float: right;
}

.det_top .det_left .dt_kgs  {
    width: 92px;
    height: 188px;
    float: left;
    padding: 0 15px 0 20px;
}

.det_top .det_left .de_arc_li {
    width: 280px;
   /* margin-left: 25px;*/
    height: 148px;
    margin-top: -8px;
    float: left;
    background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat;
    z-index: 100;
}


 .det_left .ge_pelin {
    position: absolute;
    top: 117px;
    left: 148px;
    width: 100px;
}

 .det_left .uib_1{top: 125px;}  
.det_left .uib_2{top: 110px;}  
 .det_left .uib_3{top: 98px;} 
.det_left .de_two{top: 111px; right: -1px;}
 
 
 
 
.det_titles {
    width: 110px;
    height: 165px;
    padding: 25px 0px 0px 20px;
    float: left;
    font-size: 18px;
    color: rgb(241, 242, 242);
}

.det_top .det_rightItem{
    width: 1086px;
    height: 227px;
    margin: -5px 15px 0 0;
    background: url(../../static/image/indexdetail/bg_blue_2.png) no-repeat;
    float: right;
}
</style>
