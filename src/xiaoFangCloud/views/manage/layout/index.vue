<template>
    <el-container class="home" style="height:100%;padding: 10px;">
      <el-aside width="200px">
        <div class="app-logo">
            <router-link to="/">
                <img src="../../../../assets/image/shuziYy/logo.png" alt="">
            </router-link>
        </div>
        <div class="project-list">
            <el-select v-model="project" value-key='ProjectID' placeholder="请选择" @change="select">
              <el-option
                v-for="item in projectList"
                :key="item.ProjectID"
                :label="item.ProjectName"
                :value="item">
              </el-option>
            </el-select>
        </div>
        <div style="height:800px;">
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
            <ul class="route-list">
                <li v-for="(route,i) in routeList" :key="route.FGUID">
                    <i class="el-icon-circle-close" @click="deleteRoute(i)"></i>
                    <router-link :to="`/manage/${route.FFunctionURLAddress}`">
                         {{route.FMenuName}}
                    </router-link>
                </li>
            </ul>
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
          this.project = JSON.parse(sessionStorage.getItem('project')) || this.$store.state.projectList[0]
          return this.$store.state.projectList
        }
        
    },
    created(){
        this.getMenus()
        this.getSystemList()
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
          sessionStorage.setItem('project',JSON.stringify(item))
          windows.reload()
        },
        getSystemList(){
          System({
            FAction:'GetSystemParam'
          })
          .then((data) => {
            console.log(data)
          }).catch((err) => {
            
          });
        },
        deleteRoute(index){
            this.$store.dispatch('deleteRoute',index)
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
      .el-select{
          .el-input__inner{
              background: none;
              color: white;
              border:none;
              text-align: center;
          }
      }
  }
  .el-menu{
    background: none;
    border-right: none;
    i{
      color: white;
    }
    .el-submenu__title,.el-menu-item{
      color:white;
      font-size: 18px;
      text-align: left;
    }
    .el-submenu__title:hover,.el-menu-item:hover,.el-submenu__title:focus,.el-menu-item:focus{
        background: linear-gradient(90deg,rgba(159,144,20,.13),rgba(255,247,24,.33),rgba(255,247,24,.33),rgba(255,247,24,.33),rgba(159,144,20,.13));
    }
    .el-menu-item.is-active{
        background: linear-gradient(90deg,rgba(159,144,20,.13),rgba(255,247,24,.33),rgba(255,247,24,.33),rgba(255,247,24,.33),rgba(159,144,20,.13));
    }
    
  }
  .header{
      position: relative;
      >div.clearfix{
        margin-top: 28px;
        font-size:26px;
        h2{
          text-align: left;
        }
      }
      .route-list{
          width: 100%;
          padding-left: 20px;
          box-sizing: border-box;
          top:110px;
          bottom: 0;
          left: 0;
          display: flex;
          li{
            height: 32px;
            line-height: 32px;
            position: relative;
            white-space: nowrap;
            .el-icon-circle-close{
                position: absolute;
                top: -14px;
                right: -14px;
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
                border: 2px solid;
                border-radius: 4px;
                color: #fff;
            }
            a.router-link-active{
                border-color: #b6cd61;
                background: -webkit-gradient(linear,left top,right top,from(#5c5712),color-stop(#9e942f),to(#5c5712));
                background: linear-gradient(90deg,#5c5712,#9e942f,#5c5712);
            }
          }
      }
  }
  .el-main{
    background: url(#{$url}device/bg_2.png);
    background-size: 100% 100%;
    .report{
        background: none;
    }
  }
}

</style>
