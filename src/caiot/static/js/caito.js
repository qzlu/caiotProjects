 import { Message } from 'element-ui';
 import router from '../../router'

export default{
  install (Vue, options) {
    Vue.prototype.messageShowErr = function () {
    	
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
					  router.push('/login') //跳至登录页面
					  break;
					case 105:
					  Message('添加/修改/删除数据错误');
					  break;
					case 106:
					  Message('上传文件保存失败');
					  break;  
					
					}
 
    }
    
     Vue.prototype.itools = function (x) {
			let tools=function(x){
				let arr=x.split(",");
				let n="";				
				arr.map((i)=>{					
					if(i=="1"){n+="增加,";}
					if(i=="2"){n+="删除,";}
					if(i=="3"){n+="修改,";}
					if(i=="4"){n+="查询,";}
					if(i=="5"){n+="导出,";}
				})
				return n 
			}
     }
    
     Vue.prototype.bbb = function () {
     	return "bbb--->>>"
     }
    
    
  }

}