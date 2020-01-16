<template>
    <div class="card1" :style="style">
        <h4 @click="handleClick()">
            <i :class="['iconfont',icon]" style="font-size:24px;"></i> 
            {{title}}
            <span class="r" v-if="showMore">more<i class="iconfont icon-Up"  ></i></span> 
            <slot name="header"></slot>
        </h4>
        <div class="border">
        </div>
        <div class="icon">
        </div>
        <slot>

        </slot>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        icon:String,
        title:String,
        height:Number,
        showMore:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        style(){
            if(this.height){
                return {
                    height:this.height+'px'
                }
            }
        }
    },
    methods:{
        handleClick(){
            this.$emit('click')
        }
    }
}
</script>
<style lang="scss" scoped>
    .card1{
        width: 100%;
        height: 100%;
        h4{
            height: 50px;
            line-height: 60px;
            box-sizing: border-box;
            padding: 0 22px;
            font-size:18px;
            font-family:MicrosoftYaHeiUI;
            font-weight:400;
            color:#18a1ec;
            text-align: left;
            cursor: pointer;
            span.r{
                font-size: 14px;
            }
            .iconfont.icon-Up{
                display: inline-block;
                transform: rotate(90deg);
                font-size: 14px;
            }
        }
        .border{
            height: 1px;
            margin: 0px 25px 0 13px;
            background: #07A6FF;
        }
        .icon{
            width: 100px;
            height: 6px;
            margin-left:13px;
            position: relative;
            background: #07A6FF;
        }
        .icon:after{
            display: block;
            width: 0px;
            height: 0px;
            position: absolute;
            right: -6px;
            border: 3px solid transparent;
            border-top-color: #07A6FF;
            border-left-color: #07A6FF;
            content: ""
        }
    }
</style>
