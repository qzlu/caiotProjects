/**   
 * api接口统一管理
 * Login 登录
 * 详情请看接口文档
 */
import {post } from './http';
const Login = p => post('/api/checklogin', {
    controller:'',
    requestMapping:'checklogin',
    operaterUserId:'maria',
    paramJSON:p
}); //登录接口
const baseUrl = '/api/user-manage-service/'
const Post = (mapping,p) => post(baseUrl,{
    controller:'',
    requestMapping:mapping,
    operaterUserId:'maria',
    paramJSON:{
        FTokenID:sessionStorage.getItem('FToken')||'1C49B3DE-C244-4D91-B1E3-10ABFE56EA56',
        ...p
    }
})
export{
    Login,
    Post
}