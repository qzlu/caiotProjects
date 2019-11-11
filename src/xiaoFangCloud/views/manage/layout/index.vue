<template>
    <el-container class="home" style="height:100%;padding: 10px;">
      <el-aside width="200px">
        <div class="app-logo">
            <router-link to="/">
                <img src="../../../../assets/image/shuziYy/logo2.png" alt="">
            </router-link>
        </div>
        <div class="project-list">
            <el-select v-model="project" value-key='ProjectID' placeholder="请选择" @change="select">
              <el-option
                v-for="item in projectList"
                :key="item.ProjectID"
                :label="item.ProjectName||0"
                :value="item">
              </el-option>
            </el-select>
        </div>
        <div style="height:780px;">
            <el-scrollbar>
                <el-menu unique-opened :default-active="$route.path" router>
                  <zw-nav :menus="menus">
                  </zw-nav>
                </el-menu>
            </el-scrollbar>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header" height='154px'>
            <div class="clearfix">
                <h2>{{project.ProjectName}}后台管理系统</h2>
                <ul class="r clearfix">
                    <li class="l icon">
                        <el-dropdown>
                          <div class="el-dropdown-link icon-item">
                            <i class="iconfont icon-User"></i>
                          </div>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="show = true">设置密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </li>
                    <li class="l user-name">{{user}}</li>
                    <set-password :show.sync='show' @confirm="changePassword"></set-password>
                </ul>
            </div>
            <el-scrollbar class="horizental-scrollbar">
              <ul class="route-list">
                  <li>
                      <router-link to="/manage/alarmList">
                          告警列表
                      </router-link>
                  </li>
                  <li v-for="(route,i) in routeList" :key="route.FGUID">
                      <router-link :to="`/manage/${route.FFunctionURLAddress}`">
                           {{route.FMenuName}}
                      </router-link>
                      <i class="el-icon-circle-close" @click="deleteRoute(i)"></i>
                  </li>
              </ul>
            </el-scrollbar>
        </el-header>
        <el-main>
            <router-view :id='project.ProjectID'>
            </router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
