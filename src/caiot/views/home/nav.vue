<template>
  <div class="zw-nav clearfix">
        <div v-for="menu in menus" :key="menu.FGUID" :class="['menu-list',menu.FMenuLevle ==1?'menu-list-1':'menu-list-children']" >
          <el-submenu popper-class="home-menu"  v-if="menu.FChildMenu&&menu.FChildMenu.length"  :index='menu.FFunctionURLAddress'>
            <template slot="title">
                <i :class="['iconfont',menu.FICONURLAddress]" v-if="menu.FMenuLevle==1" style="position:relative;top:-2px;font-size:22px;margin-right:4px;color:#48B3C8"></i>
                {{menu.FMenuName}}
            </template>
            <zw-nav :menus="menu.FChildMenu" style="padding:0 10px;">
            </zw-nav>
          </el-submenu>
          <el-menu-item v-else-if="!menu.blank"  :index="menu.FFunctionURLAddress">
            {{menu.FMenuName}}
          </el-menu-item>
          <el-menu-item v-else>
            <a  :href="menu.FFunctionURLAddress" target="_blank">{{menu.FMenuName}}</a>
          </el-menu-item>
        </div>
  </div>
</template>
<script>
export default {
  name:'zwNav',
  data(){
    return{
    }
  },
  props:{
    menus:{
      type:Array
    }
  },
  mounted(){
  },
  methods:{
  }
}
</script>
<style lang="scss">
$url: "../../static/image/index/";
.zw-nav{
  padding-right: 0!important;
  .menu-list-1{
    width: 170px;
    height: 44px;
    line-height: 44px;
    float: left;
    position: relative;
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
          .el-icon-arrow-down{
              transform-origin: 70% 50%;
          }
        }
    }
    >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
       background: url(#{$url}menu-active.png) no-repeat;
       background-size: 100% 100%;
       color:rgba(241, 158, 64, 1)
    }
  }
  .menu-list-1:nth-of-type(3){
    margin-left: 536px;
  }
  .menu-list-children{
    .el-submenu{
      .el-submenu__title:hover,.el-submenu__title:focus{
        color:rgba(241, 158, 64, 1)
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
.home-menu{
  .el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
    min-width: 165px;
  }
}
</style>