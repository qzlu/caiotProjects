<template>
    <div>
        <div class="no-allowed">
            <p>槽糕~您的账号未开通权限，请联系管理员</p>
            <el-button type="primary" round><a :href="link">返回主平台</a></el-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            link:sessionStorage.getItem('link')
        }
    },
    created() {
        let {link} = this.$route.query
        this.link = link+this.$route.hash
    },
}
</script>
<style lang="scss">
    .no-allowed{
        font-size: 20px;
        margin-top: 200px;
        p{
            margin-bottom: 20px;
        }
        .el-button{
            font-size: 20px;
            span,a{
                display: block;
                width: 100%;
                height: 100%;
            }
            a{
                color: white;
            }
        }
    }
</style>