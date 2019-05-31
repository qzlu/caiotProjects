<template>
    <el-container style="height:100%">
      <el-aside width="200px">
        <div class="app-logo">
          <img src="../../../assets/image/logo.png" alt="">
        </div>
        <el-menu>
          <zw-nav :menus="menus">
          </zw-nav>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>
<script>
import zwNav from './nav.vue'
export default {
    data(){
      return{
        menus:[
          {
            FGUID:1,
            FMenuLevle:1,
            FMenuName:'告警管理',
            FFunctionURLAddress:'test1',
            icon:'el-icon-message',
            FChildMenu:[
              {
                FGUID:1-1,
                FMenuLevle:2,
                FMenuName:'告警列表',
                FFunctionURLAddress:'test12',
              },
              {
                FGUID:1-2,
                FMenuLevle:2,
                FMenuName:'告警配置',
                FFunctionURLAddress:'test13',
              }
            ]
          },
          {
            FGUID:2,
            FMenuLevle:1,
            FMenuName:'任务管理',
            FFunctionURLAddress:'test21',
            icon:'el-icon-message',
            FChildMenu:[
              {
                FGUID:2-1,
                FMenuLevle:2,
                FMenuName:'告警列表',
                FFunctionURLAddress:'test12',
              },
              {
                FGUID:2-2,
                FMenuLevle:2,
                FMenuName:'告警配置',
                FFunctionURLAddress:'test13',
              }
            ]
          }
        ]
      }
    },
    components:{
      zwNav
    }
}
</script>
<style lang="scss">
.el-container{
  padding: 10px;
  background: url(../../../assets/image/device/bg_1.png);
  .app-logo{
    height: 106px;
    line-height: 106px;
    margin-top: 50px;
    margin-bottom: 30px;
    background: rgba(0, 40, 77, 1);
    font-size: white;
    color: white;
  }
  .el-menu{
    background: none;
    border-right: none;
    i{
      color: white;
    }
    .el-submenu__title,.el-menu-item{
      color:white;
      font-size: 18px;
    }
  }
  .el-main{
    background: url(../../../assets/image/device/bg_2.png);
    background-size: 100% 100%;
  }
}

</style>
