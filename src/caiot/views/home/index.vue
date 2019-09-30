<template>
  <div class="home">
    <audio class="success" id="myAudio" loop="loop" src="../../static/mp3/new_warn.mp3"></audio>
    <div class="home_center">
      <header>
        <div class="logo l">
          <img src="../../static/image/index/logo-caiot.png" alt="">
        </div>
        <div class="l block-name">
          中物互联
        </div>
        <div class="system-name">
          中物互联智服云平台
        </div>
        <operation>
          <li class="l icon">
              <router-link :to="`/manage`"  class="icon-item">
                  <i class="iconfont icon-zs-backstage"></i>
              </router-link>
          </li>
          <li class="l icon" @click="switchAudio">
              <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
          </li>
        </operation>
        <div class="menu">
            <el-menu unique-opened :default-active="$route.path" router mode="horizontal">
              <zw-nav :menus="menuList">
              </zw-nav>
            </el-menu>
        </div>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>
<style>
</style>
<script>
import zwNav from "./nav.vue"; //
import operation from './operation.vue';
import { project, system } from "@/caiot/request/api";
export default {
  data() {
    return {
      is_li: 0, //控制报警声音参数
      inIframe: localStorage.getItem("inIframe"), //是否是iframe调用
      isOpen:localStorage.getItem('open')||1, //控制报警声音
      alarmTimes:0, //报警次数
      lastAlarmTime:null, //记录最后报警时间
      timer:null,
      menuList:[{
        FMenuName:'项目态势',
        FGUID:'1',
        FMenuLevle:1,
        FFunctionURLAddress:'/ProjectBrowse/comprehensive',
        FChildMenu:[
          {
            FMenuName: '综合态势',
            FGUID:'1-1',
            FMenuLevle:2,
            FFunctionURLAddress:'/ProjectBrowse/comprehensive',
          },
          {
            FMenuName: '系统态势',
            id:'1-2',
            FMenuLevle:2,
            FFunctionURLAddress: '/ProjectBrowse/systemBrowse'
          },
          {
            FMenuName: '区域监测',
            FGUID:'1-3',
            FMenuLevle:2,
            FFunctionURLAddress: '/ProjectBrowse/areaBrowse'
          },
          {
            FMenuName: '重点监测',
            FGUID:'1-4',
            FMenuLevle:3,
            FFunctionURLAddress: '/monitoring/KeyEquipment'
          },
          {
            FMenuName: '第三屛',
            FGUID:'1-5',
            FMenuLevle:3,
            blank:true,
            FFunctionURLAddress: 'http://localhost:8080/#/'
          }
        ]
      },{
        FMenuName: '告警管理',
        FGUID:'2',
        FMenuLevle:1,
        FFunctionURLAddress: '/foreshow/',
        FChildMenu:[
          {
            FMenuName: '实时告警',
            FGUID:'2-1',
            FMenuLevle:2,
            FFunctionURLAddress: '/foreshow/'
          },
          {
            FMenuName: '历史告警',
            FGUID:'2-2',
            FMenuLevle:2,
            FFunctionURLAddress: '/foreshow/history_count'
          },
          {
            FMenuName: '告警统计',
            FGUID:'2-3',
            FMenuLevle:2,
            FFunctionURLAddress: '/foreshow/foreshow_count'
          }
        ]
      },{
        FMenuName: '能源管理',
        FGUID:'3',
        FMenuLevle:1,
        FFunctionURLAddress: '/energy/',
        FChildMenu:[
          {
            FMenuName: '能源配置',
            FGUID:'3-1',
            FMenuLevle:2,
            FFunctionURLAddress: '/energy/CalculationSettings'
          },
          {
            FMenuName: '能源计划',
            FGUID:'3-2',
            FMenuLevle:2,
            FFunctionURLAddress: '/energy/EnergyPlan'
          },
          {
            FMenuName: '能源统计',
            FGUID:'3-3',
            FMenuLevle:2,
            FFunctionURLAddress: '/energy/EnergyStatistics'
          }
        ]
      },{
        FMenuName: '任务管理',
        FGUID:'4',
        FMenuLevle:1,
        FFunctionURLAddress: '/TaskManagement/Worklist',
        FChildMenu:[
          {
            FMenuName: '工单池',
            FGUID:'4-1',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/Worklist'
          },
          {
            FMenuName: '巡检管理',
            FGUID:'4-2',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/InspectionItem',
            FChildMenu:[
              {
                FMenuName: '巡检点',
                FGUID:'4-2-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/InspectionItem'
              },
              {
                FMenuName: '巡检路线',
                FGUID:'4-2-2',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/InspectionRoad'
              },
              {
                FMenuName: '巡检计划',
                FGUID:'4-2-3',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/InspectionPlan'
              },
              {
                FMenuName: '巡检标准',
                FGUID:'4-2-4',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/InspectionStandard'
              },
              {
                FMenuName: '巡检记录',
                FGUID:'4-2-5',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/InspectionRecords'
              },
            ]
          },
          {
            FMenuName: '巡更管理',
            FGUID:'4-3',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/PatrolPoint',
            FChildMenu:[
              {
                FMenuName: '巡更点',
                FGUID:'4-3-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/PatrolPoint'
              },
              {
                FMenuName: '巡更路线',
                FGUID:'4-3-2',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/PatrolLine'
              },
              {
                FMenuName: '巡更计划',
                FGUID:'4-3-3',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/UPatrolPlan'
              },
              {
                FMenuName: '巡更记录',
                FGUID:'4-3-4',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/PatrolPlanRecord'
              },
              {
                FMenuName: '巡更报告',
                FGUID:'4-2-5',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/QueryPatrolPlanRecord'
              },
            ]
          },
          {
            FMenuName: '抄表管理',
            FGUID:'4-4',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/MeterReadingPoint',
            FChildMenu:[
              {
                FMenuName: '抄表点',
                FGUID:'4-4-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MeterReadingPoint'
              },
              {
                FMenuName: '抄表路线',
                FGUID:'4-4-2',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MeterReadingLine'
              },
              {
                FMenuName: '抄表计划',
                FGUID:'4-4-3',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MeterReadingPlan'
              },
              {
                FMenuName: '抄表记录',
                FGUID:'4-4-4',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MeterReadingRecords'
              },
            ]
          },
          {
            FMenuName: '保养管理',
            FGUID:'4-5',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/MaintenanceStandard',
            FChildMenu:[
              {
                FMenuName: '保养标准',
                FGUID:'4-5-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MaintenanceStandard'
              },
              {
                FMenuName: '保养计划',
                FGUID:'4-5-2',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MaintenancePlan'
              },
              {
                FMenuName: '保养记录',
                FGUID:'4-5-3',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MaintenanceRecords'
              },
              {
                FMenuName: '维保耗材库',
                FGUID:'4-5-4',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/Supplies'
              },
            ]
          },
          {
            FMenuName: '报事管理',
            FGUID:'4-6',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/MatterRecord',
            FChildMenu:[
              {
                FMenuName: '报事记录',
                FGUID:'4-6-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/MatterRecord'
              }
            ]
          },
          {
            FMenuName: '维修管理',
            FGUID:'4-7',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/',
            FChildMenu:[
              {
                FMenuName: '维修记录',
                FGUID:'4-7-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/'
              }
            ]
          },
          {
            FMenuName: '告警处理',
            FGUID:'4-8',
            FMenuLevle:2,
            FFunctionURLAddress: '/TaskManagement/AlarmRecord',
            FChildMenu:[
              {
                FMenuName: '告警记录',
                FGUID:'4-8-1',
                FMenuLevle:3,
                FFunctionURLAddress: '/TaskManagement/AlarmRecord'
              }
            ]
          }
        ]
      }]
    };
  },
  components: { zwNav,operation },
  computed: {
    projectList() {
      let projectID = localStorage.getItem("projectid");
      if (projectID > 0 && this.inIframe == 1) { 
        let projectList = this.$store.state.projectList.filter(
          item => item.ProjectID == projectID
        );
        this.curr_selectdata = projectList[0];
        return projectList;
      } else {
        this.curr_selectdata = this.$store.state.projectList.find(
          item => item.ProjectID == projectID
        );
        return this.$store.state.projectList;
      }
    },
    myAudio(){
        return document.getElementById('myAudio')
    }
  },
  beforeCreate() {
  },
  created() {
    this.getAlarmData()
  },
  mounted: function() {
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    /**
     * 切换声音开关
     */
    switchAudio(){
        if(this.isOpen == 1){
            this.isOpen = 0
            localStorage.setItem('open',0)
            this.myAudio.pause()
        }else{
            this.isOpen = 1
            localStorage.setItem('open',1)
        }
    },
    /**
     * 播放报警声
     */
    playWarn(){
      if(this.alarmTimes < 3){
        this.myAudio.play()
        this.alarmTimes ++ //只报警三次
        setTimeout(this.playWarn,3000)
      }else{
        this.myAudio.pause()
      }
    },
    /**
     * 获取实时告警数据
     */
    getAlarmData(){
      project({
        FAction: "GetAlarmRealData"
      })
      .then((result) => {
        if(result.FObject&&result.FObject.length>0){
          //最新报警时间比上一次报警时间大时，播放报警音
          if(this.lastAlarmTime  == ''||(new Date(this.lastAlarmTime)<new Date(result.FObject[0].AlarmTime))){
            this.lastAlarmTime = result.FObject[0].AlarmTime
            this.isOpen == 1&&this.playWarn()
          }
        }
        this.timer = setTimeout(() => {
          this.getAlarmData()
        },5000)
      }).catch((err) => {
        
      });
    }
  }
};
</script>
<style lang="scss">
$img-url: "../../static/image/";
.home {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #031432;
  &_center {
    width: 1900px;
    height: 1080px;
    margin: 0 auto;
    header{
      width: 100%;
      height: 130px;
      margin-bottom: 24px;
      position: relative;
      background: url(#{$img-url}index/nav-header.png) center no-repeat;
      .logo{
        margin-top: 46px;
        margin-left: 20px;
        img{
          width: 96px;
          height: 48px;
        }
      }
      .block-name{
        margin-top: 60px;
        margin-left: 10px;
        font-size:22px;
        font-weight:400;
        color:rgba(132,192,255,1);
      }
      .system-name{
        width: 524px;
        height: 120px;
        line-height: 120px;
        margin-left: 634px;
        font-size:38px;
        font-weight:bold;
        letter-spacing: 4px;
        color:rgba(132,192,255,1);
      }
      .menu{
        position: absolute;
        top:60px;
        left: 290px;
        .el-menu--horizontal{
          background: none;
          border-bottom: none;
          outline: none;
        }
        .el-menu--horizontal:focus{
          outline: none;
        }
      }
    }
  }
}
.el-select-dropdown{
  background: rgba(13, 47, 96, 1);
  border: none;
  .el-select-dropdown__item{
    color:rgba(241,241,242,1);
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background: rgba(53, 91, 149, 1)
  }
}
.el-popper[x-placement^=bottom] .popper__arrow{
  border-bottom-color:rgba(13, 47, 96, 1)
}
.el-popper[x-placement^=bottom] .popper__arrow::after{
  border-bottom-color:rgba(13, 47, 96, 1)
}
.el-menu--horizontal{
  background: none;
  border-bottom: none;
  outline: none;
  .zw-nav{
    padding: 0!important;
  }
  .el-menu {
    .el-submenu__title{
      background: none;
      color:rgba(241,241,242,1);
      font-size: 18px;
    }
    .el-submenu__title:hover,.el-submenu__title.is-active{
        color:rgba(241,241,242,1);
        background: rgba(53, 91, 149, 1)
    }
  }
  .el-menu--popup{
    background: rgba(13, 47, 96, 1);
    .menu-list-children{
      background: rgba(13, 47, 96, 1);
      .el-menu-item{
        background: none;
        color:rgba(241,241,242,1);
        font-size: 18px;
        a{
          color:rgba(241,241,242,1);
        }
      }
      .el-menu-item:hover,.el-menu-item.is-active{
        color:rgba(241,241,242,1);
        background: rgba(53, 91, 149, 1)
      }
    }
  }
}
.change-password {
  .el-dialog {
    width: 426px;
    // height: 367px;
    background: url(#{$img-url}task/inspection.png);
    background-size: 100% 100%;
    padding-left: 48px !important;
    &__header {
      text-align: left;
    }
    .el-form {
      &-item {
        .el-form-item__label {
          width: 94px;
          color: #f1f1f2;
        }
        .el-input {
          width: 165px;
          .el-input__inner {
            background: #05679e;
            border-color: #18406b;
            color: #f1f1f2;
          }
        }
        &__error {
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>