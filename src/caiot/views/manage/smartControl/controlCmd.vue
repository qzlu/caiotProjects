<template>
    <div class="control-cmd">
        <ul class="tab-header clearfix">
            <li :class="{active:activeIndex == 1}" @click="activeIndex = 1">单控指令</li>
            <li :class="{active:activeIndex == 2}" @click="activeIndex = 2">群控指令</li>
        </ul>
        <div class="tab-content">
            <component :is="cmdType"></component>
        </div>
    </div>
</template>
<script>
import singleCmd from './singleCmd.vue'
import groupCmd from './groupCmd.vue';
import './controlCmd.scss'
export default {
    data(){
        return{
            activeIndex:1
        }
    },
    components:{
        singleCmd,
        groupCmd
    },
    computed: {
        cmdType(){
            if(this.activeIndex == 1){
                return singleCmd
            }else{
                return groupCmd
            }

        }
    }
}
</script>
<style lang="scss">
</style>