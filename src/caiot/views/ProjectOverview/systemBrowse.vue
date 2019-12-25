<template>
    <div class="system-browse">
        <div class="aside">
            <card :class="{active:item.ParamID === activeSystem.ParamID}" :title="item.SystemParamName" v-for="(item,i) in systemList[0]||[]" :key="i" :height="214" @click.native="selectSystem(item)">
                <span slot="header" class="r header-r">
                    <i class="iconfont icon-Equipment"></i>
                    <span :class="{err:item.AlarmCount>0}">{{item.AlarmCount}}</span>/{{item.DeviceCount}}
                </span>
                <div class="content">
                    <div :class="['statu',{alarm: item.FState == 3||item.FState == 1,'un-use':item.FState == 2}]">
                        {{stateText[item.FState]}}
                    </div>
                    <ul  class="param clearfix">
                        <li v-for="(obj,j) in item.DeviceTypeInfo" :key="j">
                            <span>
                                <i :class="['iconfont',obj.IconName]"></i>{{obj.DeviceTypeName}}
                            </span>
                            <span :class="['value']"><span :class="{'err':obj.AlarmCount>0}">{{obj.AlarmCount}}</span>/{{obj.DeviceCount}}</span>
                        </li>
                    </ul>
                </div>
            </card>
        </div>
        <div class="main">
            <div class="main-top">
                <device-list  :data="systemDevice" :width="318" @change="getPrjSingleInfo()"></device-list>
            </div>
            <div class="main-footer">
                <monitorData></monitorData>
            </div>
        </div>
        <div class="aside">
            <card :class="{active:item.ParamID === activeSystem.ParamID}" :title="item.SystemParamName" v-for="(item,i) in systemList[1]||[]" :key="i" :height="214" @click.native="selectSystem(item)">
                <span slot="header" class="r header-r">
                    <i class="iconfont icon-Equipment"></i>
                    <span :class="{err:item.AlarmCount>0}">{{item.AlarmCount}}</span>/{{item.DeviceCount}}
                </span>
                <div class="content">
                    <div :class="['statu',{alarm: item.FState == 3||item.FState == 1,'un-use':item.FState == 2}]">
                        {{stateText[item.FState]}}
                    </div>
                    <ul  class="param clearfix">
                        <li v-for="(obj,j) in item.DeviceTypeInfo" :key="j">
                            <span>
                                <i :class="['iconfont',obj.IconName]"></i>{{obj.DeviceTypeName}}
                            </span>
                            <span :class="['value']"><span :class="{'err':obj.AlarmCount>0}">{{obj.AlarmCount}}</span>/{{obj.DeviceCount}}</span>
                        </li>
                    </ul>
                </div>
            </card>
        </div>
    </div>
