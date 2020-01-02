<template>
    <div class="area-browse">
        <left-side></left-side>
        <div class="main">
            <div class="main-top">
                <div :class="['l', 'operation', 'pre',{'no-click':lastIndex === 4}]" v-if="areaCount.length>5&&lastIndex>4" @click="pre()">
                    <i class="iconfont icon-Leftparentheses"></i>
                </div>
                <div :class="['r', 'operation', 'next',{'no-click':lastIndex >= areaCount.length-1}]" v-if="areaCount.length>5&&lastIndex<areaCount.length-1" @click="next()">
                    <i class="iconfont icon-Rightparentheses"></i>
                </div>
                <div class="area-container">
                    <ul class="area-list l" :style="{left:-(lastIndex-4)*320+'px'}">
                        <li :class="['item',{alarm:item.AlarmCount>0,active:item.AreaID == activeArea.AreaID}]" v-for="(item,i) in areaCount" :key="i" @click="selectArea(item)">
                            <p class="area-name">{{item.AreaName}}</p>
                            <div class="area-param">
                                <ul class="data-item">
                                    <li v-for="(obj,j) in item.DataDetail" :key="j">
                                        <div class="item-name">
                                            <p>{{obj.ShowName}}</p>
                                            <p>({{obj.ShowUnit}})</p>
                                        </div>
                                        <p class="value">{{obj.CollectData}}</p>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <div class="statu">
                                            <span class="icon run"></span>
                                            运行
                                        </div>
                                        <p class="value">{{item.RunCount}}</p>
                                    </li>
                                    <li>
                                        <div class="statu">
                                            <span class="icon stop"></span>
                                            停止
                                        </div>
                                        <p class="value">{{item.StopCount}}</p>
                                    </li>
                                    <li>
                                        <div class="statu">
                                            <span class="icon alarm"></span>
                                            告警
                                        </div>
                                        <p class="value">{{item.AlarmCount}}</p>
                                    </li>
                                    <li>
                                        <div class="statu">
                                            <span class="icon repair"></span>
                                            维修
                                        </div>
                                        <p class="value">{{item.RepairCount}}</p>
                                    </li>
                                    <li>
                                        <div class="statu">
                                            <span class="icon maintain"></span>
                                            保养
                                        </div>
                                        <p class="value">{{item.MaintainCount}}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="main-bottom">
                <device-list :data="areaDevice" :width="388" @change="getPrjSingleInfo()"></device-list>
            </div>
        </div>
    </div>
