<template>
  <div class="home">
    <audio id="myAudio" autoplay="false">
        <source src="@/assets/audio/new_warn.mp3" type="audio/mpeg">
    </audio>
    <div class="home_center">
      <header>
        <div class="logo l">
          <img :src="logoImg" alt="">
        </div>
        <div class="system-name">
          {{currentForm.FormName}}
        </div>
        <operation :top="20" className="home-project-list">
          <li class="l icon" @click="switchAudio">
              <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
          </li>
        </operation>
        <div class="form-link" v-if="linkFormList.length>0">
            <el-dropdown>
              <span class="el-dropdown-link">
                平台导航<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(form,i) in linkFormList" :key="i" @click.native="changeSystem(form.FIndex)">
                        {{form.FormName}}
                  </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="menu">
            <div class="pre-menu">
                <span class="iconfont icon-Leftparentheses" v-show="leftMenuLasIndex>3" @click="preMenu()">
                </span>
            </div>
            <el-menu unique-opened :default-active="$route.path" ref="menu"  mode="horizontal">
              <div class="menu-left-container">
                <zw-nav class="menu-left" :menus="leftMenuData" :style="{left:(3-leftMenuLasIndex)*170+'px'}">
                </zw-nav>
              </div>
              <div class="menu-right-container">
                <zw-nav class="menu-right" :menus="rightMenuData">
                </zw-nav>
              </div>
            </el-menu>
            <div class="next-menu">
                <span class=" iconfont icon-Rightparentheses" v-show="rightMenuData.length>3" @click="nextMenu()">
                </span>
            </div>
        </div>
      </header>
      <div style="height:920px;">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
