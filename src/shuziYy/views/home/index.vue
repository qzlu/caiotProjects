<template>
    <div>
        <div class="left-side l">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FTotalCount:0"></number>
                <span>当前告警</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                    <ul class="list">
                        <li :class="{unnormal:item.AlarmCount}" v-for="(item,i) in systemList" :key="i">
                            <h4>
                               <i :class="['iconfont',item.iconName]"></i>
                               <span>{{item.SystemParamName}}</span>
                           </h4>
                           <div class="list-content">
                               <div class="statu">
                               </div>
                               <ul class="param">
                                   <li v-for="(obj,j) in item.data" :key="j">
                                       <p class="l">
                                           <i :class="['iconfont',obj.IconName]"></i>
                                           {{obj.CountName}}
                                       </p>
                                       <span class="value">
                                           {{obj.DeviceCount}} / {{obj.AlarmCount}}
                                       </span>
                                   </li>
                               </ul>
                           </div>
                        </li>
                    </ul>
                 </el-scrollbar>
            </div>
        </div>
        <div class="right-side r">
            <div class="side-header clearfix">
                <number class="l" :data="wariningData?wariningData.FTotalCount:0"></number>
                <span>当日告警</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                     <transition-group tag="ul" name="list" class="list">
                         <li :class="{alarm:item.FireCount>0,'active':active === i}" v-for="(item,i) in fireList" :key="item.ProjectID" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
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
                     </transition-group>
                 </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <ul class="main-header">
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Numberofentry"></i></p>
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
            </ul>
            <div id="map">
                <b-map ref="map"></b-map>
            </div>
            <div class="main-footer">
                <zw-table icon='icon-SZXFY-Earlywarning' title="实时告警" :width='1100' :bodyHeight='170' :labels='tableLabel' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,bMap} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
export default {
    data(){
        return{
            map:null,
            count:{},
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:null,
            wariningData:null,
            active:null,
            timer:null,
            tableLabel:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'15%'
                }
            ],
        }
    },
    components:{
        number,
        zwTable,
        bMap,
    },
    computed:{

    },
    watch:{

    },
    created(){
        this.queryData()
    },
    updated(){
    },
    mounted(){
    },
    beforeDestroy(){
        clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        queryData(){
            HomePage({
                FAction:'QueryBlocHomePageCount'
            })
            .then((data) => {
                [this.systemList,this.fireList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject
                this.$nextTick(() => {
                    if(!this.$refs.map) return
                    this.showMarks() 
                })
                this.timer = setTimeout(this.queryData,3000)
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
                       `
            if(item.FireCount > 0){
                temp += ` <li><span>设备名称：</span>${item.DeviceName}</li>
                <li><span>报警时间：</span>${item.AlarmTime}</li>`
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
        selectProject(item,i){
            this.active = i
            const point = new BMap.Point(item.Flat,item.Flng)
            let Map = this.$refs.map
            Map.map.centerAndZoom(point,15)
            let temp = this.content(item)
            Map.openInfoWindow(temp,point)
        },
        changeRouter(item){
            sessionStorage.setItem('projectID',item.ProjectID)
            sessionStorage.setItem('projectName',item.ProjectName)
            this.$router.push('/indexItem')
        },
/*         enter(){
            this.swiper&&this.swiper.autoplay.stop()
        },
        leave(){
            this.swiper&&this.swiper.autoplay.start()
        } */

    }
}
</script>
<style lang="scss">
</style>
