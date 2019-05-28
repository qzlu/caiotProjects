<template>
    <div class="home cloud">
        <div class="header">
            <el-button v-if="$route.path.match(/deviceDetaile/ig)" class="back">
                <router-link to="/indexItem">
                    <i class="icon el-icon-arrow-left"></i>返回
                </router-link>
            </el-button>
            <span class="title">{{projectName}}数字应急云平台</span>
            <ul class="clearfix">
                <li  class="l icon" v-if="$route.path !=='/'">
                    <router-link to='/'>
                        <i class="iconfont icon-ZS-bloc"></i>
                    </router-link>
                </li>
<!--                 <li class="l icon" v-if="$route.path !=='/'">
                    <router-link to="/indexItem" :exact ='false' class="icon-item">
                        <i class="iconfont icon-zs-backstage"></i>
                    </router-link>
                </li> -->
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
        <router-view>

        </router-view>
    </div>
</template>
<script>
import {setPassword} from '@/components/index.js'
import {System} from '@/shuziYy/request/api.js'
import '@/assets/css/index.scss'
export default {
    data(){
        return{
            show:false
        }
    },
    components:{
        setPassword
    },
    computed:{
        user(){
            return sessionStorage.getItem('FContacts')
        },
        projectName(){
            return  this.$route.path !== '/' ? sessionStorage.getItem('projectName') : '中物互联'
        }
    },
    watch:{

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
        }
    }
}
</script>
<style lang="scss">
    $url:'../../../assets/image/cloud/index/';
    .home.cloud{
        padding: 2px;
        background: url('#{$url}bg_img.jpg');
        .info-window{
            margin-bottom: 10px;
            margin-left: 16px;
            color: #5fbef9;
            ul{
                li{
                  max-width: 400px;
                  height: 24px;
                  line-height: 24px;
                  margin-top: 10px;
                  white-space: nowrap;
                }
            }
        }
    }
</style>
