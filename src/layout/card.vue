<template>
    <div class="card" :style="style">
        <h4 @click="handleClick()">
            {{title}} 
            <i class="iconfont icon-Up" v-if="showMoreIcon" ></i>
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
        title:String,
        height:Number,
        showMoreIcon:{
            type:Boolean,
            default:true
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
    .card{
        width: 100%;
        height: 450px;
        /* background: url(../../static/image/index/leftbar_bg_1.png); */
        box-shadow: inset 0 0 10px 4px rgba(48,104,209,.29);
        border-radius: 10px 6px 6px 10px;
        h4{
            margin-top: 19px;
            padding: 0 22px;
            font-size:18px;
            font-family:MicrosoftYaHeiUI;
            font-weight:400;
            color:rgba(241,241,242,1);
            text-align: left;
            cursor: pointer;
            .iconfont.icon-Up{
                display: inline-block;
                transform: rotate(90deg)
            }
        }
        .border{
            height: 1px;
            margin: 9px 25px 0 13px;
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
