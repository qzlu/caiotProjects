<template>
    <div class="drawing-monitor">
        <air-conditioning></air-conditioning>
    </div>
</template>
<script>
import {AirConditioning} from '@/components/index.js'
export default {
    data(){
        return{

        }
    },
    components:{
        AirConditioning
    }
}
</script>
<style lang="scss">
.drawing-monitor{
    height: 100%;
    position: relative
} 
</style>