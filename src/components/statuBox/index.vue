<template>
    <div class="statu-box">
        <div :class="['statu',{alarm:data.isAlarm}]">
            <span>{{data.isAlarm?"告警":"正常"}}</span>
        </div>
        <ul  class="param flex">
            <li v-for="(obj,j) in data[defaultProps.children]" :key="j">
                <i :class="['iconfont',obj[defaultProps.icon]]"></i>
                <span :class="['value',{'red':obj[defaultProps.value]>0}]">{{obj[defaultProps.value]}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
            defaultProps:{
                
            }
        }
    },
    props:{
        data:{
            type:Object
        },
        props:{
            type:Object,
            default:() => {return {}}
        }
    },
    created(){
        this.defaultProps = {
            icon:'IconName',
            value:'AlarmCount',
            children:'Data',
            ...this.props
        }
    }
}
</script>
<style lang="scss">
.statu-box{
    width: 100%;
    height: 100%;
    position: relative;
    .statu {
        width: 72px;
        height: 72px;
        line-height: 72px;
        position: absolute;
        top: 50%;
        left: 20px;
        font-size: 28px;
        font-weight: 500;
        color: #017901;
        transform: translateY(-50%) scaleY(1.9);
        border: 1px solid rgba(1, 150, 7, 1);
        border-radius: 9px;
        box-shadow: 0 0 14px rgba(1, 150, 7, 1);
        span {
            display: inline-block;
            transform: scaleY(0.6)
        }
        &:after {
            content: ' ';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 50%, #00ff33 100%);
            width: 50%;
            height: 50%;
            animation: radar-beam 10s infinite;
            animation-timing-function: linear;
            transform-origin: bottom right;
            border-radius: 100% 0 0 0;
        }
    }
    .statu.alarm{
        border: 1px solid #fb0d0d;
        -webkit-box-shadow: 0 0 14px #fb0d0d;
        box-shadow: 0 0 14px #fb0d0d;
        color: #fb0d0d;
        &:after {
            background-image: linear-gradient(44deg, rgba(251, 13, 13, 0) 42%, #fb0d0d);
        }
    }
    @keyframes radar-beam {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .param{
        padding-left: 40px;
        position: absolute;
        top: 50%;
        left: 90px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        flex-wrap: wrap;
        align-items: center;
        li{
            width: 50%;
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            p{
                width: 150px;
                height: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
                i{
                    display: inline-block;
                    width: 40px;
                    vertical-align: middle;
                }
            }
            .value{
                font-size: 20px;
                margin-left: 30px;
            }
        }
    }

}
     
</style>