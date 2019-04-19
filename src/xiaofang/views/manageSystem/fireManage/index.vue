<template>
    <div>
        <left-nav>
            <ul class="nav-left">
                <li><router-link to="/system/fireManage" ><span>火警记录</span></router-link></li>
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
