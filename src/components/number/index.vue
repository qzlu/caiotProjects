<template>
    <div class="number">
        <span v-for="(item,i) in number" :key="i">
            {{item}}
        </span>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        data:{
            required:true
        }
    },
    computed:{
        number(){
            return (Array(4).join('0') + this.$props.data).slice(-4)
        }
    }
}
</script>
<style lang="scss" scoped>
    .number{
        width: 274px;
        height: 77px;
        line-height: 77px;
        span{
            display: inline-block;
            width:40px;
            height:54px;
            line-height: 54px;
            vertical-align: middle;
            background:linear-gradient(180deg,rgba(1,125,232,1) 0%,rgba(0,220,223,1) 100%);
            opacity:0.55;
            border-radius:3px;
            color:rgba(255,255,255,1);
            font-size:40px;
            font-weight:400;
            text-shadow:0px 2px 6px rgba(2,114,193,1);
        }
        span+span{
            margin-left: 20px;
        }
    }
</style>
