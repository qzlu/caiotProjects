<template>
    <div>
        <div class="l clearfix">
            <div class="app-logo">
                <router-link to="/">
                    <img src="../../../assets/image/logo.png" alt="">
                </router-link>
            </div>
            <slot></slot>
        </div>
        <div class="project-manage">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    computed:{
    },
    mounted() {
    },
}
</script>
<style lang="scss">
.app-logo{
    text-align: left;
    padding-left: 60px;
    margin-top: -60px;
}
.nav-left{
    width: 209px;
    height: 100%;
    box-sizing: border-box;
    margin-top: 28px;
    padding-left: 20px;
    font-size: 18px;
    li{
        width:163px;
        height:45px;
        line-height: 45px;
        margin-top: 20px;
        cursor: pointer;
        a{
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #FFFFFF
        }
        a.router-link-exact-active.router-link-active{
            background:linear-gradient(to right,rgba(159,144,20,0.13),rgba(255,247,24,0.33),rgba(255,247,24,0.33),rgba(255,247,24,0.33),rgba(159,144,20,0.13));
        }
    }
}
.project-manage{
    width: 1695px;
    height: 953px;
    margin-left: 210px;
    box-sizing: border-box;
    padding: 20px;
    background: url(../../../assets/image/device/bg_2.png);
}
</style>