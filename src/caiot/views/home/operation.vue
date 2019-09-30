<template>
    <div class="header-operation">
        <ul class="r clearfix">
          <li class="l project-list">
            <el-select v-model="project" @change="selectProject">
              <el-option
                v-for="item in projectList"
                :key="item.ProjectID"
                :label="item.ShortName||0"
                :value="item.ProjectID">
              </el-option>
            </el-select>
          </li>
          <slot></slot>
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
          <li class="l user-name" :title="user">{{user}}</li>
        </ul>
        <el-dialog title="修改密码" :visible.sync="show" class="change-password zw-dialog">
          <el-form :model="changePassWord" ref="form">
            <el-form-item label="账号" prop="InspectionPointName">
              <el-input :value="userName"  readonly></el-input>
            </el-form-item>
            <el-form-item label="旧密码" prop="FPassword" :rules="[{ required: true, message: '请输入旧密码'}]">
              <el-input v-model="changePassWord.FPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="FNewPassword"
              :rules="[{ required: true, message: '请输入新密码'}]"
            >
              <el-input v-model="changePassWord.FNewPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="repeatPassword"
              :rules="[{ required: true, message: '请确认密码'}]"
            >
              <el-input v-model="changePassWord.repeatPassword" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div class="submit">
            <button class="zw-btn zw-btn-primary" @click="updatedPassword()">确定</button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            project: Number(localStorage.getItem("projectid")),
            user: localStorage.getItem("FUserNickname"), //昵称
            userName:localStorage.getItem("iuserName"), //账号
            show: false,
            changePassWord: {
              FPassword: null,
              FNewPassword: null,
              repeatPassword: null
            },
        }
    },
    computed: {
      projectList() {
        let projectID = localStorage.getItem("projectid");
        if (projectID > 0 && this.inIframe == 1) { 
          let projectList = this.$store.state.projectList.filter(
            item => item.ProjectID == projectID
          );
          return projectList;
        } else {
          return this.$store.state.projectList;
        }
      }
    },
    created(){
        this.$store.commit("getProject");
    },
    methods:{
        /**
         * 退出
         */
        logOut() {
          this.$router.push({ path: "/login" });
        },
        /**
         * 选择项目时
         */
        selectProject(projectID){
          let project = this.projectList.find(item => item.ProjectID == projectID)
          localStorage.setItem("projectid", project.ProjectID);
          localStorage.setItem("projectname", project.ShortName);
          location.reload();
        },
        beforeUpdatedPassword() {
          this.show = true;
          Object.keys(this.changePassWord).forEach(item => {
            this.changePassWord[item] = null;
          });
        },
        async updatedPassword() {
          await new Promise(resolve => {
            this.$refs.form.validate(valid => {
              if (valid) {
                resolve();
              }
            });
          });
          if (
            this.changePassWord.FNewPassword !== this.changePassWord.repeatPassword
          ) {
            this.$message({
              type: "warning",
              message: "重复密码不一致",
              druration: 1000
            });
            return;
          }
          system({
            FAction: "UpdateTUsersPassword",
            FPassword: this.changePassWord.FPassword,
            FNewPassword: this.changePassWord.FNewPassword,
            FType: 3
          })
            .then(data => {
              this.show = false;
              this.$message({
                type: "success",
                message: "密码修改成功,3秒后退出登录",
                druration: 1000
              });
              setTimeout(() => {
                this.logOut();
              }, 3000);
            })
            .catch(err => {});
        }
    }
}
</script>
<style lang="scss">
.header-operation{
      ul.clearfix{
        position: absolute;
        top: 54px;
        right: 10px;
        line-height: 36px;
        li.icon{
            width:36px;
            height:36px;
            background:rgba(84,177,221,0.32);
            border-radius:50%;
            box-shadow:  0 0 14px rgba(84,177,221,0.82);
            cursor: pointer;
            i[class^="icon"]{
                font-size:24px;
                color:rgba(132, 192, 255, 1);
            }
        }
        li.user-name{
          width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size:16px;
          font-family:MicrosoftYaHeiUI;
          font-weight:bold;
          color:rgba(132, 192, 255, 1);
        }
        li+li{
            margin-left: 14px;
        }
        li.project-list{
          width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .el-select{
            .el-input{
              &__inner{
                text-align: right;
                border:none;
                font-size: 16px;
                background: none;
                color: rgba(132, 192, 255, 1)
              }
            }
            .el-icon-arrow-up{
              font-size: 20px;
              color: #9EE5F3
            }
            .el-icon-arrow-up:before{
             content: "\E78F";
            }
          }
        }
      }
}
</style>