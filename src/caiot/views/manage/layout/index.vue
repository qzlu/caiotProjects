<template>
    <el-container style="height:100%">
      <el-header height="85px">
        <div class="app-logo l">
          <router-link to="/">
            <img src="../../../static/image/index/logo-caiot.png" alt="">
          </router-link>
          <p class="r">
            千仞智服后台管理系统
          </p>
        </div>
        <operation></operation>
      </el-header>
      <el-container>
        <el-aside width="310px">
          <el-scrollbar>
            <el-menu unique-opened :default-active="$route.path"  router>
              <zw-nav :menus="menus">
              </zw-nav>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
import zwNav from './nav.vue'
import operation from '../../home/operation.vue';
export default {
    data(){
      return{
        menus:[
          {
            FGUID:1,
            FMenuLevle:1,
            FMenuName:'设备管理',
            FFunctionURLAddress:'/manage/DeviceManagement',
            icon:'icon-System',
            FChildMenu:[
              {
                FGUID:1-1,
                FMenuLevle:2,
                FMenuName:'设备台账',
                FFunctionURLAddress:'/manage/DeviceManagement/',
              },
              {
                FGUID:1-2,
                FMenuLevle:2,
                FMenuName:'物联设备',
                FFunctionURLAddress:'/manage/DeviceManagement/Device',
              },
              {
                FGUID:1-3,
                FMenuLevle:2,
                FMenuName:'设备统计',
                FFunctionURLAddress: '/manage/DeviceManagement/EquipmentStatistics2'
              }
            ]
          },
          {
            FGUID:2,
            FMenuLevle:1,
            FMenuName:'项目管理',
            FFunctionURLAddress:'/manage/projectManagement',
            icon:'el-icon-message',
            FChildMenu:[
              {
                FGUID:2-1,
                FMenuLevle:2,
                FMenuName:'项目信息',
                FFunctionURLAddress:'/manage/projectManagement/',
              },
              {
                FGUID:2-2,
                FMenuLevle:2,
                FMenuName:'区域信息',
                FFunctionURLAddress:'/manage/projectManagement/AreaInfo',
              },
              {
                FGUID:2-3,
                FMenuLevle:2,
                FMenuName:'巡检标准',
                FFunctionURLAddress:'/manage/projectManagement/InspectionDeviceTypeDataItem',
              },
              {
                FGUID:2-4,
                FMenuLevle:2,
                FMenuName:'保养标准',
                FFunctionURLAddress:'/manage/projectManagement/BasisMaintenanceStandards',
              },
              {
                FGUID:2-5,
                FMenuLevle:2,
                FMenuName:'工单配置',
                FFunctionURLAddress:'/manage/projectManagement/SignInfo',
              },
              {
                FGUID:2-6,
                FMenuLevle:2,
                FMenuName:'告警配置',
                FFunctionURLAddress:'/manage/projectManagement/AlarmConfig',
              },
              {
                FGUID:2-7,
                FMenuLevle:2,
                FMenuName:'用户管理',
                FFunctionURLAddress:'/manage/projectManagement/user',
              },
              {
                FGUID:2-8,
                FMenuLevle:2,
                FMenuName:'角色管理',
                FFunctionURLAddress:'/manage/projectManagement/role',
              },
              {
                FGUID:2-9,
                FMenuLevle:2,
                FMenuName:'操作日志',
                FFunctionURLAddress:'/manage/projectManagement/SystemLog',
              },
            ]
          },
          {
            FGUID:3,
            FMenuLevle:1,
            FMenuName:'标准配置',
            FFunctionURLAddress:'/manage/SystemManagement',
            icon:'el-icon-message',
            FChildMenu:[
              {
                FGUID:3-1,
                FMenuLevle:2,
                FMenuName:'集团信息',
                FFunctionURLAddress:'/manage/SystemManagement/Block',
              },
              {
                FGUID:3-2,
                FMenuLevle:2,
                FMenuName:'系统分类',
                FFunctionURLAddress:'/manage/SystemManagement/SystemType',
              },
/*               {
                FGUID:3-3,
                FMenuLevle:2,
                FMenuName:'项目信息',
                FFunctionURLAddress:'/manage/SystemManagement/ProjectInfo',
              }, */
              {
                FGUID:3-4,
                FMenuLevle:2,
                FMenuName:'设备分类',
                FFunctionURLAddress:'/manage/SystemManagement/DeviceType',
              },
              {
                FGUID:3-5,
                FMenuLevle:2,
                FMenuName:'告警类型',
                FFunctionURLAddress:'/manage/SystemManagement/AlarmType',
              },
              {
                FGUID:3-6,
                FMenuLevle:2,
                FMenuName:'能源类型',
                FFunctionURLAddress:'/manage/SystemManagement/EnergyType',
              },
              {
                FGUID:3-7,
                FMenuLevle:2,
                FMenuName:'数据标识',
                FFunctionURLAddress:'/manage/SystemManagement/DataItem',
              },
              {
                FGUID:3-8,
                FMenuLevle:2,
                FMenuName:'仪表类型',
                FFunctionURLAddress:'/manage/SystemManagement/MeterType',
              },
              {
                FGUID:3-9,
                FMenuLevle:2,
                FMenuName:'仪表型号',
                FFunctionURLAddress:'/manage/SystemManagement/MeterModel',
              },
              {
                FGUID:3-10,
                FMenuLevle:2,
                FMenuName:'仪表协议',
                FFunctionURLAddress:'/manage/SystemManagement/MeterProto',
              },
              {
                FGUID:3-11,
                FMenuLevle:2,
                FMenuName:'协议解析',
                FFunctionURLAddress:'/manage/SystemManagement/Protocol',
              },
              {
                FGUID:3-12,
                FMenuLevle:2,
                FMenuName:'配置管理',
                FFunctionURLAddress:'/manage/SystemManagement/ConfigurationManagement',
              },
              {
                FGUID:3-13,
                FMenuLevle:2,
                FMenuName:'项目流程',
                FFunctionURLAddress:'/manage/SystemManagement/ProjectConfig',
              },
              {
                FGUID:3-14,
                FMenuLevle:2,
                FMenuName:'网关信息',
                FFunctionURLAddress:'/manage/SystemManagement/GateWay',
              },
              {
                FGUID:3-15,
                FMenuLevle:2,
                FMenuName:'仪表信息',
                FFunctionURLAddress:'/manage/SystemManagement/Meter',
              },
              {
                FGUID:3-16,
                FMenuLevle:2,
                FMenuName:'蓝牙信息',
                FFunctionURLAddress:'/manage/SystemManagement/Bluetooth',
              },
              {
                FGUID:3-17,
                FMenuLevle:2,
                FMenuName:'设备仪表',
                FFunctionURLAddress:'/manage/SystemManagement/DeviceMeter',
              },
              {
                FGUID:3-18,
                FMenuLevle:2,
                FMenuName:'区域映射',
                FFunctionURLAddress:'/manage/SystemManagement/AreaMaping',
              },
            ]
          },
        ]
      }
    },
    components:{
      zwNav,
      operation
    }
}
</script>
<style lang="scss">
.el-container{
  padding: 10px;
  .el-header{
    padding: 0 10px;
    .header-operation ul.clearfix li.user-name{
      width: auto;
    }
  }
  .app-logo{
    height: 48px;
    padding-top: 15px;
    /* padding-left: 50px; */
    box-sizing: border-box;
    text-align: left;
    color: white;
    >p{
      margin-left: 10px;
      line-height: 50px;
      font-size:26px;
      font-family:JZunYuan;
      font-weight:bold;
      color:rgba(42,145,252,1);
    }
  }
  .el-aside{
    height: 916px;
    border:1px solid rgba(4,44,113,1);
    border-radius:10px 6px 6px 10px;
    box-shadow:  0 0 10px 4px rgba(4,44,113,0.5) inset
  }
  .el-menu{
      height: 100%;
      /* padding: 0 20px; */
      background: none;
      border-right: none;
      .el-icon-arrow-down{
        font-size: 20px;
        right: 10px;
        margin-top:-10px;
        color:#ffffff
      }
      .el-icon-arrow-down:before{
        content: "\e790";
      }
      .menu-list-1{
        >.el-submenu{
            >.el-submenu__title{
              height: 66px;
              line-height: 66px;
              /* text-indent: 10px; */
              background-size: 100% 100%;
              padding-right: 0px;
            }
      
        }
        >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
           background: linear-gradient(90deg,rgba(42,145,252,0.5),rgba(33,111,193,0.5),rgba(5,30,63,0.5));
           background-size: 100% 100%;
           color: #ffffff;
           i{
             color: #ffffff;
           }
        }
      }
      .menu-list{
          margin-top: 20px;
      }
      .el-submenu__title,.el-menu-item{
        color: #2a91fc;
        font-size: 18px;
        text-align: left;
        i{
          color: #2a91fc;
        }
      }
      .el-submenu .el-menu-item{
        text-indent: 14px;
        min-width: 100px;
      }
      .el-menu-item{
        height: 45px;
        margin-top: 20px;
      }
      .menu-list-children{
        .el-submenu.is-active>.el-submenu__title,.el-submenu>.el-submenu__title:hover,
        .el-submenu>.el-submenu__title:focus,
        .el-menu-item.is-active,.el-menu-item:hover,.el-menu-item:focus{
          color: #ffffff;
          background: linear-gradient(90deg,rgba(42,145,252,0.5),rgba(33,111,193,0.5),rgba(5,30,63,0.5));
        }
      }
  }
  .el-main{
    margin-left: 10px;
    padding: 0;
    overflow: hidden;
  }
}

</style>
