<template>
  <div>
        <div v-for="menu in menus" :key="menu.FGUID" :class="`menu-list-${menu.FMenuLevle}`" >
          <el-submenu v-if="menu.FChildMenu&&menu.FChildMenu.length"  :index='menu.FFunctionURLAddress'>
            <template slot="title" >
<!--               <router-link :to="menu.FFunctionURLAddress" v-if="menu.FMenuLevle==1">
                <i :class="menu.icon"></i>
                {{menu.FMenuName}}
              </router-link>
              <span v-else>{{menu.FMenuName}}</span> -->
                <i class="el-icon-message" v-if="menu.FMenuLevle==1"></i>
                {{menu.FMenuName}}
            </template>
            <zw-nav :menus="menu.FChildMenu">
            </zw-nav>
          </el-submenu>
          <el-menu-item v-else  :index="`/manage/${menu.FFunctionURLAddress}`" @click="chageRouter(menu)">
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
  methods:{
    chageRouter(item){
      this.$store.dispatch('addRoute',item)
    } 
  }
}
</script>
<style >
</style>