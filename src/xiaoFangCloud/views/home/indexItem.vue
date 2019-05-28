<template>
    <div>
        <div class="left-side l">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FTotalCount:0"></number>
                <span>火警总数</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                    <left-side :data="systemList"></left-side>
                 </el-scrollbar>
            </div>
        </div>
        <div class="right-side r">
            <div class="side-header clearfix">
                <number class="l" :data="wariningData?wariningData.FTotalCount:0"></number>
                <span>预警总数</span>
            </div>
            <div class="side-content">
                <div style="height:450px">
                    <zw-table icon='icon-SZXFY-Earlywarning' :pageSize='9' title="实时预警" :width='414' :bodyHeight='370' :labels='tableLabel' :data='wariningData?wariningData.Data:[]' ></zw-table>
                </div>
                <div style="height:450px;margin-top:11px">
                    <zw-table icon='icon-FireAlarm' :pageSize='9' title="实时火警" :width='414' :bodyHeight='370' :labels='tableLabel1' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="device-list">
                <h4>设备总况</h4>
                <div class="type-list">
                    <el-scrollbar>
                        <div v-for="(item,i) in count" :key="i">
                            <h5 v-if="item.mProjectHomePageShowDevices.length">
                                <i :class="['iconfont',item.SystemParamIconName]"></i>
                                <span>{{item.SystemParamName}}（{{item.mProjectHomePageShowDevices.length}}）</span>
                            </h5>
                            <ul class="device">
                                <li v-for="(device,j) in item.mProjectHomePageShowDevices" :key="j">
                                    <router-link :to="`/deviceDetaile/${device.DeviceID}`">
                                        <div :class="['icon',{'off-line':device.DeviceStatusName === '离线','red':device.DeviceStatusName === '故障'}]">
                                            <p><i :class="['iconfont',device.IconName]"></i></p>
                                            <p class="device-status">{{device.DeviceStatusName}}</p>
                                        </div>
                                        <div class="device-info">
                                            <h6>{{device.DeviceName}}</h6>
                                            <ul class="data-item">
                                                <li v-for="(obj,m) in device.mDeviceHomePageShowPositions" :key="m">
                                                    <p>{{obj.ShowData}}</p>
                                                    <p>{{obj.ShowName}}<span v-if="obj.Unit">（{{obj.Unit}}）</span></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
import leftSide from './leftSide.vue'
export default {
    data(){
        return{
            map:null,
            count:[],
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:null,
            wariningData:null,
            tableLabel:[
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'35%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'45%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'20%'
                }
            ],
            tableLabel1:[
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'35%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'45%'
                },
                {
                    label:'类型',
                    prop:'AlarmTypeName',
                    width:'20%'
                }
            ],
        }
    },
    components:{
        number,
        zwTable,
        leftSide
    },
    computed:{
        projectName(){
          return  sessionStorage.getItem('projectName')
        }
    },
    watch:{

    },
    created(){
        this.queryData()
    },
    mounted(){

    },
    methods:{
        queryData(){
            HomePage({
                FAction:'QueryProjectHomePageCount'
            })
            .then((data) => {
                console.log(data);
                [this.systemList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject
            }).catch((err) => {
                console.log(err)
            });
        },
    }
}
</script>
<style lang="scss">
</style>
