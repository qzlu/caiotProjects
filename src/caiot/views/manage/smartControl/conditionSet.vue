<template>
    <div class="control-cmd">
        <ul class="tab-header clearfix">
            <li :class="{active:activeIndex == 1}" @click="activeIndex = 1">条件设定</li>
            <li :class="{active:activeIndex == 2}" @click="activeIndex = 2">时间设定</li>
        </ul>
        <div class="tab-content">
            <component :is="componentId"></component>
        </div>
    </div>
</template>
<script>
import condition from './condition.vue';
import Time from './time.vue';
import './controlCmd.scss'
export default {
    data(){
        return{
            activeIndex:1
        }
    },
    components:{
        condition,
        Time
    },
    computed:{
        componentId(){
            if(this.activeIndex == 1){
                return condition
            }else{
                return Time
            }
        }
    },
}
</script>