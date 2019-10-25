<template>
    <div class="group height-100">
        <header>
            <ul class="clearfix">
                <li :class="['l',{active:active === 0}]" @click="active = 0">
                    部门信息
                </li>
                <li :class="['l',{active:active === 1}]" @click="active = 1">
                    岗位信息
                </li>
                <li :class="['l',{active:active === 2}]" @click="active = 2">
                    职责信息
                </li>
            </ul>
        </header>
        <div style="height:884px;">
            <component :is="componentId"></component>
        </div>
    </div>
</template>
<script>
import departments from './departments'
import station from './station'
import duty from './duty'
export default {
    data(){
        return{
            active:0,
            tabList:['departments','station','duty']
        }
    },
    components:{
        departments,
        station,
        duty
    },
    computed:{
        componentId(){
            return this.tabList[this.active]
        }
    },
    created(){
        /* this.$store.dispatch('queryMainDBTORGLevel') */
    }
}
</script>
<style lang="scss" scoped>
.group{
    margin-top:-66px;
    padding: 7px 27px;
    box-sizing:border-box;
    header{
        position: relative;
        height: 57px;
        .name{
            position: absolute;
            left: 14px;
            bottom: 10px;
            font-size: 22px;
            color: #9EE5F3
        }
        ul{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            li{
                width:187px;
                height:57px;
                line-height: 57px;
                border:1px solid rgba(143,156,191,1);
                font-size: 20px;
                cursor: pointer;
            }
            li.active{
                background: #0894C7
            }
            li:nth-of-type(2){
                border-left: none;
                border-right: none;
            }
        }
    }
}
</style>