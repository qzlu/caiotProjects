<template>
    <div class="shuzi-yy">
        <login></login>
    </div>
</template>
<script>
import Login from '@/xiaoFangCloud/views/login/login.vue'
export default {
    data(){
        return{
        }
    },
    components:{
        Login
    }
}
</script>
<style lang="scss">
.shuzi-yy{
    height: 100%;
    .login{
        background: url(../../../assets/image/shuziYy/login.jpg);
    }
}
</style>