import {System} from '@/xiaoFangCloud/request/api.js'
import {setPassword} from '@/components/index.js'
import zwNav from './nav.vue'
export default {
    data(){
      return{
        show:false,
        menus:[
        ],
        project:{},
      }
    },
    components:{
      zwNav,
      setPassword
    },
    computed:{
        user(){
            return sessionStorage.getItem('FContacts')
        },
        routeList(){
            return this.$store.state.routeList
        },
        projectList(){
          if(this.$store.state.projectList.length === 0) return []
          let projectID = sessionStorage.getItem('projectID') ||this.$store.state.projectList[0].ProjectID
          if(!sessionStorage.getItem('projectID')){
            sessionStorage.setItem('projectID',projectID)
          }
          this.project = this.$store.state.projectList.find(item => item.ProjectID == projectID) || this.$store.state.projectList[0]
          return this.$store.state.projectList
        }
        
    },
    created(){
        this.getMenus()
        this.$store.dispatch('querySForm')
    },
    mounted(){
    },
    methods:{
        /**
         * 获取菜单
         */
        getMenus(){
            System({
                FAction:'QuerySystemUsersMenu'
            })
            .then((data) => {
                this.menus = data.FObject
            }).catch((err) => {

            });
        },
        select(item){
          this.project = item
          sessionStorage.setItem('projectID',item.ProjectID)
          location.reload()
        },
        deleteRoute(index){
            let isActive = false
            if(`/manage/${this.routeList[index].FFunctionURLAddress}` == this.$route.path){
              isActive = true
            }
            this.$store.dispatch('deleteRoute',index)
            if(isActive){
              let  route= this.routeList[index-1]
              this.$router.push(`/manage/${route?route.FFunctionURLAddress:'alarmList'}`)
            }

        },
        logOut(){
            this.$router.push('/login')
        },
        changePassword(newPsd,oldPsd){
            System({
                FAction:'UpadatePassword',
                NewFPassword:newPsd,
                FPassword:oldPsd
            })
            .then((data) => {
                this.$message({
                  type:"success",
                  message:'密码修改成功,3秒后退出登录',
                  druration:1000
                })
                setTimeout(() => {
                  this.$router.push('/login')
                },3000)
            }).catch((err) => {
                
            });
        }
    },
    beforeDestroy(){
      this.$store.dispatch('clearRoute')
    }
}
</script>
<style lang="scss">
$url:'../../../../assets/image/';
.el-container{
  background: url(#{$url}device/bg_1.png);
  .app-logo{
    height: 106px;
    line-height: 106px;
    margin-top: 50px;
    margin-bottom: 30px;
    background: rgba(0, 40, 77, 1);
    font-size: white;
    color: white;
  }
  .project-list{
      margin-bottom: 23px;
      .el-select{
          .el-input__inner{
              background: none;
              color: #9EE5F3;
              font-size:18px;
              border:none;
              text-align: left;
          }
          .el-icon-arrow-up{
            font-size: 20px;
            color: #9EE5F3
          }
          .el-icon-arrow-up:before{
            content: "\e78f";
          }
      }
      
  }
  .el-menu{
    background: none;
    border-right: none;
    .menu-list-1{
      margin-top: 27px;
      .el-submenu__title{
        height: 66px;
        line-height: 66px;
        text-indent: 10px;
        background: url(#{$url}nav/leftbar_bg_nor_blue_1.png) no-repeat;
        background-size: 100% 100%;
      }
      .el-submenu.is-active .el-submenu__title,.el-submenu__title:hover,.el-submenu__title:focus{
          background: url(#{$url}nav/leftbar_bg_sel_yellow_1.png) 4px no-repeat;
      }
    }
    .el-submenu__title,.el-menu-item{
      color: #48B3C8;
      font-size: 18px;
      text-align: left;
    }
    .el-submenu .el-menu-item{
      min-width: 100px;
      background: url(#{$url}nav/leftbar_bg_nor_blue.png)  no-repeat;
    }
    .el-menu-item{
      height: 45px;
      margin-top: 20px;
    }
    .el-menu-item.is-active,.el-menu-item:hover,.el-menu-item:focus{
      background: url(#{$url}nav/leftbar_bg_sel_yellow_2.png) no-repeat;
    }
    .el-icon-arrow-down{
      font-size: 20px;
      right: 28px;
      color:#9EE5F3;
      transform-origin: 70% 50%;
    }
    .el-icon-arrow-down:before{
      content: "\e790";
    }
  }
  .el-header{
      position: relative;
      >div.clearfix{
        margin-top: 28px;
        font-size:26px;
        h2{
          text-align: left;
        }
      }
      .horizental-scrollbar{
        width: 100%;
        height: 60px;
        top:34px;
        .el-scrollbar__wrap{
          text-align: left;
          .el-scrollbar__view{
            display: inline-block;
          }
        }
      }
      .route-list{
          position: static;
          padding-left: 20px;
          box-sizing: border-box;
          white-space: nowrap;
          text-align: left;
          li{
            width: 163px;
            height: 45px;
            line-height: 45px;
            display: inline-block;
            position: relative;
            white-space: nowrap;
            .el-icon-circle-close{
                position: absolute;
                top: 4px;
                right: 20px;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            a{
                display: inline-block;
                width: 100%;
                height: 100%;
                padding:  0 10px;
                box-sizing: border-box;
                text-align: center;
                background: url(#{$url}nav/nav_bg_nor_blue.png) no-repeat;
                color: #fff;
            }
            a.router-link-active{
                border-color: #b6cd61;
                background: url(#{$url}nav/nav_bg_sel_yellow.png) no-repeat;
            }
          }
          li+li{
            margin-left: 10px;
          }
      }
  }
  .el-main{
    background: url(#{$url}device/bg_2.png);
    background-size: 100% 100%;
    height: 906px;
    .report{
        background: none;
    }
  }
}

</style>
