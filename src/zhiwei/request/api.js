/**   
 * api接口统一管理
 * Login 登录
 * 详情请看接口文档
 */
import {post } from './http';
const Login = p => post('checklogin', p);
const HomePage = p => post('HomePage',p)
const Project = p => post('Project',p)
const Alarm = p => post('Alarm',p)
const System = p => post('System', p)
const Device = p => post('Device',p)
const Orders = p => post('Orders',p)
export{
    Login,
    HomePage,
    Project,
    Alarm,
    System,
    Device,
    Orders
}