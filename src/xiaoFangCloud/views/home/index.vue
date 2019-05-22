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
                 <el-scrollbar>
                     <ul class="list">
                         <li :class="{alarm:item.FireCount>0}" v-for="(item,i) in fireList" :key="i" @dblclick="changeRouter(item)">
                             <h4>{{item.ProjectName}}</h4>
                             <div class="list-content">
                                <div class="statu"></div>
                                <ul  class="param clearfix">
                                    <li class="l" style="margin-bottom: 30px;">
                                        <i class="iconfont icon-FireAlarm"></i>
                                        <span class="value">{{item.FireCount}}</span>
                                    </li>
                                    <li class="l" style="margin-bottom: 30px;">
                                        <i class="iconfont icon-Fault"></i>
                                        <span class="value">{{item.FaultCount}}</span>
                                    </li>
                                    <li class="l">
                                        <i class="iconfont icon-SZXFY-Earlywarning"></i>
                                        <span class="value">{{item.WarningCount}}</span>
                                    </li>
                                    <li class="l">
                                        <i class="iconfont icon-SZXFY-Operations"></i>
                                        <span class="value">{{item.MaintenanceCount}}</span>
                                    </li>
                                </ul>
                             </div>
                         </li>
                     </ul>
                 </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <ul class="main-header">
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>项目数</p>
                    </div>
                    <p class="l">{{count.ProjectCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>设备数</p>
                    </div>
                    <p class="l">{{count.BlocDeviceCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>故障数</p>
                    </div>
                    <p class="l">{{count.FaultCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>运维数</p>
                    </div>
                    <p class="l">{{count.MaintenanceCount}}</p>
                </li>
            </ul>
            <div id="map">
                <b-map ref="map"></b-map>
            </div>
            <div class="main-footer">
                <zw-table icon='icon-FireAlarm' title="实时预警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='wariningData?wariningData.Data:[]' ></zw-table>
                <zw-table icon='icon-FireAlarm' title="实时火警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,bMap} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
import leftSide from './leftSide.vue'
export default {
    data(){
        return{
            map:null,
            count:{},
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:null,
            wariningData:null,
            tableLabel:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'25%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'25%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'25%'
                }
            ],
        }
    },
    components:{
        number,
        zwTable,
        bMap,
        leftSide
    },
    computed:{
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
                FAction:'QueryBlocHomePageCount'
            })
            .then((data) => {
                [this.systemList,this.fireList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject
                console.log(data)
/*                 this.systemList = this.systemList.map(item => {
                    let alarmObj = item.find(obj => obj.AlarmCount )
                    return {
                        SystemParamName:item[0].SystemParamName,
                        AlarmCount:alarmObj?alarmObj.AlarmCount:0,
                        iconName:item[0].SystemParamIconName,
                        data:item
                    }
                })
                this.systemList.sort((a,b) => b.AlarmCount - a.AlarmCount) */
                this.$nextTick(() => {
                    this.showMarks()
                })
            }).catch((err) => {
                console.log(err)
            });
        },
        content(item){
            let temp = `
                <div class = 'info-window'>
                    <h5>${item.ProjectName}</h5> 
                    <ul >
                        <li><span>项目地址：</span>${item.Address}</li>
                        <li><span>安全负责人：</span>${item.PropertyLeader}　${item.PropertyPhone}</li>
                        <li><span>设备名称：</span>${item.DeviceName}</li>`
            if(item.FireCount > 0){
                temp += `<li><span>报警时间：</span>${item.AlarmTime}</li>`
            }
            temp += `            
                    </ul>
                </div>
            `
            return temp
        },
        /**
         * 显示点
         */
        showMarks(){
            let Map = this.$refs.map
            Map.map.clearOverlays()
            this.fireList.forEach((item,i) => {
                if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
                  return
                }
                const point = new BMap.Point(item.Flat,item.Flng)
                let marker,icon,img,temp
                if(item.FireCount>0){
                    img = require('@/assets/image/cloud/index/bMap_icon_alarm.png')
                }else{
                    img = require('@/assets/image/cloud/index/bMap_icon.png')
                }
                icon = Map.setIcon(img,34,40)
                marker = new BMap.Marker(point,{icon:icon})
                temp = this.content(item)
                Map.map.addOverlay(marker)
                Map.map.centerAndZoom(point, 11);
                Map.setLabel(marker,item.ProjectName)
                marker.addEventListener('mouseover',e => {
                  Map.openInfoWindow(temp,point)
                })
                marker.addEventListener('dblclick',e => {
                  this.changeRouter(item)
                })
            })
        },
        changeRouter(item){
            sessionStorage.setItem('projectID',item.ProjectID)
            sessionStorage.setItem('projectName',item.ProjectName)
            this.$router.push('/indexItem')
        },
    }
}
</script>
<style lang="scss">
</style>
