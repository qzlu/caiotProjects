import Vue from 'vue'
import Router from 'vue-router'
/*----------*/
import agreement from '@/caiot/views/agreement' //安卓页面
let routers_item = [
	{
		path: '/login',
		name: 'login',
		component: () => import("@/caiot/views/login/login"),
		meta: {
			title: '千仞云平台'
		}
	},
	{
		path: '/agreement', //给安卓用的页面，不是pc项目
		name: 'agreement',
		component: agreement,
		meta: {
			title: '千仞云平台'
		}
	},
	{
		path: '',
		name: 'home',
		component: () => import('@/caiot/views/home'),
		redirect: '/ProjectBrowse',//子路由设置默认页
		children: [
			{
				path: 'ProjectBrowse', //项目概览
				name: 'ProjectBrowse',
				component: () => import('@/caiot/views/ProjectOverview/index.vue'),
				redirect: '/ProjectBrowse/comprehensive',
				children:[
					{
						path: 'comprehensive',
						name: 'Comprehensive', //综合态势
						component: () => import('@/caiot/views/ProjectOverview/comprehensive.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'deviceControl',
						name: 'deviceControl', //设备管控
						component: () => import('@/caiot/views/ProjectOverview/deviceControl.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					}
				]
			},
			{
				path: 'monitoring',
				name: 'monitoring',
				component: () => import('@/caiot/views/layout.vue'),
				redirect: '/monitoring/systemBrowse',//子路由设置默认页
				children: [
					{
						path: '/product',
						name: 'product',
						component: () => import('@/caiot/views/monitoring/product'),
						redirect: '/monitoring/systemBrowse',//子路由设置默认页
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'systemBrowse',
						name: 'SystemBrowse', //系统态势
						component: () => import('@/caiot/views/ProjectOverview/systemBrowse.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'areaBrowse',
						name: 'AreaBrowse', //区域态势
						component: () => import('@/caiot/views/ProjectOverview/areaBrowse.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'detail_info/:id/:SingleType', //详情页
						name: 'detail_info',
						component: () => import('@/caiot/views/monitoring/detail_info'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'detail_info_list/:id/:PossionID/:getalldata/',//详情页-详细列表
						name: 'detail_info_list',
						component: () => import('@/caiot/views/monitoring/detail_info_List.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					/*-------实时监测-子菜单----*/
					{
						path: 'searchdata', //实时监测-数据查询
						name: 'searchdata',
						component: () => import('@/caiot/views/monitoring/searchdata.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'KeyEquipment', //实时监测-重点监测
						name: 'KeyEquipment',
						component: () => import('@/caiot/views/monitoring/KeyEquipment.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					/*-------实时监测-子菜单----*/


				]

			},
			{
				path: 'foreshow',//预告警管理
				name: 'foreshow',
				component: () => import('@/caiot/views/layout'),
				/* redirect: '/foreshow',//子路由设置默认页 */
				children: [
					/*{ path: '/', //实时告警
					  name: 'test',
					  component: test,
					  meta: {
					    title: '千仞云平台',
					    requireAuth: true,  
				      }
					},*/

					{
						path: '/', //实时告警
						name: 'now_count',
						component: () => import('@/caiot/views/foreshow/now_count'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'history_count', //历史警统
						name: 'history_count',
						component: () => import('@/caiot/views/foreshow/history_count'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'foreshow_count', //预告警统计
						name: 'foreshow_count',
						component: () => import('@/caiot/views/foreshow/count'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'AlarmConfig', //告警配置
						name: 'AlarmConfig',
						component: () => import('@/caiot/views/alarmManagement/alarmConfig.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
				]


			},
			{
				path: 'DeviceManagement',//设备管理
				name: 'DeviceManagement',
				component: () => import('@/caiot/views/layout.vue'),
				/* redirect: '/DeviceManagement/',//子路由设置默认页 */
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children: [
					{
						path: '/',   //设备台账
						name: 'EquipmentDeskAccount',
						component: () => import('@/caiot/views/DeviceManagement/EquipmentDeskAccount.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'DeviceInfo/:deviceID',   //设备详情
						name: 'DeviceInfo',
						component: () => import('@/caiot/views/DeviceManagement/deviceInfo.vue'),
						/* redirect: 'DeviceInfo/:deviceID', */
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'EquipmentStatistics2',//设备统计(日常统计子菜单)
						name: 'EquipmentStatistics2',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
				]
			},
			{
				path: 'UniversalConfigPage',   //通用配置页面,所有配置的页面，都跳转在这个页面
				name: 'UniversalConfigPage',
				component: () => import('@/caiot/views/commonPage/index'),
				/* redirect: '/ConfigPage_list/:guid',//子路由设置默认页 */
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children: [
					{
						path: '/ConfigPage_list/:guid',
						name: 'ConfigPage_list',
						component: () => import('@/caiot/views/commonPage/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
				]
			},
			{
				path: 'energy',//能源警管理
				name: 'energy',
				component: () => import('@/caiot/views/layout'),
				/* redirect: '/energy',//子路由设置默认页 */
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children: [
					{
						path: '/',
						name: 'energy_list',
						component: () => import('@/caiot/views/energy/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},


					{
						path: 'CalculationSettings',//计算设置
						name: 'CalculationSettings',
						component: () => import('@/caiot/views/energy/energyConfig.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'EnergyPlan',//"能源计划"
						name: 'EnergyPlan',
						component: () => import('@/caiot/views/energy/energyPlan.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'EnergyStatistics',//能源统计"
						name: 'EnergyStatistics',
						component: () => import('@/caiot/views/energy/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					}


				]


			},
			{
				path: 'TaskManagement',//任务管理
				name: 'TaskManagement',
				component: () => import('@/caiot/views/layout'),
				/* redirect: '/TaskManagement/InspectionRecords',//子路由设置默认页 */
				meta: {
					title: '千仞云平台',
					requireAuth: true, // 判断该路由是否需要登录权限
				},
				children: [

					/* { path: '/',
						 name: 'FixManagement',// 维修管理
						 component: FixManagement,
						 meta: {
							 title: '千仞云平台',
							 requireAuth: true, 
						  },
					 },*/

					{
						path: '/',
						name: 'FixRecords',// 维修管理--维修记录第一个子菜单
						component: () => import('@/caiot/views/TaskManagement/FixRecords.vue'), //默认为第一个菜单 
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionStandard',
						name: 'InspectionStandard', // 巡检管理-巡检标准
						component: () => import('@/caiot/views/TaskManagement/InspectionStandard.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'Worklist',
						name: 'Worklist',
						component: () => import('@/caiot/views/TaskManagement/workList.vue'),// 工单管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionRoad',
						name: 'InspectionRoad',
						component: () => import('@/caiot/views/TaskManagement/InspectionRoad.vue'), //巡检路线
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionItem',
						name: 'InspectionItem',
						component: () => import('@/caiot/views/TaskManagement/InspectionItem.vue'), //巡检点管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionRecords',
						name: 'InspectionRecords', // 巡检管理-巡检记录
						component: () => import('@/caiot/views/TaskManagement/InspectionRecords.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionPlan',
						name: 'InspectionPlan', // 巡检管理-巡检计划
						component: () => import('@/caiot/views/TaskManagement/InspectionPlan.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},

					{
						path: 'MaintenanceRecords',
						name: 'MaintenanceRecords',// 保养管理-保养记录
						component: () => import('@/caiot/views/TaskManagement/Maintenance/MaintenanceRecords.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},

					{
						path: 'MaintenancePlan',
						name: 'MaintenancePlan',// 保养管理-保养计划
						component: () => import('@/caiot/views/TaskManagement/Maintenance/MaintenancePlan.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'MaintenanceStandard',
						name: 'MaintenanceStandard',// 保养管理-保养标准
						component: () => import('@/caiot/views/TaskManagement/Maintenance/MaintenanceStandard.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'Supplies',
						name: 'Supplies',// 耗材库
						component: () => import('@/caiot/views/TaskManagement/Supplies.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'MeterReadingPoint',
						name: 'MeterReadingPoint',
						component: () => import('@/caiot/views/TaskManagement/MeterReading/MeterReadingPoint.vue'), //抄表点管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'MeterReadingLine',
						name: 'MeterReadingLine',
						component: () => import('@/caiot/views/TaskManagement/MeterReading/MeterReadingLine.vue'), //抄表路线管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'MeterReadingPlan',
						name: 'MeterReadingPlan',
						component: () => import('@/caiot/views/TaskManagement/MeterReading/MeterReadingPlan.vue'), //抄表计划管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}

					},
					{
						path: 'MeterReadingRecords',
						name: 'MeterReadingRecords',// 抄表管理-抄表记录
						component: () => import('@/caiot/views/TaskManagement/MeterReading/MeterReadingRecords.vue'), //抄表计划管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'PatrolPoint',
						name: 'PatrolPoint',
						component: () => import('@/caiot/views/TaskManagement/Patrol/PatrolPoint.vue'), //巡更点管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'PatrolLine',
						name: 'PatrolLine',
						component: () => import('@/caiot/views/TaskManagement/Patrol/PatrolLine.vue'), //巡更路线管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'UPatrolPlan',
						name: 'UPatrolPlan',
						component: () => import('@/caiot/views/TaskManagement/Patrol/PatrolPlan.vue'), //巡更计划管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'PatrolPlanRecord',
						name: 'PatrolPlanRecord',
						component: () => import('@/caiot/views/TaskManagement/Patrol/PatrolRecord.vue'), //巡更记录管理
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'QueryPatrolPlanRecord',
						name: 'QueryPatrolPlanRecord',
						component: () => import('@/caiot/views/TaskManagement/Patrol/QueryPatrolPlanRecord.vue') //巡更查询
					},
					{
						path: 'MatterRecord',
						name: 'MatterRecord',
						component: () => import('@/caiot/views/TaskManagement/MatterRecord.vue'), //报事
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'AlarmRecord',
						name: 'AlarmRecord',
						component: () => import('@/caiot/views/TaskManagement/AlarmRecord.vue'), //告警记录
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					}
				]


			},




			{
				path: 'Count',//报表统计
				name: 'Count',
				component: () => import('@/caiot/views/energy'),
				redirect: '/Count',
				children: [
					{
						path: '/',
						name: '',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'DailyStatistics',//日常统计
						name: 'DailyStatistics',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'AlarmStatistics2',//告警统计(日常统计子菜单)
						name: 'AlarmStatistics2',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'EnergyStatistics2',//能源统计(日常统计子菜单)
						name: 'EnergyStatistics2',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					},
					{
						path: 'PersonalReports', //个人报表
						name: 'PersonalReports',
						component: () => import('@/caiot/views/Count/list'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						}
					}



				]

			},



		]
	},
	{
		path: '/manage',
		component: () => import('@/caiot/views/manage/layout/index.vue'),
		redirect: '/manage/user',
		children:[
			{
				path: 'user',
				name: 'UserManagement', // 用户管理
				component: () => import('@/caiot/views/SystemManagement/user'),
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
			},
			{
				path: 'role',
				name: 'role',//角色管理
				component: () => import('@/caiot/views/SystemManagement/role'),
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
			},
			{
				path: 'SystemLog', //系统管理- 操作日志
				name: 'SystemLog',
				component: () => import('@/caiot/views/SystemManagement/systemLog.vue'),
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
			},
			{
				path: 'projectManagement',//项目管理
				name: 'projectManagement',
				component: () => import('@/caiot/views/common.vue'),
				redirect: '/manage/projectManagement',//子路由设置默认页
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children: [
					{
						path: 'ProjectConfig',
						name: 'ProjectConfig', //工程管理 -项目流程
						component: () => import('@/caiot/views/SystemManagement/projectConfig.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					}, 
				]
			},
			{
				path:'projectConfig',
				name:'projectConfig',
				component:() => import('@/caiot/views/common.vue'),
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children:[
					{
						path: 'GateWay',
						name: 'GateWay', //工程管理 -网关信息
						component: () => import('@/caiot/views/SystemManagement/gatewayInfo.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'Meter',
						name: 'Meter', //工程管理 -仪表信息
						component: () => import('@/caiot/views/SystemManagement/meterInfo.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'Bluetooth', //系统管理- 蓝牙信息
						name: 'Bluetooth',
						component: () => import('@/caiot/views/SystemManagement/bluetooth.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'AreaInfo',
						name: 'AreaInfo', //项目管理 -区域信息
						component: () => import('@/caiot/views/SystemManagement/areaInfo.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'Device',
						name: 'Device', //工程管理 -物联设备
						component: () => import('@/caiot/views/SystemManagement/iotDevice.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'DeviceMeter',
						name: 'DeviceMeter', //工程管理 -设备仪表
						component: () => import('@/caiot/views/SystemManagement/deviceMeter.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'DeviceMaping',
						name: 'DeviceMaping', //工程管理 -设备映射
						component: () => import('@/caiot/views/SystemManagement/deviceMaping.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'AreaMaping',
						name: 'AreaMaping', //工程管理 -区域映射
						component: () => import('@/caiot/views/SystemManagement/areaMaping.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'SignInfo', //系统管理- 工单配置（签到信息）
						name: 'SignInfo',
						component: () => import('@/caiot/views/SystemManagement/signInfo.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
				]
			},
			{
				path: 'SystemManagement',//标准配置
				name: 'SystemManagement',
				component: () => import('@/caiot/views/common.vue'),
				redirect: '/manage/SystemManagement/',
				meta: {
					title: '千仞云平台',
					requireAuth: true,
				},
				children: [

					{
						path: 'ConfigurationManagement', //配置管理
						name: 'ConfigurationManagement',
						component: () => import('@/caiot/views/SystemManagement/ConfigurationManagement'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'Block',
						name: 'Block', //标准配置 -集团信息
						component: () => import('@/caiot/views/SystemManagement/blockInfo.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'SystemType', //标准配置 - 系统分类
						name: 'SystemType',
						component: () => import('@/caiot/views/SystemManagement/systemType.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'DeviceType', //标准配置 - 设备分类
						name: 'DeviceType',
						component: () => import('@/caiot/views/SystemManagement/deviceType.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'ProjectInfo',
						name: 'ProjectInfo', //项目管理 -项目信息
						component: () => import('@/caiot/views/SystemManagement/projectManagement.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},

					},
					{
						path: 'EnergyType', //标准配置 - 能源类型
						name: 'EnergyType',
						component: () => import('@/caiot/views/SystemManagement/energyType.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'DataItem', //标准配置 - 数据标识
						name: 'DataItem',
						component: () => import('@/caiot/views/SystemManagement/dataItem.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'MeterType', //标准配置 - 仪表类型
						name: 'MeterType',
						component: () => import('@/caiot/views/SystemManagement/meterType.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'MeterModel', //标准配置 - 仪表型号
						name: 'MeterModel',
						component: () => import('@/caiot/views/SystemManagement/meterModel.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'MeterProto', //标准配置 - 仪表协议
						name: 'MeterProto',
						component: () => import('@/caiot/views/SystemManagement/meterProto.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'Protocol', //标准配置 - 协议解析
						name: 'Protocol',
						component: () => import('@/caiot/views/SystemManagement/protocol.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'AlarmType', //标准配置 - 告警类型
						name: 'AlarmType',
						component: () => import('@/caiot/views/SystemManagement/alarmType.vue'),
						meta: {
							title: '千仞云平台',
							requireAuth: true,
						},
					},
					{
						path: 'InspectionDeviceTypeDataItem', //标准配置（巡检标准）
						name: 'InspectionDeviceTypeDataItem',
						component: () => import('@/caiot/views/TaskManagement/InspectionStandard.vue')
					},
					{
						path: 'BasisMaintenanceStandards', //标准配置（保养标准）
						name: 'BasisMaintenanceStandards',
						component: () => import('@/caiot/views/TaskManagement/Maintenance/MaintenanceStandard.vue')
					},
				]


			},
/* 			{
				path: '*',
				component: () => import('../views/404.vue')
			}, */
		]
	},
/* 	{
		path: '*',
		meta: { requiresAuth: false },
		component: () => import('../views/404.vue')
	}, */

]

/*for(let k=0;k<router_children.length;k++){
	routers_item[2].children.push(router_children[k])
}

console.log(routers_item)*/

Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: routers_item
})
