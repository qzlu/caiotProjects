<template>
    <div class="manage">
        <el-container>
            <el-header height="82px">
               <div class="l">
                   <img src="@/assets/image/logo.png" alt="">
                   <span>智维后台管理系统</span>
               </div>
               <div class="r">
                   <span>{{date}}</span>
                    <el-dropdown>
                      <div class="el-dropdown-link icon-item">
                        <i class="iconfont icon-User"></i>
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="show = true">设置密码</el-dropdown-item>
                        <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
               </div>
            </el-header>
            <el-container style="height: 900px;margin-right: 12px;">
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
            date:null,
            timer:null,
            menuData:[
                {
                    FGUID:'1',
                    FMenuName:'系统管理',
                    FMenuLevle:1,
                    FICONURLAddress:'icon-SZXFY-basicinformation',
                    FFunctionURLAddress:'system',
                    FChildMenu:[
                        {
                            FGUID:'1-1',
                            FMenuName:'组织管理',
                            FMenuLevle:2,
                            FICONURLAddress:'icon-SZXFY-basicinformation',
                            FFunctionURLAddress:'system/organizational',
                            FChildMenu:[
                                {
                                    FGUID:'1-1-1',
                                    FMenuName:'行政架构',
                                    FMenuLevle:3,
                                    FFunctionURLAddress:'system/organizational/',
                                },
                                {
                                    FGUID:'1-1-2',
                                    FMenuName:'组织架构',
                                    FMenuLevle:3,
                                    FFunctionURLAddress:'system/organizational/group',
                                },
                                {
                                    FGUID:'1-1-3',
                                    FMenuName:'项目信息',
                                    FMenuLevle:3,
                                    FFunctionURLAddress:'system/organizational/projectInfo',
                                }
                            ]
                        },
                        {
                            FGUID: '1-2',
                            FMenuName:'用户管理',
                            FMenuLevle:2,
                            FICONURLAddress:'icon-SZXFY-basicinformation',
                            FFunctionURLAddress:'system/user',
                            FChildMenu:[
                                {
                                    FGUID: '1-2-1',
                                    FMenuName:'用户信息',
                                    FMenuLevle:3,
                                    FFunctionURLAddress:'system/user/',
                                },
                                {
                                    FGUID: '1-2-2',
                                    FMenuName:'功能角色',
                                    FMenuLevle:3,
                                    FFunctionURLAddress:'system/user/role',
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    },
    components:{
        zwNav
    },
    created(){
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
$url:'../../../assets/image/';
.manage{
    height: 100%;
    background: url(../../../../assets/image/device/bg_1.png);
    color: #C7FEFF;
    .el-container{
        height: 100%;
        .el-header{
            line-height: 82px;
            padding: 0 52px 0 36px;
            div.l{
                img{
                    width: 34px;
                    height: 34px;
                    margin-right: 20px;
                    vertical-align: middle;
                }
                span{
                    font-size: 20px;
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
            padding-top: 30px;
            .menu{
                height: 100%;
                padding: 0 20px;
                .el-menu{
                  background: none;
                  border-right: none;
                  .el-icon-arrow-down{
                    font-size: 20px;
                    right: 10px;
                    margin-top:-10px;
                    color:#9EE5F3;

                  }
                  .el-icon-arrow-down:before{
                    content: "\e790";
                  }
                  .menu-list-1{
                    margin-top: 27px;
                    >.el-submenu{
                        >.el-submenu__title{
                          height: 66px;
                          line-height: 66px;
                          text-indent: 10px;
                          background: url(#{$url}menu-1.png) no-repeat;
                          background-size: 100% 100%;
                          padding-right: 0px;
                          .el-icon-arrow-down{
                              transform-origin: 70% 50%;
                          }
                        }

                    }
                     >.el-submenu.is-active>.el-submenu__title,>.el-submenu>.el-submenu__title:hover,>.el-submenu>.el-submenu__title:focus{
                        background: url(#{$url}menu-1-active.png) 4px no-repeat;
                        background-size: 100% 100%;
                     }
/*                     .el-submenu.is-active .el-submenu__title,.el-submenu__title:hover,.el-submenu__title:focus{
                        background: url(#{$url}menu-1-active.png) 4px no-repeat;
                        background-size: 100% 100%;
                    } */
                  }
                  .menu-list{
                      margin-top: 20px;
                  }
                  .el-submenu__title,.el-menu-item{
                    color: #C7FEFF;
                    font-size: 18px;
                    text-align: left;
                    background: url(#{$url}menu-2.png)  no-repeat;
                  }
                  .el-submenu .el-menu-item{
                    min-width: 100px;
                    background: url(#{$url}menu-2.png)  no-repeat;
                  }
                  .el-menu-item{
                    height: 45px;
                    margin-top: 20px;
                  }
                  .menu-list-children{
                    .el-submenu.is-active>.el-submenu__title,.el-submenu>.el-submenu__title:hover,
                    .el-submenu>.el-submenu__title:focus,
                    .el-menu-item.is-active,.el-menu-item:hover,.el-menu-item:focus{
                      background: url(#{$url}menu-2-active.png) no-repeat;
                    }
                  }
                }
            }
        }
        .el-main{
            /* height: 960px; */
            border:1px solid rgba(95,205,242,1);
            border-radius:10px;
            overflow: hidden;
        }
    }
}
</style>