/**   
 * api接口统一管理
 * login 登录
 * Inspection 巡检管理
 * MeterReading 抄表管理
 * Patrol 巡更管理
 * 详情请看接口文档
 */
import { get, post } from './http';
const login = p => post('Check', p);
const project = (p,showError,load) => post('Project', p, showError,load)
const system = (p,load) => post('System', p,undefined,load)
const Alarm = (p,load) => post('Alarm', p,undefined,load)
const Inspection = (p,load) => post('Inspection', p,undefined,load)
const Report = (p,load) => post('Report',p,undefined,load)
const FileUpLoad = (p,load) => post('FileUpLoad', p,undefined,load)
const Orders = (p,load) => post('Orders', p,undefined,load)
const MeterReading = (p,load) => post('MeterReading', p,undefined,load)
const Patrol = (p,load) => post('Patrol', p,undefined,load)
const Monitor = (p,load) => post('Monitor',p,undefined,load)
const Maintenance = (p,load) => post('Maintenance',p,undefined,load)
const Supplies = (p,load) => post('Supplies',p,undefined,load)
const ReportMatter = (p,load) => post('ReportMatter', p,undefined,load)
const Device = (p,load) => post('Device',p,undefined,load)
const HandlingEvents = (p,load) => post('HandlingEvents',p,undefined,load)
const FileUploadContext = (p,load) => post('FileUploadContext', p,undefined,load)
const Energy = (p,load) => post('Energy', p,undefined,load)
const ProjectTrend = (p,load) => post('ProjectTrend', p,undefined,load)
const Control = (p,load) => post('Control',p,undefined,load)
export{
    login,
    project,
    system,
    Alarm,
    Inspection,
    Report,
    FileUpLoad,
    Orders,
    MeterReading,
    Patrol,
    Monitor,
    Maintenance,
    Supplies,
    ReportMatter,
    Device,
    HandlingEvents,
    FileUploadContext,
    Energy,
    ProjectTrend,
    Control
}