</template>
<script>
import leftSide from './leftSide.vue';
import formatDate from '@/caiot/utils/formatDate'
import {project,ProjectTrend, Orders} from '@/caiot/request/api.js'
import deviceList from './deviceList.vue'
export default {
    data(){
        return{
            timer:null,
            areaCount:[], //所有区域
            lastIndex:4, //记录区域当前显示的最后一个index
            activeArea:null,
            areaDevice:[], //区域设备
        }
    },
    components:{
        deviceList,
        leftSide
    },
    created(){
        this.queryUAreaDeviceByCount()
    },
    beforeDestroy(){
        clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        /**
         * 点击区域列表上一个
         */
        pre(){
            this.lastIndex > 4 && this.lastIndex --
        },
        /**
         * 点击区域列表下一个
         */
        next(){
            this.lastIndex < this.areaCount.length-1 && this.lastIndex ++
        },
        /**
         * 390.区域态势（区域设备统计）
         */
        queryUAreaDeviceByCount(load){
            ProjectTrend({
                FAction: 'QueryUAreaDeviceByCount'
            })
            .then((result) => {
                this.areaCount = result.FObject
                !this.activeArea && (this.activeArea = this.areaCount[0])
                this.getPrjSingleInfo(load)
                this.timer = setTimeout(this.queryUAreaDeviceByCount,10000)
            }).catch((err) => {
                
            });
        },
        /**
         * 6.根据类别获取项目单个信息详情
         */
        getPrjSingleInfo(load = false){
            if(!this.activeArea.AreaID) return
            project({
                FAction: 'GetPrjSingleInfo',
                SingleType:2,
                SingleID:this.activeArea.AreaID
            },undefined,load)
            .then((result) => {
                let data = result.FObject
                let areaDevice = data.ProjectDeviceTypeValue.map(item => {
                    return Object.assign(item,{
                        data:data.ProjectDeviceDataDetail.filter(obj => obj.DeviceTypeID == item.DeviceTypeID)
                    })
                })
                this.areaDevice = areaDevice.filter(item => item.data.length>0)
            }).catch((err) => {
                
            });
        },
        /**
         * 选择区域
         */
        selectArea(item){
            this.activeArea = item
            this.getPrjSingleInfo(true)
        },
    }
}
</script>
<style lang="scss">
$url:'../../static/image';
.area-browse{
    width: 100%;
    display: flex;
    height: 912px;
    justify-content: space-around;
    .main{
        width: 1576px;
        height: 100%;
        &-top{
            width: 100%;
            height: 215px;
            position: relative;
            .operation{
                width:34px;
                height:210px;
                line-height: 210px;
                position: absolute;
                bottom: 6px;
                background:rgba(7,61,130,0.42);
                /* background:rgba(12,52,104,1); */
                cursor: pointer;
                z-index: 100;
                .iconfont{
                    color: #A9CAF7;
                    font-size: 34px;
                    font-weight: bolder;
                }
            }
            .operation.pre{
                left: 5px;
            }
            .operation.next{
                right: 4px;
            }
            .area-container{
                height: 230px;
                overflow: hidden;
                position: relative;
                top: -15px;
                .area-list{
                    white-space: nowrap;
                    position: relative;
                    transition:all 0.5s;
                    .item{
                        display: inline-block;
                        width: 316px;
                        height: 230px;
                        background: url(#{$url}/index/content_bg_1.png);
                        background-size: 100% 100%;
                        cursor: pointer;
                        overflow: hidden;
                        .area-name{
                            line-height: 30px;
                            position: relative;
                            top: 0px;
                            font-size:16px;
                        }
                        .area-param{
                            padding: 0 40px;
                            height: 200px;
                            display: flex;
                            justify-content: space-between;
                            ul{
                                width: 100px;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                li{
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                }
                            }
                            ul.data-item{
                                li{
                                    height: 60px;
                                    .item-name{
                                        text-align: left;
                                    }
                                    .value{
                                        font-size: 22px;
                                        color:rgba(3,205,130,1);
                                    }
                                }
                            }
                            ul:last-of-type{
                                li{
                                    .statu{
                                        font-size: 14px;
                                        line-height: 18px;
                                        .icon{
                                            display: inline-block;
                                            width: 12px;
                                            height: 12px;
                                            border-radius: 4px;
                                            vertical-align: middle;
                                            margin-right: 4px;
                                        }
                                        .run{
                                            background: #03cd82;                                       
                                        }
                                        .stop{
                                            background: #b2b2b2;      
                                        }
                                        .alarm{
                                            background: #fe0000;   
                                        }
                                        .repair{
                                            background: #fe9a00;   
                                        }
                                        .maintain{
                                            background: #0eaff8;   
                                        }
                                    }
                                    .value{
                                        font-size: 20px
                                    }
                                }
                            }
                        }
                    }
                    .item+.item{
                        margin-left: 0px
                    }
                    .item.alarm{
                        background: url(#{$url}/index/content_bg_2.png);
                        background-size: 100% 100%;
                    }
                    .item.active{
                        background: url(#{$url}/index/area-active.png);
                        background-size: 100% 100%;

                    }
                }
            }
        }
        &-bottom{
            width:1574px;
            height:688px;
            margin-top: 10px;
        }
    }
}
</style>
