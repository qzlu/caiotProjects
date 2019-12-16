<template>
    <div>
        <Layout :formIndex='3'>
            <router-view></router-view>
        </Layout>
    </div>
</template>
<script>
import Layout from '@/layout/layout.vue'
export default {
    data(){
        return{

        }
    },
    components:{
        Layout
    }
}
</script>