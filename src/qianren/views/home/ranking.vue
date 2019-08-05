<template>
    <div class="compre-hensive">
       <div class="left-side aside l">
            <div class="side-header clearfix">
                <number class="l" :data="0"></number>
                <span>实时告警</span>
            </div>
            <ul class="side-content">
                <li class="card">
                    <h4 class="title">
                        <i class="icon-type iconfont icon-Equipment"></i>
                        设备数量排名
                        <i class="iconfont icon-Up"></i>
                        <p class="r"><span :class="['sort-type','sort-type-'+sortType]"><i :class="['iconfont',sortType?'icon-Godown':'icon-Goup']"></i></span>TOP10</p>
                    </h4>
                </li>
                <li class="card">
                </li>
            </ul>
       </div>
       <div class="right-side aside r">
            <div class="side-header clearfix">
                <number class="l" :data="0"></number>
                <span>实时工单</span>
            </div>
       </div>
       <div class="main">

       </div>
    </div>
</template>
<script>
import {number} from '@/components/index.js'
export default {
    data(){
        return{
            sortType:false
        }
    },
    components:{
        number
    }
}
</script>
<style lang="scss">
$url:'../../../assets/image/';
.home{
    .compre-hensive{
        .aside{
            width: 413px;
            .side-content{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .card{
                    width: 100%;
                    height: 446px;
                    background: url(#{$url}cloud/index/leftbar.png);
                    background-size: 100% 100%;
                    h4.title{
                        line-height: 60px;
                        padding: 0 37px 0 6px;
                        text-align: left;
                        font-size: 18px;
                        font-weight:400;
                        .icon-type{

                        }
                        .iconfont.icon-Up{
                            display: inline-block;
                            transform: rotate(90deg);
                            font-size: 24px;
                        }
                        p{
                            position: relative;
                            .sort-type{
                                position: absolute;
                                width:16px;
                                height:18px;
                                line-height: 18px;
                                left: -20px;
                                top: 12px;
                                cursor: pointer;
                                background:rgba(170,29,48,1);
                                border-radius:4px;
                                text-align: center;
                                font-size: 16px;
                                .iconfont{
                                    font-size: 12px;
                                    margin-right: 0;
                                }
                            }
                            .sort-type.sort-type-true{
                                background:#00D294;
                            }
                        }
                    }
                }
            }
        }
        .main{
            margin: 0 423px;
        }
    }
}
</style>
