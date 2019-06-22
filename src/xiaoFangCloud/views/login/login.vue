<template>
    <div class="login">
        <div class="login-box">
            <h2>欢迎登录</h2>
            <zw-card class="login-item" :width='456' :height='73' :cornerWidth='17' :cornerHeight='14' :borderWidth='1'>
                <el-input v-model="userName" clearable  @focus="nameErr = ''"><i slot="prefix" class=" iconfont icon-mine"></i></el-input>
            </zw-card>
            <p>{{nameErr}}</p>
            <zw-card class="login-item" :width='456' :height='73' :cornerWidth='17' :cornerHeight='14' :borderWidth='1'>
                <el-input type="password" clearable  v-model="password" @focus="passwordErr = ''"><i slot="prefix" class="iconfont icon-Lock"></i></el-input>
            </zw-card>
            <p>{{passwordErr}}</p>
            <div class="login-item" style="text-align:left">
                <el-checkbox v-model="loginState">
                    记住账号和密码
                </el-checkbox>
            </div>
            <el-button class="login-item" type="primary" @click="login" >登　录</el-button>
        </div>
    </div>
</template>
<script>
import {zwCard} from '@/components/index.js';
import {Login} from '@/xiaoFangCloud/request/api.js'
import Md5 from 'js-md5'
export default {
    data(){
        return{
            userName:'',
            password:'',
            loginState:true,
            nameErr:'',
            passwordErr:''
        }
    },
    components: {
      zwCard
    },
    created(){
        document.onkeydown = e =>
         {
          let event = window.event||e
          let _key = event.keyCode;
          if (_key === 13) {
              this.login()
          }
        };
        this.userName = localStorage.getItem('userName')
        this.password = localStorage.getItem('password')
    },
    methods:{
        login(){
            if(this.userName == ''){
                this.nameErr = '请输入用户名'
            }
            if(this.password == ''){
                this.passwordErr = '请输入密码'
            }
            if(this.userName != ''&&this.password != ''){
                Login({
                    FAction:'Login',
                    FUserName:this.userName,
                    FPassword:Md5(this.password),
                    TerminalType:'PC'
                })
                .then((data) => {
                    sessionStorage.setItem('FToken',data.FObject.FToken)
                    sessionStorage.setItem('FContacts',data.FObject.FContacts)
                    sessionStorage.setItem('projectList',JSON.stringify(data.FObject.Project))
                    this.$store.state.projectList = data.FObject.Project
                    this.$store.state.token = data.FObject.FToken
                    if(this.loginState){
                        localStorage.setItem('userName',this.userName)
                        localStorage.setItem('password',this.password)
                    }
                    this.$router.push('/')
                }).catch((err) => {
                    console.log(err);
                    if(err.Result == 103){
                        this.passwordErr = '用户名或密码错误'
                    }else{
                        this.passwordErr = '未知错误，请联系管理员'
                    }
                });
            }
        },
    }
}
</script>
<style lang="scss">
$img-url:'../../../assets/image/';
.login{
    width: 100%;
    height: 100%;
    background: url(#{$img-url}shuziYy/login.jpg);
    position: relative;
    &-box{
        width: 651px;
        height: 498px;
        position: absolute;
        top: 313px;
        right: 70px;
        background: url(#{$img-url}login/bg_2.png);
        h2{
            margin: 29px 0;
            font-size:31px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(55,155,226,1);
        }
        .login-item{
            width: 456px;
            margin: 0px auto;
            .el-input{
                &__inner{
                    width: 456px;
                    height: 73px;
                    background: #1A3E7D!important;
                    font-size: 26px;
                    border:none;
                    padding-left: 40px;
                    color: white
                }
                i{
                    line-height: 73px;
                    font-size: 26px;
                    color: #9AC8ED
                }
            }
        }
        .login-item.el-button{
            height: 78px;
            margin-top: 34px;
            font-size: 28px;
        }
        p{
            height: 34px;
            line-height: 34px;
            font-size: 12px;
            color: #f56c6c;
        }
    }
    input:-internal-autofill-previewed,
    input:-internal-autofill-selected,{
        -webkit-box-shadow: 0 0 0 1000px #1A3E7D inset !important;
        background-color: #1A3E7D!important;
        background-image: none;
        color: white!important
    }
    input:-webkit-autofill, 
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active { 
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
    }

}
</style>
