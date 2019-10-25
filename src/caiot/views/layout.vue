<template>
  <div class="layout">
    <div v-if="$route.name === 'SystemBrowse'||$route.name === 'AreaBrowse'">
      <router-view></router-view>
    </div>
    <div v-else>
      <left-side></left-side>
      <div class="layout-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import leftSide from './ProjectOverview/leftSide.vue';
export default {
  data(){
    return{
    }
  },
  components:{
    leftSide
  }

}
</script>
<style lang="scss">
.layout{
  height: 912px;
  >div{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  &-main{
    width: 1590px;
  }
}
/* .monitoring .m_right .fin_item ul {
  padding: 29px 20px;
}
.monitoring .fin_item {
  height: 700px;
  background: url(/static/image/index/content_bg_6.png) no-repeat;
} */
</style>