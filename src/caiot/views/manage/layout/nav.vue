<template>
  <div>
        <div v-for="menu in menus" :key="menu.FGUID" :class="['menu-list',menu.FMenuLevle ==1?'menu-list-1':'menu-list-children']" >
          <el-submenu v-if="menu.FChildMenu&&menu.FChildMenu.length"  :index='menu.FFunctionURLAddress'>
            <template slot="title">
<!--               <router-link :to="menu.FFunctionURLAddress" v-if="menu.FMenuLevle==1">
                <i :class="menu.icon"></i>
                {{menu.FMenuName}}
              </router-link>
              <span v-else>{{menu.FMenuName}}</span> -->
                <i :class="['iconfont',menu.FICONURLAddress]" v-if="menu.FMenuLevle==2" style="font-size:28px"></i>
                {{menu.FMenuName}}
            </template>
            <zw-nav :menus="menu.FChildMenu">
            </zw-nav>
          </el-submenu>
          <el-menu-item v-else :index='menu.FURL'>
            {{menu.FMenuName}}
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
<style >
</style>