<template>
  <div class="scree_fix">
    <div class="login_center">
      <div class="loginBoll_re Rotation"></div>
      <div class="l_pay_item">
        <div
          style="width: 605px; height: 615px;margin:45px 0px 0px 143px; position: relative;"
          class="radar"
        ></div>
      </div>

      <div class="login_item">
        <div class="title">
            <img src="../../assets/images/logo_1.png" />
        </div>
        <div class="lcen">
          <h1>用户登录</h1>
          <el-form
            :model="user"
            status-icon
            ref="form"
            label-width="0px"
            class="demo-ruleForm login_box"
          >
            <p class="ng_name"></p>
            <p class="ng_pw"></p>
            <el-form-item label prop="userName" :rules="[{ required: true, message: '请输入用户名'}]">
              <el-input type="text" v-model="user.userName"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label prop="password" :rules="[{ required: true, message: '请输入密码'}]">
              <el-input type="password" v-model="user.password"  auto-complete="off"></el-input>
            </el-form-item>
            <div class="stoage">
              <span
                class="s-a"
                :class="{'active0':isActive==0,'active1':isActive==1}"
                @click="isActive = !isActive"
              ></span>
              <span class="s-b">记住用户名和密码</span>
            </div>
            <div class="btn_go">
              <a href="javascript:;" style="outline: none;" @click="login()">登 录</a>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div
      class="set_ICP"
      style="position: absolute; height: 25px; text-align: center; left: 0; bottom:60px; right: 0; font-size: 22px;"
    >
      <a href="http://www.miitbeian.gov.cn" :target="_self" style="color: #fff;">粤ICP备18129652号</a>
    </div>
  </div>
</template>
<script>
import { Login } from "@/qianren/request/api.js";
import Md5 from "js-md5";
export default {
  data() {
    return {
      isActive: 1,
      user: {
        userName: "",
        password: "",
      },
    };
  },
  components: {},
  created() {
    document.onkeydown = e => {
      let event = window.event || e;
      let _key = event.keyCode;
      if (_key === 13) {
        this.login();
      }
    };
    this.user.userName = localStorage.getItem("userName")||'';
    this.user.password = localStorage.getItem("password")||'';
  },
  methods: {
    async login() {
        await new Promise(resolve => {
            this.$refs.form.validate((valid) => {
              if (valid) {
                  resolve()
              } 
            });
        })
        Login({
          FUserName: this.user.userName,
          FPassword: this.user.password,
          TerminalType: "PC"
        })
          .then(data => {
            sessionStorage.setItem("FToken", data.FObject.FTokenID);
            sessionStorage.setItem("FContacts", data.FObject.FContacts);
            sessionStorage.setItem("FUserType", data.FObject.FUserType)
            sessionStorage.setItem("FGroupName",data.FObject.FGroupName)
            sessionStorage.setItem(
              "projectList",
              JSON.stringify(data.FObject.Project)
            );
            this.$store.state.projectList = data.FObject.Project;
            this.$store.state.token = data.FObject.FToken;
            if (this.isActive) {
              localStorage.setItem("userName", this.user.userName);
              localStorage.setItem("password", this.user.password);
            }
            this.$router.push("/");
          })
          .catch(err => {
            if (err.Result == 103) {
              this.$message.error("密码或用户名错误!");
            } else {
              this.$message.error("未知错误，请联系管理员!");
            }
          });
    }
  }
};
</script>
<style lang="scss">
$url:'../../assets/images/';
/*雷达*/
.radar {
  width: 75vw;
  height: 75vw;
  max-height: 75vh;
  max-width: 75vh;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  overflow: hidden;
}
.radar:before {
}
.radar:after {
  content: " ";
  display: block;
  background-image: linear-gradient(
    44deg,
    rgba(0, 255, 51, 0) 50%,
    #0099cc 100%
  );
  width: 50%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: radar-beam 5s infinite;
  animation-timing-function: linear;
  transform-origin: bottom right;
  border-radius: 100% 0 0 0;
}

