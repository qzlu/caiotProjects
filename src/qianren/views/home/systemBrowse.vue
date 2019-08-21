<template>
    <div class="system-browse">
        <div class="left-side aside l">
            <div class="side-header clearfix">
              <number class="l" :data="0"></number>
              <span>实时告警</span>
            </div>
            <div class="side-content">
                <ul class="list">
                    <li v-for="i in 4" :key="i">
                        <h4>
                           <i :class="['iconfont','icon-Firesystem']"></i>
                           <span>{{'供配电'}}</span>
                        </h4>
                        <div class="list-content">
                            <div class="statu">
                            </div>
                            <ul class="param">
                                <li v-for="(obj,j) in 4" :key="j">
                                    <p class="l">
                                        <i :class="['iconfont',obj.IconName||'icon-FireControl']"></i>
                                        {{obj.CountName||'变压器'}}
                                    </p>
                                    <span class="value">
                                        <span :class="{red:obj.AlarmCount>0}">{{obj.AlarmCount||0}} </span>/ {{obj.DeviceCount||0}}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-side aside r">
            <div class="side-header clearfix">
              <number class="l" :data="0"></number>
              <span>实时工单</span>
            </div>
            <ul class="side-content">

            </ul>
        </div>
        <div class="main">

        </div>
    </div>
</template>
<script>
import { number } from "@/components/index.js";
export default {
    data(){
        return{

        }
    },
    components:{
        number
    }
}
</script>
<style lang="scss">
.home{
    .system-browse{
        .aside{
            width: 413px;
            .side-content {
                height: 880px;
                .list{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    >li{
                        height: 25%;
                        .list-content{
                            height: 170px;
                            .param {
                                right: 38px;
                                li{
                                    height: 30px;
                                    display: flex;
                                    justify-content: space-between;
                                }
                            }
                        }
                    }
                }
            }
        }
        .main {
          margin: 0 423px;
        }
    }
}
</style>
