<template>
    <el-container style="height:100%">
      <el-header height="85px">
        <div class="app-logo l">
          <router-link :to="homPath">
            <img :src="logoImg" alt="">
            <span class="r">
              后台管理系统
            </span>
          </router-link>
        </div>
        <operation className="l"></operation>
      </el-header>
      <el-container>
        <el-aside width="310px">
          <el-scrollbar>
            <el-menu unique-opened :default-active="$route.path"  router>
              <zw-nav :menus="menuData">
              </zw-nav>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
import zwNav from './nav.vue'
import operation from '../../home/operation.vue';
export default {
    data(){
      return{
        logoImg:`http://47.106.64.130:56090/${localStorage.getItem('logo')}`,
        homPath:localStorage.getItem('homePath')||'/'
      }
    },
    components:{
      zwNav,
      operation
    },
    computed: {
      menuData(){
        if(this.$store.state.systemMenu.length>0){
          console.log(this.$store.state.systemMenu);
          return this.$store.state.systemMenu
        }else{
          this.$store.dispatch('getMenu')
        }
      }
    },
    created(){
    }
}
</script>
<style lang="scss">
.el-container{
  padding: 10px;
  .el-header{
    padding: 0 10px;
    .header-operation ul.clearfix li.user-name{
      width: auto;
    }
  }
  .app-logo{
    height: 82px;
    line-height: 82px;
    /* padding-left: 50px; */
    box-sizing: border-box;
    text-align: center;
    color: white;
    a{
      line-height: 82px;
      font-size:26px;
      font-family:JZunYuan;
      font-weight:bold;
      color:rgba(42,145,252,1);
      img{
        max-width: 150px;
        max-height: 82px;
        vertical-align: top;
      }
      span{
        margin-left: 10px;
      }
    }
  }
  .el-aside{
    height: 916px;
    border:1px solid rgba(4,44,113,1);
    border-radius:10px 6px 6px 10px;
    box-shadow:  0 0 10px 4px rgba(4,44,113,0.5) inset
  }
  .el-menu{
      height: 100%;
      /* padding: 0 20px; */
      background: none;
      border-right: none;
      .el-icon-arrow-down{
        font-size: 20px;
        right: 10px;
        margin-top:-10px;
        color:#ffffff
      }
      .el-icon-arrow-down:before{
        content: "\e790";
      }
      .menu-list-1{
        >.el-submenu{
            >.el-submenu__title{
              height: 66px;
              line-height: 66px;
              /* text-indent: 10px; */
              background-size: 100% 100%;
              padding-right: 0px;
            }
      
        }
        >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
           background: linear-gradient(90deg,rgba(42,145,252,0.5),rgba(33,111,193,0.5),rgba(5,30,63,0.5));
           background-size: 100% 100%;
           color: #ffffff;
           i{
             color: #ffffff;
           }
        }
      }
      .menu-list{
          margin-top: 20px;
      }
      .el-submenu__title,.el-menu-item{
        color: #2a91fc;
        font-size: 18px;
        text-align: left;
        i{
          color: #2a91fc;
        }
      }
      .el-submenu .el-menu-item{
        text-indent: 14px;
        min-width: 100px;
      }
      .el-menu-item{
        height: 45px;
        margin-top: 20px;
      }
      .menu-list-children{
        .el-submenu.is-active>.el-submenu__title,.el-submenu>.el-submenu__title:hover,
        .el-submenu>.el-submenu__title:focus,
        .el-menu-item.is-active,.el-menu-item:hover,.el-menu-item:focus{
          color: #ffffff;
          background: linear-gradient(90deg,rgba(42,145,252,0.5),rgba(33,111,193,0.5),rgba(5,30,63,0.5));
        }
      }
  }
  .el-main{
    margin-left: 10px;
    padding: 0;
    overflow: hidden;
  }
}

</style>
