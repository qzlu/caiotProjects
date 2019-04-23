import { Message } from 'element-ui';
import router from '@/xiaofang/router.js';
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
          localStorage.removeItem('FToken')
          setTimeout(function(){
               router.push('/login') //跳至登录页面
          },1000)
          break;
        case 105:
          Message(message);
          break;
        case 106:
          Message('上传文件保存失败');
          break;
        case 107:
        Message('该账号已在别处登录');
        localStorage.removeItem('FToken')
        setTimeout(function(){
             router.push('/login') //跳至登录页面
        },1000)
        break;  
      
    }



    
   
}