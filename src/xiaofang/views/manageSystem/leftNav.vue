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
        }
        a.router-link-exact-active.router-link-active{
            background:linear-gradient(90deg,rgba(255,228,0,0.2),rgba(255,228,0,0.48),rgba(255,228,0,0.2));
        }
    }
}
.project-manage{
    width: 1695px;
    height: 953px;
    margin-left: 210px;
}
</style>