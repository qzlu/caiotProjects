<template>
    <div :class="['home','cloud',{inIframe}]" style="position:relative">
        <audio id="myAudio" autoplay="false">
            <source src="@/assets/audio/new_warn.mp3" type="audio/mpeg">
        </audio>
        <div class="header" v-if="inIframe != 1">
            <el-button v-if="$route.path !=='/' " @click="$router.back()" class="back">
                    <i class="icon el-icon-arrow-left"></i>返回
            </el-button>
            <span class="title">{{projectName}}</span>
            <ul class="clearfix">
                <li  class="l icon" v-if="$route.path !=='/'">
                    <router-link to='/'>
                        <i class="iconfont icon-ZS-bloc"></i>
                    </router-link>
                </li>
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
                <set-password :show.sync='show' @confirm="changePassword"></set-password>
            </ul>
        </div>
        <router-view :isOpen = 'isOpen'>

        </router-view>
    </div>
</template>
<script>
import {setPassword} from '@/components/index.js'
import {System} from '@/xiaoFangCloud/request/api.js'
import '@/assets/css/index.scss'
export default {
    data(){
        return{
            show:false,
            isOpen:localStorage.getItem('open')||1,
            formList:['','数字消防云平台','数字电梯云平台','数字充电桩云平台','数字有限空间云平台'],
            inIframe:sessionStorage.getItem('inIframe')
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
            let name
            if(this.$route.path === '/'){
                name = '中物互联数字应急云平台'
            }else if(this.$route.params.formID&&(this.$route.path.match(/indexItem/)||this.$route.path.match(/deviceDetaile/))){
                name = sessionStorage.getItem('projectName') + this.formList[this.$route.params.formID]
            }else if(this.$route.params.formID){
                name = '中物互联' + this.formList[this.$route.params.formID]
            }
            return  name
        },
        formID(){
            return this.$route.params.formID||0
        }
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
    $url:'../../assets/image/cloud/index/';
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
    .home.cloud.inIframe{
        padding-top: 84px;
        background: url('#{$url}bg_1.jpg');
    }
</style>
