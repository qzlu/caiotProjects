<template>
  <div class="zw-nav">
        <div v-for="menu in menus" :key="menu.FGUID" :class="`menu-list-${menu.FMenuLevle}`" >
          <el-submenu v-if="menu.FChildMenu&&menu.FChildMenu.length"  :index='menu.FFunctionURLAddress'>
            <template slot="title" >
<!--               <router-link :to="menu.FFunctionURLAddress" v-if="menu.FMenuLevle==1">
                <i :class="menu.icon"></i>
                {{menu.FMenuName}}
              </router-link>
              <span v-else>{{menu.FMenuName}}</span> -->
                <i :class="['iconfont',menu.FICONURLAddress]" v-if="menu.FMenuLevle==1" style="position:relative;top:-2px;font-size:22px;margin-right:4px;color:#48B3C8"></i>
                {{menu.FMenuName}}
            </template>
            <zw-nav :menus="menu.FChildMenu" style="padding:0 10px;">
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
<style lang="scss" >

</style>