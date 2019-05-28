<template>
    <div>
        <el-dialog class="zw-dialog set-password" :visible.sync="visible" append-to-body width="400px" title="设置密码">
            <el-form ref="form" :model="addData">
                <el-form-item label="旧密码" prop="FPassword" :rules="[{ required: true, message: '旧密码'}]">
                    <el-input type="password" v-model="addData.FPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="NewPassword" :rules="[{ required: true, message: '新密码'}]">
                    <el-input type="password" v-model="addData.NewPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repeatPassword" :rules="[{ required: true, message: '确认密码'}]">
                    <el-input type="password" v-model="addData.repeatPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setPsd()">确 定</el-button>
                <el-button @click="close()">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import md5 from 'js-md5';
export default {
    data(){
        return{
            addData:{
                FPassword:'',
                NewPassword:'',
                repeatPassword:'',
            },
        }      
    },
    watch:{
    },
    computed:{
        visible:{
            get(){
                return this.$props.show
            },
            set(val){
                this.$emit('update:show',val)
            }
        }
    },
    props:{
        show:{
            required:true,
            type:Boolean,
            default:false
        }
    },
    methods:{
        /**
         * 设置密码
         */
        async setPsd(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            if(this.addData.NewPassword !== this.addData.repeatPassword){
                console.log(this.addData);
                this.$message({
                  type:"warning",
                  message:'确认密码不一致',
                  druration:1000
                })
                return
            }
            this.$emit('confirm',md5(this.addData.NewPassword),md5(this.addData.FPassword))
/*             System({
                FAction:'UpdateTUsersPassword',
                FType:1,
                FGuid:'00000000-0000-0000-0000-000000000000',
                FPassword:md5(this.addData.FPassword),
                FNewPassword:md5(this.addData.NewPassword)
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
                
            }); */
        },
        close(){
            this.$emit('update:show',false)
        }
    }
}
</script>
<style lang="scss">
.set-password{
    .el-dialog__body{
        .el-form-item__error{
            left: 50%;
            transform: translateX(-50%)
        }
    }
}
</style>
