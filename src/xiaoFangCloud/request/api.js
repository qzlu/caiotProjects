/**   
 * api接口统一管理
 * Login 登录
 * 详情请看接口文档
 */
import {post } from './http';
const Login = p => post('Check', p);
const HomePage = p => post('HomePage',p)
const Project = (p,load = false) => post('Project',p,load)
const Alarm = (p,load = false) => post('Alarm',p,load)
const System = (p,load = false) => post('System', p,load)
const Device = (p,load = false) => post('Device',p,load)
const Orders = (p,load = false) => post('Orders',p,load)
export{
    Login,
    HomePage,
    Project,
    Alarm,
    System,
    Device,
    Orders
}