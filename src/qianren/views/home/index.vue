<template>
    <div class="home qianren">
        <div class="header">
            <el-button v-if="$route.path !=='/' " @click="$router.back()" class="back">
                    <i class="icon el-icon-arrow-left"></i>返回
            </el-button>
            <span class="title">{{projectName}}</span>
            <ul class="clearfix">
                <li class="l icon" v-if="$route.path !=='/'">
                    <router-link :to="`/manage`"  class="icon-item">
                        <i class="iconfont icon-zs-backstage"></i>
                    </router-link>
                </li>
                <li class="l icon" @click="switchAudio">
                    <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
                </li>
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
                <!-- <set-password :show.sync='show' @confirm="changePassword"></set-password> -->
            </ul>
            <ul class="menu">
                <li class="menu-item">
                    <router-link to="/comprehensive">
                    综合态势
                    </router-link>
                </li>
                <li class="menu-item">
                    <router-link to="/systemBrowse">
                    系统态势
                    </router-link>
                </li>
                <li class="menu-item">
                    <router-link to="/ranking">
                    综合排名
                    </router-link>
                </li>
                <li class="menu-item">
                    项目导航
                </li>
            </ul>
        </div>
        <router-view>
        </router-view>
    </div>
</template>
<script>
import {setPassword} from '@/components/index.js'
import('@/assets/css/index.scss')
export default {
    data(){
        return{
            user:'caiot', //用户名
            projectName: '中物互联集团',
            isOpen:1
        }
    },
    components:{
        setPassword
    },
    watch:{
    },
    beforeCreate(){
        let {token, projectID}= this.$route.query
        if(token){
            sessionStorage.setItem('FToken',token)
            sessionStorage.setItem('inIframe',1)
        }
        if(projectID){
            sessionStorage.setItem('projectID', projectID)
        }
    },
    created(){
    },
    mounted(){

    },
    methods:{
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
        },
        /**
         * 切换声音开关
         */
        switchAudio(){
            if(this.isOpen == 1){
                this.isOpen = 0
                localStorage.setItem('open',0)
                document.getElementById('myAudio').pause()
            }else{
                this.isOpen = 1
                localStorage.setItem('open',1)
            }
        }
    }
}
</script>
<style lang="scss">
$url:'../../../assets/image/';
.home.qianren{
    padding: 2px;
    background: url('#{$url}qianren/index-bg.jpg');
    .header{
        position: relative; 
        ul.menu{
            margin-top: -60px;
            .menu-item{
                width:170px;
                height:44px;
                line-height: 44px;
                display: inline-block;
                a{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background: url(#{$url}qianren/menu-bg.png);
                    color: #84F2FF;
                    font-size:20px;
                }
                a.router-link-active{
                    background: url(#{$url}qianren/menu-active.png);
                }
            }
            .menu-item:nth-of-type(3){
                margin-left: 512px;
            }
            .menu-item:nth-of-type(4){
                background: url(#{$url}qianren/menu-bg.png);
            }
        }
    }
}
</style>