</template>
<script>
import {ProjectTrend, project, Monitor } from '@/caiot/request/api.js'
import card from './card.vue'
import monitorData from './monitorData.vue'
import deviceList from './deviceList.vue'
export default {
    data(){
        return{
            systemList:[],
            activeSystem:null,
            systemDevice:[],
            timer:null,
            stateText:['正常','告警','未开通','火警']
        }
    },
    components:{
        card,
        monitorData,
        deviceList
    },
    created(){
        try {
            this.activeSystem = JSON.parse(sessionStorage.getItem('activeSystem'))
        } catch (error) {
            this.activeSystem = null
        }
        this.querySystemAlarmByCount()
    },
    beforeDestroy(){
        this.timer&&clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        /**
         * 387.系统态势（系统类别设备告警统计）
         */
        querySystemAlarmByCount(){
            ProjectTrend({
                FAction: 'QuerySystemAlarmByCount'
            })
            .then((result) => {
                let data = result.FObject || []
                if(!this.activeSystem){
                    this.activeSystem = data.find(item => item.DeviceCount>0)||data[0]
                }else{
                    this.activeSystem = data.find(item => this.activeSystem.ParamID == item.ParamID&&item.DeviceCount>0)||data.find(item => item.DeviceCount>0)||data[0]
                }
                this.systemList.push(...[data.slice(0,4),data.slice(4)])
                this.getPrjSingleInfo()
                this.timer = setTimeout(() => {
                    this.querySystemAlarmByCount()
                }, 10000);
            }).catch((err) => {
                
            });
        },
        /**
         * 6.根据类别获取项目单个信息详情
         */
        getPrjSingleInfo(){
            if(!this.activeSystem.ParamID) return
            project({
                FAction: 'GetPrjSingleInfo',
                SingleType:1,
                SingleID:this.activeSystem.ParamID
            })
            .then((result) => {
                let data = result.FObject
                let systemDevice = data.ProjectDeviceTypeValue.map(item => {
                    return Object.assign(item,{
                        data:data.ProjectDeviceDataDetail.filter(obj => obj.DeviceTypeID == item.DeviceTypeID)
                    })
                })
                this.systemDevice = systemDevice.filter(item => item.data.length>0)
            }).catch((err) => {
                
            });
        },
        selectSystem(item){
            this.activeSystem = item
            sessionStorage.setItem('activeSystem',JSON.stringify(item))
            this.getPrjSingleInfo()
        },
    }
}
</script>
<style lang="scss">
$url:'../../static/image';
.system-browse{
    width: 100%;
    display: flex;
    height: 912px;
    justify-content: space-around;
    .warning{
        color: #e0e213
    }
    .aside{
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .card.active{
            border-radius: 10px;
            /* box-shadow:  0 0 20px 20px rgba($color: #0E49A8, $alpha: 0.5) inset; */
            background: url(#{$url}/index/active.png) center no-repeat;
            background-size: 100% 100%;
        }
        .header-r{
            /* margin-top: -10px; */
            color: #2A91FC;
            font-size: 16px;
            .iconfont{
                margin-right: 10px;
                font-size: 20px;
            }
        }
        .content{
            height: 162px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .statu{
                width:72px;
                height:124px;
                line-height: 124px;
                border:1px solid rgba(1,150,7,1);
                border-radius:9px;
                box-shadow:  0 0 14px rgba(1,150,7,1);
                position: relative;
                font-size: 28px;
                font-weight: 500;
                color: #02CD35;
               /*  background: url(#{$url}/index/normal.gif) */
            }
/*             .statu.alarm{
                background: url(#{$url}/index/fire.gif);
                border: 1px solid #fb0d0d;
                box-shadow: 0 0 14px #fb0d0d;
            }
            .statu.warning{
                background: url(#{$url}/index/warning.gif);
                border: 1px solid #e0e213;
                box-shadow: 0 0 14px #e0e213;
            }
            .statu.un-use{
                border:1px solid #737373;
                box-shadow:  0 0 14px #737373;
                background: url(#{$url}/index/unuse.gif)
            } */
            .statu::after{
                content: "";
                display: block;
                background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 42%, #00ff33 100%);
                width: 36px;
                height: 36px;
                position: absolute;
                top: 26px;
                left: 0;
                animation: radar-beam 3s infinite;
                animation-timing-function: linear;
                transform-origin: bottom right;
                border-radius: 100% 0 0 0;
            }
            .statu.alarm{
                border:1px solid #fb0d0d;
                box-shadow:  0 0 14px #fb0d0d;
                color: #fb0d0d;
            }
            .statu.alarm::after{
                background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #fb0d0d,$alpha:1));
            }
            .statu.warning{
                border: 1px solid #e0e213;
                box-shadow: 0 0 14px #e0e213;
                color: #e0e213;
            }
            .statu.warning::after{
                background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #e0e213,$alpha:1));
            }
            .statu.un-use{
                border:1px solid #737373;
                box-shadow:  0 0 14px #737373;
                color:#737373;
                font-size: 22px;
            }
            .statu.un-use::after{
                background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #737373,$alpha:1));
            }
            @keyframes radar-beam {
                from{transform: rotate(0deg)}
                to{transform: rotate(360deg)}
            }
            .param{
                li{
                    line-height: 30px;
                    display: flex;
                    justify-content: space-between;
                    span{
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    span:first-of-type{
                        width: 100px;
                        line-height: 30px;
                        font-size: 14px;
                        text-align: left;
                        .iconfont{
                            font-size: 18px;
                            margin-right: 10px;
                        }
                    }
                    .value{
                        width: 70px;
                        color: #02CD35;
                        font-size: 20px;
                        text-align: right;
                        span{
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
    .main{
        width: 1280px;
        height: 100%;
        &-top{
            width: 100%;
            height: 614px;
        }
        &-footer{
            height: 286px;
            margin-top: 13px;
            display: flex;
            justify-content: space-between;
            .monitor-data{
                &-item{
                    width: 636px;
                }
            }
        }
    }
}
</style>
