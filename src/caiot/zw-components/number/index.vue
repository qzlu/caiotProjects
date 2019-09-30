<template>
    <div class="number">
        <ul class="number-item" v-for="(item,i) in number" :key="i" :style="{top:`${-84*item}px`}">
            <li v-for="n in 10" :key="n">{{n-1}}</li>
        </ul>
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
    watch:{

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
        width: 100%;
        height: 96px;
        line-height: 96px;
        overflow: hidden;
        .number-item{
            display: inline-block;
            width:40px;
            line-height: 72px;
            vertical-align: middle;
            position: relative;
            transition: all 0.5s;
            li{
                width: 40px;
                height:72px;
                margin: 12px 0;
                background: rgba($color: #3968AF, $alpha: 0.23);
                border-radius:3px;
                color:#2A91FC;
                font-size:40px;
                font-weight:400;
                text-shadow:0px 2px 6px rgba(2,114,193,1);
            }
        }
        .number-item+.number-item{
            margin-left: 12px;
        }
    }
</style>
