//配置axios
import axios from 'axios';
import {messageErr} from '@/plugins/statusCode.js'
import router from '../router'
import { Loading } from 'element-ui';
// 环境的切换
if (process.env.NODE_ENV == 'development') {    
    axios.defaults.baseURL = 'http://47.106.64.130:8888/DigitalAPI';
} 
else if (process.env.NODE_ENV == 'debug') {    
    axios.defaults.baseURL = 'http://www.caszyj.com/DigitalAPI/';
} 
else if (process.env.NODE_ENV == 'production') {    
    axios.defaults.baseURL = '/DigitalAPI/';
}
//设置请求超时时间
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.Result===200||response.data.Result===201){            
        return Promise.resolve(response);        
    } else {  
        return Promise.reject(response);        
    }    
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
        })    
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params,load = false) {
    return new Promise((resolve, reject) => {
        let loadingInstance
        if(load){
            loadingInstance = Loading.service({
                background: 'rgba(0, 0, 0, 0.7)'
            })
        }
        let obj = {
            FTokenID:sessionStorage.getItem('FToken'),
            ProjectID:sessionStorage.getItem('projectID')||58,
            FVersion:"1.0.0",		
        }
        axios.post(url,Object.assign(obj,params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            messageErr(err.data?err.data.Result:100,err.data?err.data.Message:err,router)
            reject(err.data?err.data:err)
        })
        .finally(() => {
            if(load){
                setTimeout(() => {
                    loadingInstance.close()
                },200)
            }
        })
    });
}