@keyframes radar-beam {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes blips {
  14% {
    background: radial-gradient(
      2vmin circle at 75% 70%,
      #ffffff 10%,
      #20ff4d 30%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  14.0002% {
    background: radial-gradient(
        2vmin circle at 75% 70%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 63% 72%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      );
  }
  25% {
    background: radial-gradient(
        2vmin circle at 75% 70%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 63% 72%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 56% 86%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      );
  }
  26% {
    background: radial-gradient(
        2vmin circle at 75% 70%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 63% 72%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 56% 86%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      );
    opacity: 1;
  }
  100% {
    background: radial-gradient(
        2vmin circle at 75% 70%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 63% 72%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        2vmin circle at 56% 86%,
        #ffffff 10%,
        #20ff4d 30%,
        rgba(255, 255, 255, 0) 100%
      );
    opacity: 0;
  }
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

.Rotation {
  -webkit-transform: rotate(360deg);
  animation: rotation 16s linear infinite;
  -moz-animation: rotation 16s linear infinite;
  -webkit-animation: rotation 16s linear infinite;
  -o-animation: rotation 16s linear infinite;
}

/*enf of 雷达*/

.loginBoll_re {
  width: 590px;
  height: 610px;
  position: absolute;
  top: 175px;
  left: 328px;
  background: url(#{$url}circle_1.png);
}

.el-input__suffix {
  height: 100%;
  /* top: 15px; */
  line-height: 50px;
  -webkit-transition: all 0.3s;
  color: #c0c4cc;
  text-align: center;
}

.l_pay_item {
  position: absolute;
  top: 0;
  left: 0;
  width: 960px;
  height: 880px; /*background: url(/static/image/user/bgicon3.png) no-repeat */
}

.login_box {
  position: relative;
}
.login_box input {
  height: 76px;
  border: solid 1px #3fb0fe;
  background: #15388c;
  padding-left: 60px;
  color: #c5cfd9;
}
.login_box .ng_name {
  width: 27px;
  height: 27px;
  position: absolute;
  top: 23px;
  left: 18px;
  background: url(#{$url}icon_2.png) no-repeat;
  z-index: 55;
}
.login_box .ng_pw {
  width: 27px;
  height: 33px;
  position: absolute;
  top: 130px;
  left: 18px;
  background: url(#{$url}icon_1.png) no-repeat 0 0;
  z-index: 55;
}
.login_box .el-form-item {
  margin-bottom: 32px;
}
.login_box .el-input__inner {
  border-radius: 0;
}
.login_box .el-form-item__content {
  text-align: left;
}
.login_box .btn_sumit {
  padding: 23px 155px;
  font-size: 30px;
  border-radius: 0;
}
.login_box .el-button--primary {
  background-color: #0ba5ff;
}
.login_box .el-form-item__error {
  padding-top: 12px;
}
.login_box .el-input {
  font-size: 25px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$url:'../../assets/images/';
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.scree_fix {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(#{$url}bg_02.jpg);
  background-size: 100% 100%;
  min-width: 1900px;
  min-height: 1080px;
}
.login_center {
  width: 1900px;
  height: 1080px;
  margin: 0 auto;
  position: relative;
}
.login_item {
  width: 627px;
  height: 567px;
  float: right;
  position: absolute;
  top: 184px;
  right: 86px;
}
.login_item .title {
  margin-bottom: 15px;
}
.login_item .lcen {
  width: 488px;
  padding: 0 83px;
  height: 485px;
  background: url(#{$url}bg_blue_restangle.png);
}
.login_item .lcen h1 {
  font-size: 30px;
  color: #3aaffc;
  padding: 30px 0 26px 0;
}
.login_item .lcen .name {
  height: 76px;
  border: solid 1px #3fb0fe;
}
.login_item .lcen .passw {
  height: 76px;
  border: solid 1px #3fb0fe;
  margin: 26px 0 42px;
}

.login_item .lcen .name .name-label,
.login_item .lcen .passw .name-label {
  width: 41px;
  height: 42px;
  display: block;
  float: left;
  margin: 23px 0 0 20px;
}

.login_item .lcen .name ._uname {
  /* background: url(/static/image/user/icon_2.png) no-repeat 0 0; */
}

.login_item .lcen .passw ._uname {
  /* background: url(/static/image/user/icon_1.png) no-repeat 0 0; */
}

.login_item .lcen .name .itemsy,
.login_item .lcen .passw .itemsy {
  height: 28px;
  line-height: 28px;
  width: 379px;
  padding: 24px 5px 5px 5px;
  border: 0 none;
  font-size: 26px;
  color: #c5cfd9;
  background: no-repeat;
  border: none;
}

.stoage {
  height: 30px;
  text-align: left;
  line-height: 30px;
}
.stoage span.s-b {
  display: inline-block;
  float: left;
  font-size: 22px;
  padding: 0 0 0 12px;
  color: #c5cfd9;
  margin-top: -2px;
}
.stoage span.s-a {
  width: 27px;
  height: 27px;
  display: inline-block; /* border: solid 1px #3fb0fe; */
  float: left;
  cursor: pointer;
}
.stoage span.active0 {
  background: url(#{$url}button_nor_1.png);
}
.stoage span.active1 {
  background: url(#{$url}button_sel_1.png);
}
.btn_go {
  width: 100%;
  height: 78px;
  margin-top: 22px;
  line-height: 78px;
  font-size: 30px;
  color: #fff;
  text-align: center;
  display: block;

  cursor: pointer;
}

.btn_go a {
  color: #fff;
  background: #25a7f6;
  display: block;
}
.btn_go a:active {
  background: #016ead;
}
::-moz-placeholder {
  color: #c5cfd9;
}
::-webkit-input-placeholder {
  color: #c5cfd9;
}
:-ms-input-placeholder {
  color: #c5cfd9;
}
</style>
