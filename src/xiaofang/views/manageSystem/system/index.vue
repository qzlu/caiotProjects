<template>
    <div>
        <left-nav>
            <ul class="nav-left">
                <li><router-link to="/system/systemMange/" ><span>用户管理</span></router-link></li>
                <li><router-link to="/system/systemMange/role"><span>角色管理</span></router-link></li>
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
