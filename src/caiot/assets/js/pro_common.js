 import { Message } from 'element-ui';
 import router from '../../router'
 const colors = {
	1:"#1bd1a1",
	2:"#73777a",
	3:"#0091fe",
	4:"#fef500",
	5:"#9c1428"
}  
 export function CurentTime(){
			        var now = new Date();
			        /*显示星期*/
			        let dates=now.getDay();
			        let arr=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
			        let currs=arr[dates];
			        /*显示时间*/
			        var year = now.getFullYear();       //年
			        var month = now.getMonth() + 1;     //月
			        var day = now.getDate();            //日
			       
			        var hh = now.getHours();            //时
			        var mm = now.getMinutes();          //分
			       var seconds = now.getSeconds() //秒
			        var clock = year + "-";
			       
			        if(month < 10)
			            clock += "0";
			       
			        clock += month + "-";
			       
			        if(day < 10)
			            clock += "0";
			           
			        clock += day + " ";
			       
			        if(hh < 10)
			            clock += "0";
			           
			        clock += hh + ":";
			        if (mm < 10)clock += '0';
			        clock += mm+":"; 
			        
			         if (seconds < 10) clock += '0'; 
			         clock += seconds; 
			        
			        
			        return {clock,currs}
			       // return(clock); 
 } 

   
			


 export function resetColor(x){
 /*（1-绿色 2-灰色3-蓝色 4-黄色 5-红色）*/	
	 let c='';
		switch(x){
		case 1:
		  c="#1bd1a1";
		  break;
		case 2:
		 c="#73777a";
		  break;
		  case 3:
		 c="#0091fe";
		  break;
		  case 4:
		 c="#fef500";
		  break;
		  case 5:
		 c="#9c1428";
		  break;
		
		}
	
   return c
}
 
 export function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
		}
/**
 * 小于10在前面补0
 * @param {Number} num 
 */
export function formatNumber(num){
	return num<10?'0'+num:num
}
/**
 * 格式化时间
 * @param {Date} val 
 */
export function getFormatTime(val){
	let time = new Date(val)
	return time.getFullYear() + '-' + formatNumber(time.getMonth()+1) + '-' + formatNumber(time.getDate()) + ' ' + 
	formatNumber(time.getHours()) + ':' + formatNumber(time.getMinutes()) + ':' + formatNumber(time.getSeconds())
}
export function chart_utis(o){
	let name = []
	o.forEach(item => {
		name.push(...item.DataValue)
	})
	let color_change = [...new Set(name.map(item => item.SColor))].map(item => colors[item])
	let arr =[...new Set(name.map(item => item.STargetTitle))]
	let DeviceType = o.map(item => item.DeviceType)
	let series_arr = arr.map(item => {
		return{
			name:item,
			type:'bar',
			stack:'总量',
			barWidth: 45,
			data:[]
		}
	})
	series_arr.forEach(item => {
		o.forEach(obj => {
			let data = obj.DataValue.find(re => re.STargetTitle === item.name)
			data ? item.data.push(data.STargetValue):item.data.push(0)
		})
	})
	return {DeviceType,arr,series_arr,color_change}
	
}

 export function ChangeRouterVal(o) {  //匹配原来写好的路由情况
 
 	var arr_new=o
 	var router01=["monitoring","foreshow","DeviceManagement","energy","TaskManagement","Count","SystemManagement"] //一级路由

 	  for(let sh of arr_new){
	 	  if(sh.FFunctionURLAddress=="PredictivePoliceManagement"){ //匹配开发之前定义 好的 预告警管理
	 			sh.FFunctionURLAddress="foreshow"
	 			  if(sh.FChildMenu.length){
	 			  	 for(let pp of sh.FChildMenu){
	 			  	 	if(pp.FFunctionURLAddress=="RealTimeAlarms"){pp.FFunctionURLAddress="now_count"}   //匹配实时告警
	 			  	 	if(pp.FFunctionURLAddress=="HistoricalAlarm"){pp.FFunctionURLAddress="history_count"}//匹配历史告警
	 			  	 	if(pp.FFunctionURLAddress=="AlarmStatistics"){pp.FFunctionURLAddress="foreshow_count"}//匹配历史统计
	 			  	 }	
	 			  }  
	 			}
	 	  if(sh.FFunctionURLAddress=="EnergyManagement"){  //匹配能源管理
	 	  	sh.FFunctionURLAddress="energy"
	 	   }
	 	     
	 	   if(sh.FFunctionURLAddress=="ReportStatistics"){  //报表总计
	 	  	sh.FFunctionURLAddress="Count"
	 	   }
	 	  
 	  
 	  }
    // console.log("11111----->>>")
    // console.log(arr_new)
     
 	 return arr_new
  

}
 
 
 
 export function messageErr(x,message = ''){
 				 	switch(x)	{
 				 		
					case 100:
					  Message('异常错误');
					  break;
					case 101:
					  Message('验证码错误');
					  break;
					case 102:
					  Message('参数错误');
					  break;
                 	case 103:
					  Message('用户名或密码错误');
					  break;
					case 104:
					  Message('令牌错误或超时');
					  localStorage.setItem("Token","");
					  localStorage.setItem("iuserName","");
					  localStorage.setItem("projectid","");
					  localStorage.setItem("projectname","");
					  localStorage.setItem("refresh",1);//用户退出时，刷新登录页面，避免项目定时器ajax继续执行
					  setTimeout(function(){
					  	 router.push('/') //跳至登录页面
					  },1000)
					 
					  break;
					case 105:
					  Message(message);
					  break;
					case 106:
					  Message('上传文件保存失败');
					  break;  
					
					}
 				 
 				

 				 	
					 
 }
