<template>
    <div class="system-manage">
        <ul class="nav">
            <li><router-link to="/system/projectManage" > <i class="iconfont icon-ZS-Projectmanagement"></i><span>项目管理</span></router-link></li>
            <li><router-link to="/system/fireManage"> <i class="iconfont icon-Alarm"></i><span>告警管理</span></router-link></li>
            <li><router-link to="/system/systemMange"> <i class="iconfont icon-ZS-Systemmanagement"></i><span>系统管理</span></router-link></li>
            <li class="r" style="margin-top:40px;">
                <el-dropdown style="left:50px;">
                  <div class="el-dropdown-link" style=";width:44px;height:44px;line-height:36px;background:rgba(84,177,221,0.32);border-radius:50%;box-shadow:  0 0 14px rgba(84,177,221,0.42);">
                    <i class="iconfont icon-User" style="font-size:30px;color:#54B1DD;position:relative;left:6px;"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="show1 = true">设置密码</el-dropdown-item>
                    <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </li>
        </ul>
        <set-password :show.sync="show1"></set-password>
        <router-view>
        </router-view>
    </div>
</template>
<script>
import {setPassword} from '@/components/index.js';
export default {
    data(){
        return{
            show1:false
        }
    },
    components: {
      setPassword
    },
    methods:{
        loginOut(){
            this.$router.push('/login')
        }
    }
    
}
</script>
<style lang="scss">
$img-url:'../../../assets/image/';
.system-manage{
    height: 100%;
    background: url(#{$img-url}device/bg_1.png);
    color: #48B3C8;
    a{
      color: #48B3C8;
    }
    .nav{
        width: 100%;
        height: 110px;
        line-height: 110px;
        box-sizing: border-box;
        padding-left: 256px;
        text-align: left;
        li{
            width: 166px;
            height: 52px;
            line-height: 42px;
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            a{
                display: inline-block;
                width: 100%;
                height: 100%;
                text-align: center;
                border: 2px solid;
                border-radius: 4px;
                color: #FFFFFF
            }
            a.router-link-active{
                border-color: #b6cd61;   
                background:linear-gradient(to right,#5c5712,#9e942f,#5c5712)
            }
            i{
                position: relative;
                top: 4px;
                font-size: 30px;
                margin-right: 11px;
            }
        }
        li+li{
            margin-left: 122px;
        }
    }
}
</style>