import zwNav from "./nav.vue"; //
import operation from './operation.vue';
export default {
  data() {
    return {
      is_li: 0, //控制报警声音参数
      inIframe: localStorage.getItem("inIframe"), //是否是iframe调用
      isOpen:localStorage.getItem('open')||1, //控制报警声音
      alarmTimes:0, //报警次数
      lastAlarmTime:null, //记录最后报警时间
      timer:null,
      logoImg:localStorage.getItem('logo')?`http://47.106.64.130:56090/${localStorage.getItem('logo')}`:require("@/assets/image/layout/logo-caiot.png"),
      formName:localStorage.getItem("formName")||"千仞智服设施管控云平台",
      BlocName:localStorage.getItem("BlocName")||"中物互联",
      leftMenuLasIndex:3,
      formList:[], //平台列表
      currentForm:{},
      menuData:[]
    };
  },
  props:{
    formIndex:{
      type:Number,
      default:1
    }
  },
  components: { zwNav,operation },
  computed: {
    myAudio(){
        return document.getElementById('myAudio')
    },
    leftMenuData(){
      return this.$store.state.menuData.slice(0,this.leftMenuLasIndex)
    },
    rightMenuData(){
      return this.$store.state.menuData.slice(this.leftMenuLasIndex)
    },
    linkFormList(){
      console.log(this.formIndex);
      return this.formList.filter(item => item.FIndex != this.formIndex )
    }
  },
  watch:{
    $route(route){
      if(route.name == 'roleDetail'){
        this.$nextTick(() => {
          this.$refs.menu.activeIndex = '/manage/role'
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
    this.leftMenuLasIndex = Number(sessionStorage.getItem('leftMenuLasIndex'))||3
    this.queryTUserForm()
    /* this.initSystem() */
  },
  mounted: function() {
     let route = this.$route
      if(route.name == 'roleDetail'){
        this.$nextTick(() => {
          this.$refs.menu.activeIndex = '/manage/role'
        })
      }else if(route.name == 'DeviceInfo'){
        this.$nextTick(() => {
          this.$refs.menu.activeIndex = '/DeviceManagement/'
        })
      }
      /* console.log(route) */
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    initSystem(){
      this.formList = JSON.parse(sessionStorage.getItem('formList'))
      let formIndex = this.$route.params.id
      this.currentForm = this.formList[formIndex - 1]
      /* this.getMenus(this.currentForm.FGUID) */
    },
    /**
     * 递归遍历使得一级菜单的路由为其子菜单第一个页面
     */
     formatterMenu(data){
      data.forEach(menu => {
          if(menu.ListData&&menu.ListData.length>0){
              let children = menu.ListData[0]
              if(children.ListData&&children.ListData.length>0){
                  menu.FURL = this.formatterMenu([children])[0].FFunctionURLAddress
              }else{
                  menu.FURL = children.FURL
              }
          }
      })
      return data
    },
    changeSystem(index){
      /* this.$router.push(`/${index}`) */
      sessionStorage.removeItem('leftMenuLasIndex')
      let router = {
        1:"/",
        2:'/project.html',
        3:'/shuziYy.html',
        4:'/eYingji.html'
      }
        location.href = router[index]||'/'
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
      if(this.alarmTimes < 3){
        this.myAudio.play()
        this.alarmTimes ++ //只报警三次
        setTimeout(this.playWarn,3000)
      }else{
        this.myAudio.pause()
      }
    },
    preMenu(){
        if(this.leftMenuLasIndex>3){
            this.leftMenuLasIndex -- 
            sessionStorage.setItem('leftMenuLasIndex',this.leftMenuLasIndex)
        }
    },
    nextMenu(){
        this.leftMenuLasIndex ++
        sessionStorage.setItem('leftMenuLasIndex',this.leftMenuLasIndex)
    },
    /**
     * 平台管理—查询用户平台信息
     */
    queryTUserForm(){
      this.$post('QueryTUserForm')
      .then((result) => {
        console.log(result);
        this.formList = result.FObject || []
        this.currentForm = this.formList.find(item => item.FIndex == this.formIndex)
      }).catch((err) => {
        
      });
    },
  }
};
</script>
<style lang="scss">
$img-url: "../assets/image/";
.home {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #031432;
  .zw-nav{
    $url: "../assets/image/layout/";
    padding-right: 0!important;
    display: flex;
    .menu-list-1{
      width: 170px;
      height: 44px;
      line-height: 44px;
      position: relative;
      >li.el-menu-item{
            height: 44px;
            line-height: 44px;
            background: url(#{$url}menu-bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 0 0px;
            font-size:20px;
            font-weight:400;
            color:rgba(42,145,252,1);
            a{
              display: block;
              color:rgba(42,145,252,1);
            }
            &.is-active,&:hover{
              background: url(#{$url}menu-active.png) no-repeat;
              background-size: 100% 100%;
              color:rgba(241, 158, 64, 1);
              a{
                color:rgba(241, 158, 64, 1);
              }
            }
      }
      .el-submenu__title{
      }
      >.el-submenu{
          >.el-submenu__title{
            height: 44px;
            line-height: 44px;
            background: url(#{$url}menu-bg.png) no-repeat;
            background-size: 100% 100%;
            padding: 0 0px;
            font-size:20px;
            font-weight:400;
            color:rgba(42,145,252,1);
            a{
              display: block;
              color:rgba(42,145,252,1);
            }
            .el-icon-arrow-down{
                transform-origin: 70% 50%;
            }
          }
      }
      >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
         background: url(#{$url}menu-active.png) no-repeat;
         background-size: 100% 100%;
         color:rgba(241, 158, 64, 1);
         a{
           color:rgba(241, 158, 64, 1);
         }
      }
    }
    .menu-list-children{
      .el-submenu{
        .el-submenu__title:hover,.el-submenu__title:focus{
          color:rgba(241, 158, 64, 1);
        }
      }
      .el-submenu.is-active{
        .el-submenu__title{
          background: rgba(53, 91, 149, 1);
          color:rgba(241, 158, 64, 1)
        }
      }

    }
  }
  .zw-nav:focus{
    outline: none;
  }
  &_center {
    width: 1900px;
    height: 1080px;
    margin: 0 auto;
    >header{
      width: 100%;
      height: 130px;
      margin-top: 10px;
      margin-bottom: 14px;
      position: relative;
      background: url(#{$img-url}layout/nav-header.png) 100px no-repeat;
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
      .form-link{
          position: absolute;
          left: 30px;
          top: 80px;
          .el-dropdown{
              font-size: 16px;
              color: #84C0FF;
              /* font-weight: bold; */
              .el-dropdown-link{
                  cursor: pointer;
              }
          }
      }
      .menu{
        width: 1580px;
        height: 44px;
        position: absolute;
        top:70px;
        overflow: hidden;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        .pre-menu,.next-menu{
            width: 22px;
            height: 44px;
            line-height: 44px;
            >span{
                cursor: pointer;
                color: #2A91FC;
                font-size: 22px;
                font-weight: bold;
            }
        }
        .zw-nav{
          position: absolute;
        }
        .menu-left-container,.menu-right-container{
            width: 510px;
            height: 44px;
            overflow: hidden;
            position: absolute;
        }
        .menu-right-container{
            right: 0;
        }
        .el-menu--horizontal{
          width: 1540px;
          height: 44px;
          background: none;
          border-bottom: none;
          outline: none;
          overflow: hidden;
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
    /* background: url(#{$img-url}task/inspection.png); */
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