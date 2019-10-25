<template>
  <div class="zw-nav" style="padding-left:0">
        <div v-for="menu in menus" :key="menu.FGUID" :class="['menu-list',menu.FMenuLevle ==0?'menu-list-1':'menu-list-children']" >
          <el-submenu  v-if="menu.FChildMenu&&menu.FChildMenu.length"  :index='menu.FURL'>
            <template slot="title">
                <i :class="['iconfont',menu.FICONURLAddress]" v-if="menu.FMenuLevle==0" style="position:relative;top:-2px;font-size:28px;margin-right:4px;"></i>
                {{menu.FMenuName}}
            </template>
            <zw-nav :menus="menu.FChildMenu" style="padding:0 10px;">
            </zw-nav>
          </el-submenu>
          <el-menu-item v-else  :index="menu.FURL" @click="chageRouter(menu)">
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
    chageRouter(item){
      /* item.FFunctionURLAddress!=='alarmList' && this.$store.dispatch('addRoute',item) */
    } 
  }
}
</script>
<style lang="scss">
.zw-nav{
  padding-left: 0!important;
  padding-right: 0!important
}
</style>