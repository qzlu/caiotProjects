<template>
  <div class="zw-nav clearfix">
        <div v-for="menu in menus" :key="menu.FGUID" :class="['menu-list',menu.FParentGUID =='00000000-0000-0000-0000-000000000000'?'menu-list-1':'menu-list-children']" >
          <el-submenu popper-class="home-menu"  v-if="menu.ListData&&menu.ListData.length"  :index='menu.FFunctionURLAddress'>
            <template slot="title">
              <!-- <a href="#" v-if="menu.FMenuLevle ==1"> {{menu.FMenuName}}</a> -->
              <router-link :to="menu.FURL+'/'" v-if="menu.FMenuLevle ==1">
                {{menu.FMenuName}}
              </router-link>
              <span v-else>{{menu.FMenuName}}</span>
            </template>
            <zw-nav :menus="menu.ListData" style="padding:0 10px;">
            </zw-nav>
          </el-submenu>
          <el-menu-item v-else :index="menu.FURL">
            <router-link :to="menu.FURL||'/'">
              {{menu.FMenuName}}
            </router-link>
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
  computed:{
    menuData(){

    }
  },
  mounted(){
  },
  methods:{
  }
}
</script>
<style lang="scss">
$url: "../assets/image/layout/";
.home-menu{
  .el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
    min-width: 165px;
  }
  a{
    display: block;
    color:rgb(4, 6, 8);
  }
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
      .el-submenu__title{
        color:rgba(241,241,242,1);
        background: rgba(13, 47, 96, 1);
      }
      .el-menu-item:hover,.el-menu-item.is-active,.el-submenu.is-active .el-submenu__title{
        color:rgba(241,241,242,1);
        background: rgba(53, 91, 149, 1)
      }
    }
  }
}
</style>