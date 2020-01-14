<template>
    <div class="index flex">
        <div class="aside">
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-brokenlinegraph" title="消防救援统计" :showMore='true'>
                </zw-card1>
            </div>
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Typestatistics" title="告警类型统计">
                </zw-card1>
            </div>
        </div>
        <div class="map-container box-bg">

        </div>
        <div style="width:360px">
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Emergencysafetyindicators" title="消防安全指标" >
                </zw-card1>
            </div>
            <div class="chart-container box-bg">
                <zw-card1 icon="icon-Pressure" title="设备在线率">
                </zw-card1>
            </div>
        </div>
        <div class="aside box-bg">

        </div>
    </div>
</template>
<script>
import {barChart,zwCard1} from '@/components/index.js'
export default {
    data(){
        return{

        }
    },
    components:{
        barChart,
        zwCard1
    }
}
</script>
<style lang="scss">
.index{
    height: 972px;
    margin-top: 8px;
    justify-content: space-between;
    .box-bg{
        background: rgba(5,34,86,.4);
        -webkit-box-shadow: 0 0 8px 8px #052256 inset;
        box-shadow: inset 0 0 8px 8px #052256;
        border-radius:10px 6px 6px 10px;
    }
    >div{
        height: 100%;
        .chart-container{
            width: 100%;
            height: 480px;
        }
        .chart-container+.chart-container{
            margin-top: 10px;
        }
    }
    .aside{
        width: 380px;
    }
    .map-container{
        width: 764px;
    }
}
</style>