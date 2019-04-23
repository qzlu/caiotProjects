<template>
    <div>
        <left-nav>
            <ul class="nav-left">
                <li><router-link to="/system/projectManage/deviceManage" ><span>设备管理</span></router-link></li>
                <li><router-link to="/system/projectManage/buildingManage"><span>楼宇管理</span></router-link></li>
                <li><router-link to="/system/projectManage/project"><span>项目信息</span></router-link></li>
            </ul>
        </left-nav>
    </div>
</template>
<script>
import leftNav from '../leftNav.vue'
export default {
    data(){
        return{
        }
    },
    components:{
        leftNav
    },
    mounted() {
    },
}
</script>
<style lang="scss">

</style>
