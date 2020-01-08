<template>
  <div class="home">
    <audio id="myAudio">
        <source src="@/assets/audio/new_warn.mp3"  type="audio/mpeg">
    </audio>
    <div class="home_center">
      <header>
        <div class="logo l">
          <img :src="logoImg" alt="">
        </div>
        <div class="system-name">
          {{formName}}
        </div>
        <operation :top="20" className="home-project-list">
          <li class="l icon" @click="goManage()" v-if="systemMenu&&systemMenu.length>0">
              <i class="iconfont icon-zs-backstage"></i>
          </li>
          <li class="l icon" @click="switchAudio">
              <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
          </li>
        </operation>
        <div class="menu">
            <el-menu unique-opened :default-active="$route.path" ref="menu"  mode="horizontal">
              <zw-nav class="menu-left" :menus="leftMenuData">
              </zw-nav>
              <zw-nav class="menu-right" :menus="rightMenuData">
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
      logoImg:localStorage.getItem('logo')?`http://47.106.64.130:56090/${localStorage.getItem('logo')}`:require("../../static/image/index/logo-caiot.png"),
      formName:localStorage.getItem("formName")||"千仞智服设施管控云平台",
      BlocName:localStorage.getItem("BlocName")||"中物互联"
    };
  },
  components: { zwNav,operation },
  computed: {
    myAudio(){
        return document.getElementById('myAudio')
    },
    leftMenuData(){
      let len = this.$store.state.menuData.length
      if(len > 0){
        let center = Math.ceil(len/2)
        return this.$store.state.menuData.slice(0,center)
      }else{
        this.$store.dispatch('getMenu')
      }
    },
    rightMenuData(){
      let len = this.$store.state.menuData.length
      let center = Math.ceil(len/2)
      return this.$store.state.menuData.slice(center)
    },
    systemMenu(){
      return this.$store.state.systemMenu
    }
  },
  watch:{
    $route(route){
      if(route.name == 'detail_info_list'){
        this.$nextTick(() => {
          this.$refs.menu.activeIndex = '/monitoring/systemBrowse'
        })
      }else if(route.name == 'DeviceInfo'){
        this.$nextTick(() => {
          this.$refs.menu.activeIndex = '/DeviceManagement/'
        })
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.getAlarmData()
  },
  mounted: function() {
    let route = this.$route
    if(route.name == 'detail_info_list'){
      this.$nextTick(() => {
        this.$refs.menu.activeIndex = '/monitoring/systemBrowse'
      })
    }else if(route.name == 'DeviceInfo'){
      this.$nextTick(() => {
        this.$refs.menu.activeIndex = '/DeviceManagement/'
      })
    }
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    goManage(){
      this.$router.push('/manage')
    },
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
      this.$nextTick(() => {
        this.myAudio.play()
      })
/*       if(this.alarmTimes < 3){
        this.myAudio.play()
        this.alarmTimes ++ //只报警三次
        setTimeout(this.playWarn,3000)
      }else{
        this.myAudio.pause()
      } */
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
          this.isOpen == 1&&this.playWarn()
/*           //最新报警时间比上一次报警时间大时，播放报警音
          if(this.lastAlarmTime  == ''||(new Date(this.lastAlarmTime)<new Date(result.FObject[0].AlarmTime))){
            this.alarmTimes = 0
            this.lastAlarmTime = result.FObject[0].AlarmTime
            this.isOpen == 1&&this.playWarn()
          } */
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
  &_center {
    width: 1900px;
    height: 1080px;
    margin: 0 auto;
    header{
      width: 100%;
      height: 130px;
      margin-top: 10px;
      margin-bottom: 14px;
      position: relative;
      background: url(#{$img-url}index/nav-header.png) 100px no-repeat;
      .logo{
        width: 160px;
        height: 120px;
        /* line-height: 120px; */
        img{
          max-width: 100%;
          max-height: 100%;
          vertical-align: middle;
        }
      }
      .block-name{
        margin-top: 24px;
        margin-left: 10px;
        font-size:22px;
        font-weight:400;
        color:rgba(132,192,255,1);
      }
      .system-name{
        width: 524px;
        height: 120px;
        line-height: 130px;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -262px;
        font-size:38px;
        font-weight:bold;
        letter-spacing: 4px;
        color:rgba(132,192,255,1);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
      }
      .home-project-list{
        position: absolute;
        top:50px;
        right: 0;
      }
      .menu{
        width: 100%;
        position: absolute;
        top:70px;
        /* left: 290px; */
        .zw-nav{
          position: absolute;
        }
        .menu-left{
          right: 1216px;
        }
        .menu-right{
          left: 1216px;
        }
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
.el-select-dropdown.el-popper[x-placement^=bottom] .popper__arrow{
  border-bottom-color:rgba(13, 47, 96, 1)
}
.el-select-dropdown.el-popper[x-placement^=bottom] .popper__arrow::after{
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