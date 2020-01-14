<template>
    <div class="system-browse">
        <div class="aside">
            <card :class="{active:item.ParamID === activeSystem.ParamID}" :icon="item.IconName" :title="item.SystemParamName" v-for="(item,i) in systemList[0]||[]" :key="i" :height="214" @click.native="selectSystem(item)">
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
                <div class="main-top-header" v-if="activeSystem.ParamID == 6">
                    <h4><i class="iconfont icon-Equipment"></i>设备列表</h4>
                    <div class="parking-info-container">
                        <div class="total-parking-number">
                            <p class="title">总车位数</p>
                            <Number style="margin-left:7px;" :data='3222'></Number>
                        </div>
                        <div class="parking-info-item">
                            <div class="parking-info-item-icon">
                                <i class="iconfont icon-Freeparking"></i>
                                <svg class="svg-bg" version="1.1" id="&#x56FE;&#x5C42;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                	 y="0px" viewBox="0 0 94 92" style="enable-background:new 0 0 94 92;" xml:space="preserve">
                                <path style="fill:#2961BC;" d="M47.016,91.724c-25.166,0-45.639-20.474-45.639-45.639c0-25.166,20.474-45.639,45.639-45.639
                                	s45.64,20.474,45.64,45.639C92.656,71.249,72.182,91.724,47.016,91.724z M47.016,1.624C22.5,1.624,2.555,21.569,2.555,46.084
                                	c0,24.516,19.945,44.461,44.461,44.461S91.477,70.6,91.477,46.084C91.477,21.569,71.531,1.624,47.016,1.624z"/>
                                <path style="fill:#2266DF;" d="M70.332,14.692c-0.045,0.031-0.082,0.073-0.124,0.108c-0.019,0.024-0.028,0.049-0.053,0.071
                                	c-0.502,0.45-0.838,1.025-1.284,1.515c9.259,6.744,15.304,17.647,15.304,29.952c0,14.826-8.769,27.614-21.377,33.535
                                	c0.018,0.035,0.026,0.071,0.036,0.109c0.018,0.013,0.038,0.024,0.052,0.043c0.002,0.003,0.005,0.007,0.007,0.011
                                	c0.016,0.018,0.024,0.039,0.037,0.059c0.021,0.02,0.043,0.035,0.061,0.062c0.049,0.076,0.089,0.157,0.135,0.235
                                	c0.107,0.144,0.205,0.294,0.305,0.443c0.012,0.013,0.025,0.021,0.037,0.036c0.048,0.065,0.084,0.136,0.127,0.202
                                	c0.003,0.004,0.006,0.008,0.009,0.013c0.106,0.145,0.201,0.299,0.297,0.452c0.051,0.068,0.102,0.137,0.154,0.205
                                	C77.255,75.4,86.41,61.935,86.41,46.339C86.41,33.358,80.065,21.85,70.332,14.692z"/>
                                <path style="fill:#2266DF;" d="M60.19,80.997c-4.07,1.542-8.472,2.402-13.075,2.402c-20.435,0-37.06-16.625-37.06-37.06
                                	c0-1.786,0.135-3.54,0.381-5.26c-0.169-0.058-0.34-0.108-0.512-0.158c-0.38-0.075-0.758-0.161-1.136-0.248
                                	c-0.178-0.025-0.356-0.052-0.537-0.061c-0.003,0-0.005-0.002-0.008-0.002c-0.275,1.871-0.423,3.782-0.423,5.728
                                	c0,21.668,17.627,39.295,39.294,39.295c5.02,0,9.815-0.964,14.233-2.688C60.952,82.302,60.568,81.651,60.19,80.997z"/>
                                <path style="fill:#2266DF;" d="M68.035,12.666c-6.064-3.832-13.231-6.068-20.92-6.068c-18.828,0-34.586,13.317-38.397,31.022
                                	c0.117,0.025,0.232,0.055,0.347,0.086c0.325,0.022,0.638,0.094,0.945,0.196c0.302,0.042,0.595,0.115,0.886,0.203
                                	C14.485,21.399,29.352,8.832,47.115,8.832c7.205,0,13.926,2.083,19.623,5.656C67.181,13.888,67.589,13.264,68.035,12.666z"/>
                                <path style="fill:#8CC4FE;" d="M12.033,18.424l-0.419-0.359c-0.644-0.552-0.719-1.53-0.167-2.174l4.617-5.387
                                	c0.552-0.644,1.53-0.719,2.174-0.167l0.419,0.359c0.644,0.552,0.719,1.53,0.167,2.174l-4.617,5.387
                                	C13.656,18.9,12.677,18.976,12.033,18.424z"/>
                                <path style="fill:#8CC4FE;" d="M3.925,61.893l0.478-0.276c0.734-0.424,1.682-0.17,2.106,0.564l3.547,6.144
                                	c0.424,0.734,0.17,1.682-0.564,2.106l-0.478,0.276c-0.734,0.424-1.682,0.17-2.106-0.564L3.36,63.999
                                	C2.936,63.264,3.19,62.317,3.925,61.893z"/>
                                <path style="fill:#8CC4FE;" d="M91.039,56.494l0.511,0.207c0.786,0.319,1.168,1.222,0.849,2.008l-2.666,6.575
                                	c-0.319,0.786-1.222,1.168-2.008,0.849l-0.511-0.207c-0.786-0.319-1.168-1.222-0.849-2.008l2.666-6.575
                                	C89.349,56.557,90.253,56.175,91.039,56.494z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="title">空余车位数</p>
                                <p class="value">{{10|formatNumber}}</p>
                            </div>
                        </div>
                        <div class="parking-info-item">
                            <div class="parking-info-item-icon">
                                <svg class="svg-bg" version="1.1" id="&#x56FE;&#x5C42;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                	 y="0px" viewBox="0 0 94 92" style="enable-background:new 0 0 94 92;" xml:space="preserve">
                                <path style="fill:#2961BC;" d="M47.016,91.724c-25.166,0-45.639-20.474-45.639-45.639c0-25.166,20.474-45.639,45.639-45.639
                                	s45.64,20.474,45.64,45.639C92.656,71.249,72.182,91.724,47.016,91.724z M47.016,1.624C22.5,1.624,2.555,21.569,2.555,46.084
                                	c0,24.516,19.945,44.461,44.461,44.461S91.477,70.6,91.477,46.084C91.477,21.569,71.531,1.624,47.016,1.624z"/>
                                <path style="fill:#2266DF;" d="M70.332,14.692c-0.045,0.031-0.082,0.073-0.124,0.108c-0.019,0.024-0.028,0.049-0.053,0.071
                                	c-0.502,0.45-0.838,1.025-1.284,1.515c9.259,6.744,15.304,17.647,15.304,29.952c0,14.826-8.769,27.614-21.377,33.535
                                	c0.018,0.035,0.026,0.071,0.036,0.109c0.018,0.013,0.038,0.024,0.052,0.043c0.002,0.003,0.005,0.007,0.007,0.011
                                	c0.016,0.018,0.024,0.039,0.037,0.059c0.021,0.02,0.043,0.035,0.061,0.062c0.049,0.076,0.089,0.157,0.135,0.235
                                	c0.107,0.144,0.205,0.294,0.305,0.443c0.012,0.013,0.025,0.021,0.037,0.036c0.048,0.065,0.084,0.136,0.127,0.202
                                	c0.003,0.004,0.006,0.008,0.009,0.013c0.106,0.145,0.201,0.299,0.297,0.452c0.051,0.068,0.102,0.137,0.154,0.205
                                	C77.255,75.4,86.41,61.935,86.41,46.339C86.41,33.358,80.065,21.85,70.332,14.692z"/>
                                <path style="fill:#2266DF;" d="M60.19,80.997c-4.07,1.542-8.472,2.402-13.075,2.402c-20.435,0-37.06-16.625-37.06-37.06
                                	c0-1.786,0.135-3.54,0.381-5.26c-0.169-0.058-0.34-0.108-0.512-0.158c-0.38-0.075-0.758-0.161-1.136-0.248
                                	c-0.178-0.025-0.356-0.052-0.537-0.061c-0.003,0-0.005-0.002-0.008-0.002c-0.275,1.871-0.423,3.782-0.423,5.728
                                	c0,21.668,17.627,39.295,39.294,39.295c5.02,0,9.815-0.964,14.233-2.688C60.952,82.302,60.568,81.651,60.19,80.997z"/>
                                <path style="fill:#2266DF;" d="M68.035,12.666c-6.064-3.832-13.231-6.068-20.92-6.068c-18.828,0-34.586,13.317-38.397,31.022
                                	c0.117,0.025,0.232,0.055,0.347,0.086c0.325,0.022,0.638,0.094,0.945,0.196c0.302,0.042,0.595,0.115,0.886,0.203
                                	C14.485,21.399,29.352,8.832,47.115,8.832c7.205,0,13.926,2.083,19.623,5.656C67.181,13.888,67.589,13.264,68.035,12.666z"/>
                                <path style="fill:#8CC4FE;" d="M12.033,18.424l-0.419-0.359c-0.644-0.552-0.719-1.53-0.167-2.174l4.617-5.387
                                	c0.552-0.644,1.53-0.719,2.174-0.167l0.419,0.359c0.644,0.552,0.719,1.53,0.167,2.174l-4.617,5.387
                                	C13.656,18.9,12.677,18.976,12.033,18.424z"/>
                                <path style="fill:#8CC4FE;" d="M3.925,61.893l0.478-0.276c0.734-0.424,1.682-0.17,2.106,0.564l3.547,6.144
                                	c0.424,0.734,0.17,1.682-0.564,2.106l-0.478,0.276c-0.734,0.424-1.682,0.17-2.106-0.564L3.36,63.999
                                	C2.936,63.264,3.19,62.317,3.925,61.893z"/>
                                <path style="fill:#8CC4FE;" d="M91.039,56.494l0.511,0.207c0.786,0.319,1.168,1.222,0.849,2.008l-2.666,6.575
                                	c-0.319,0.786-1.222,1.168-2.008,0.849l-0.511-0.207c-0.786-0.319-1.168-1.222-0.849-2.008l2.666-6.575
                                	C89.349,56.557,90.253,56.175,91.039,56.494z"/>
                                </svg>
                                <i class="iconfont icon-ParkingEntrance"></i>
                            </div>
                            <div>
                                <p class="title">进场车辆</p>
                                <p class="value">{{3010|formatNumber}}</p>
                            </div>
                        </div>
                        <div class="parking-info-item">
                            <div class="parking-info-item-icon">
                                <i class="iconfont icon-Carparkexit"></i>
                                <svg class="svg-bg" version="1.1" id="&#x56FE;&#x5C42;_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                	 y="0px" viewBox="0 0 94 92" style="enable-background:new 0 0 94 92;" xml:space="preserve">
                                <path style="fill:#2961BC;" d="M47.016,91.724c-25.166,0-45.639-20.474-45.639-45.639c0-25.166,20.474-45.639,45.639-45.639
                                	s45.64,20.474,45.64,45.639C92.656,71.249,72.182,91.724,47.016,91.724z M47.016,1.624C22.5,1.624,2.555,21.569,2.555,46.084
                                	c0,24.516,19.945,44.461,44.461,44.461S91.477,70.6,91.477,46.084C91.477,21.569,71.531,1.624,47.016,1.624z"/>
                                <path style="fill:#2266DF;" d="M70.332,14.692c-0.045,0.031-0.082,0.073-0.124,0.108c-0.019,0.024-0.028,0.049-0.053,0.071
                                	c-0.502,0.45-0.838,1.025-1.284,1.515c9.259,6.744,15.304,17.647,15.304,29.952c0,14.826-8.769,27.614-21.377,33.535
                                	c0.018,0.035,0.026,0.071,0.036,0.109c0.018,0.013,0.038,0.024,0.052,0.043c0.002,0.003,0.005,0.007,0.007,0.011
                                	c0.016,0.018,0.024,0.039,0.037,0.059c0.021,0.02,0.043,0.035,0.061,0.062c0.049,0.076,0.089,0.157,0.135,0.235
                                	c0.107,0.144,0.205,0.294,0.305,0.443c0.012,0.013,0.025,0.021,0.037,0.036c0.048,0.065,0.084,0.136,0.127,0.202
                                	c0.003,0.004,0.006,0.008,0.009,0.013c0.106,0.145,0.201,0.299,0.297,0.452c0.051,0.068,0.102,0.137,0.154,0.205
                                	C77.255,75.4,86.41,61.935,86.41,46.339C86.41,33.358,80.065,21.85,70.332,14.692z"/>
                                <path style="fill:#2266DF;" d="M60.19,80.997c-4.07,1.542-8.472,2.402-13.075,2.402c-20.435,0-37.06-16.625-37.06-37.06
                                	c0-1.786,0.135-3.54,0.381-5.26c-0.169-0.058-0.34-0.108-0.512-0.158c-0.38-0.075-0.758-0.161-1.136-0.248
                                	c-0.178-0.025-0.356-0.052-0.537-0.061c-0.003,0-0.005-0.002-0.008-0.002c-0.275,1.871-0.423,3.782-0.423,5.728
                                	c0,21.668,17.627,39.295,39.294,39.295c5.02,0,9.815-0.964,14.233-2.688C60.952,82.302,60.568,81.651,60.19,80.997z"/>
                                <path style="fill:#2266DF;" d="M68.035,12.666c-6.064-3.832-13.231-6.068-20.92-6.068c-18.828,0-34.586,13.317-38.397,31.022
                                	c0.117,0.025,0.232,0.055,0.347,0.086c0.325,0.022,0.638,0.094,0.945,0.196c0.302,0.042,0.595,0.115,0.886,0.203
                                	C14.485,21.399,29.352,8.832,47.115,8.832c7.205,0,13.926,2.083,19.623,5.656C67.181,13.888,67.589,13.264,68.035,12.666z"/>
                                <path style="fill:#8CC4FE;" d="M12.033,18.424l-0.419-0.359c-0.644-0.552-0.719-1.53-0.167-2.174l4.617-5.387
                                	c0.552-0.644,1.53-0.719,2.174-0.167l0.419,0.359c0.644,0.552,0.719,1.53,0.167,2.174l-4.617,5.387
                                	C13.656,18.9,12.677,18.976,12.033,18.424z"/>
                                <path style="fill:#8CC4FE;" d="M3.925,61.893l0.478-0.276c0.734-0.424,1.682-0.17,2.106,0.564l3.547,6.144
                                	c0.424,0.734,0.17,1.682-0.564,2.106l-0.478,0.276c-0.734,0.424-1.682,0.17-2.106-0.564L3.36,63.999
                                	C2.936,63.264,3.19,62.317,3.925,61.893z"/>
                                <path style="fill:#8CC4FE;" d="M91.039,56.494l0.511,0.207c0.786,0.319,1.168,1.222,0.849,2.008l-2.666,6.575
                                	c-0.319,0.786-1.222,1.168-2.008,0.849l-0.511-0.207c-0.786-0.319-1.168-1.222-0.849-2.008l2.666-6.575
                                	C89.349,56.557,90.253,56.175,91.039,56.494z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="title">出场车辆</p>
                                <p class="value">{{3000|formatNumber}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="activeSystem.ParamID == 6?'parking':'not-parking'">
                    <device-list :data="systemDevice" :width="318" @change="getPrjSingleInfo()"></device-list>
                </div>
            </div>
            <div class="main-footer">
                <monitorData></monitorData>
            </div>
        </div>
        <div class="aside">
            <card :class="{active:item.ParamID === activeSystem.ParamID}" :icon="item.IconName" :title="item.SystemParamName" v-for="(item,i) in systemList[1]||[]" :key="i" :height="214" @click.native="selectSystem(item)">
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
import {Number} from '../../zw-components/index.js'
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
    filters:{
        formatNumber(value){
            if(String(value).length>=4){
                return value
            }else{
                return (Array(4).join('0') + value).slice(-4)
            }
        }
    },
    components:{
        card,
        monitorData,
        deviceList,
        Number
    },
    created(){
        try {
            this.activeSystem = JSON.parse(sessionStorage.getItem('activeSystem'))
        } catch (error) {
            this.activeSystem = null
        }
        this.querySystemAlarmByCount(true)
    },
    beforeDestroy(){
        this.timer&&clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        /**
         * 387.系统态势（系统类别设备告警统计）
         */
        querySystemAlarmByCount(load = false){
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
                this.getPrjSingleInfo(load)
                this.timer = setTimeout(() => {
                    this.querySystemAlarmByCount()
                }, 10000);
            }).catch((err) => {
                
            });
        },
        /**
         * 6.根据类别获取项目单个信息详情
         */
        getPrjSingleInfo(load = false){
            if(!this.activeSystem.ParamID) return
            project({
                FAction: 'GetPrjSingleInfo',
                SingleType:1,
                SingleID:this.activeSystem.ParamID
            },undefined,load)
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
            this.getPrjSingleInfo(true)
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
            &-header{
                height: 233px;
                border-radius: 10px 6px 6px 10px;
                background: rgba(5, 34, 86, 0.4);
                -webkit-box-shadow: 0 0 8px 8px #052256 inset;
                box-shadow: 0 0 8px 8px #052256 inset;
                h4{
                  padding-left: 36px;
                  text-align: left;
                  color: #18A1EC;
                  height: 38px;
                  line-height: 38px;
                  font-size: 16px;
                  display: flex;
                  background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
                  .iconfont{
                    font-size: 24px;
                    margin-right: 10px;
                  }
                }
                .parking-info-container{
                    display: flex;
                    height: 190px;
                    color: #2A91FC;
                    align-items: center;
                    p.title{
                        color: #525E7E;
                        text-align: left;
                    }
                    .total-parking-number{
                        margin-left: 60px;
                        p.title{
                            font-size: 20px;
                        }
                    }
                    .parking-info-item{
                        display: flex;
                        margin-left: 60px;
                        &-icon{
                            width: 94px;
                            height: 92px;
                            line-height: 92px;
                            position: relative;
                            .svg-bg{
                                position: absolute;
                                left: 0;
                                top: 0;
                            }
                            .iconfont{
                                font-size: 40px;
                            }
                        }
                        >div:last-of-type{
                            height: 92px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            p.title{
                                font-size: 18px;
                            }
                            p.value{
                                padding-left: 17px;
                                font-size: 38px;
                                text-align: left;
                            }
                        }
                    }
                }
            }
            .not-parking{
                height: 100%;
            }
            .parking{
                height: 376px;
                margin-top: 10px;
            }
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
