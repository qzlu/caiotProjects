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
const project = (p,showError) => post('Project', p, showError)
const system = p => post('System', p)
const Alarm = p => post('Alarm', p)
const Inspection = p => post('Inspection', p)
const Report = p => post('Report',p)
const FileUpLoad = p => post('FileUpLoad', p)
const Orders = p => post('Orders', p)
const MeterReading = p => post('MeterReading', p)
const Patrol = p => post('Patrol', p)
const Monitor = p => post('Monitor',p)
const Maintenance = p => post('Maintenance',p)
const Supplies = p => post('Supplies',p)
const ReportMatter = p => post('ReportMatter', p)
const Device = p => post('Device',p)
const HandlingEvents = p => post('HandlingEvents',p)
const FileUploadContext = p => post('FileUploadContext', p)
const Energy = p => post('Energy', p)
const ProjectTrend = p => post('ProjectTrend', p)
const Control = p => post('Control',p)
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