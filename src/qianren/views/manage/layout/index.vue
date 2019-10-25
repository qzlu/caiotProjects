<template>
    <div class="manage">
        <el-container>
            <el-header height="82px">
               <div class="l logo">
                   <router-link to="/">
                        <img :src="logoImg" alt="">
                        <span>后台管理系统</span>
                   </router-link>
               </div>
               <div class="r">
                   <!-- <span>{{date}}</span> -->
                    <el-dropdown>
                      <div class="el-dropdown-link icon-item">
                        <i class="iconfont icon-User"></i>
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="show = true">设置密码</el-dropdown-item>
                        <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <span style="margin-left:20px;">{{user}}</span>
               </div>
            </el-header>
            <el-container style="margin-right: 12px;">
                <el-aside width="210px">
                  <div class="menu">
                      <el-scrollbar>
                        <el-menu unique-opened :default-active="$route.path" router>
                          <zw-nav :menus="menuData">
                          </zw-nav>
                        </el-menu>
                      </el-scrollbar>
                  </div>
                </el-aside>
                <el-main>
                  <h4 class="router-name">{{$route.meta.name}}</h4>
                  <router-view>
                  </router-view>
                </el-main>
             </el-container>
        </el-container>
    </div>
</template>
<script>
import formatDate from '@/utils/formatDate.js'
import zwNav from './nav.vue'
export default {
    data(){
        return{
            user:sessionStorage.getItem("FContacts"), //用户名
            date:null,
            timer:null,
            logoImg:sessionStorage.getItem('logo')?`http://47.107.224.8:8080/${sessionStorage.getItem('logo')}`:require("@/assets/image/logo-caiot.png"),
            menuData:[
            ]
        }
    },
    components:{
        zwNav
    },
    created(){
      this.menuData = [
        {
          FGUID:'0000-0000-0000',
          FMenuName:sessionStorage.getItem('FUserType') == 1?'运营管理':'集团管理',
          FICONURLAddress:'icon-OperationsManagement',
          FMenuLevle:0,
          FURL:'/manage',
          FChildMenu:JSON.parse(sessionStorage.getItem('systemMenu'))
        }
      ]
      this.getTime()
    },
    methods:{
        getTime(){
            this.date = formatDate(new Date(),'YYYY/MM/DD HH:mm:ss')
            this.timer = setTimeout(() => {
                this.getTime()
            },1000)
        },
        logOut(){
            this.$router.push('/login')
        },
    }
}
</script>
<style lang="scss">
$url:'../../../assets/images/';
.manage{
    height: 100%;
    background: url(../../../../assets/image/device/bg_1.png);
    color: #C7FEFF;
    .el-container{
        height: 100%;
        .el-header{
            line-height: 82px;
            padding: 0 52px 0 36px;
            div.logo{
                /* width: 160px; */
                height: 82px;
                a{
                  img{
                    max-width: 160px;
                    max-height: 100%;
                    vertical-align: top;
                  }
                  span{
                    font-size: 20px;
                    color: #C7FEFF;
                    margin-left: 10px;
                  }
                }
            }
            div.r{
                .el-dropdown{
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    margin-left: 20px;
                    background: rgba(84,177,221,.32);
                    border-radius: 50%;
                    -webkit-box-shadow: 0 0 14px rgba(84,177,221,1);
                    box-shadow: 0 0 14px rgba(84,177,221,1);
                    cursor: pointer;
                    .iconfont{
                        font-size: 24px;
                        color: #5FCDF2
                    }
                }
                span{
                    font-size: 18px;
                }
            }
        }
        .el-aside{
            height: 960px;
            margin-left: 10px;
            border: 1px solid rgba($color: #5fcdf2, $alpha: 0.4);
            border-radius: 10px 6px 6px 10px;
            box-shadow: 0 0 10px 2px rgba($color: #5fcdf2, $alpha: 0.4) inset;
            .menu{
              height: 920px;
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
/*                     >.el-submenu__title{
                      height: 66px;
                      line-height: 66px;
                      background-size: 100% 100%;
                      padding-right: 0px;
                    } */

                }
                >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
                   background: linear-gradient(90deg,rgba(42,145,252,0.5),rgba(33,111,193,0.5),rgba(5,30,63,0.5));
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
        }
        .el-main{
            height: 960px;
            margin-left: 10px;
            box-sizing: border-box;
            border:1px solid rgba($color: #5fcdf2, $alpha: 0.4);
            border-radius:10px;
            overflow: hidden;
            box-shadow: 0 0 10px 2px rgba($color: #5fcdf2, $alpha: 0.4) inset;
            h4.router-name{
              padding-left: 10px;
              text-align: left;
              line-height: 44px;
              font-size: 22px;
              border-bottom: 1px solid #8f9cbf;
            }
        }
    }
}
</style>