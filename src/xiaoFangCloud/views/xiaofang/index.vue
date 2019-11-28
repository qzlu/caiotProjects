<template>
    <div>
        <div class="left-side l">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FTotalCount:0"></number>
                <span>实时火警</span>
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
                <span>实时预警</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                     <transition-group tag="ul" name="list" class="list">
                         <li :class="{alarm:item.isAlarm,unnormal:item.unNormal,'active':active === i}" v-for="(item,i) in fireList" :key="item.ProjectID" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
                             <div class="clearfix">
                                 <h4 class="l">{{item.ProjectName}}</h4>
                                 <div class="r" style="margin-right:20px;line-height:36px;font-size:16px;">
                                     <i class="iconfont icon-Equipment"></i>
                                     {{item.DeviceCount||0}}
                                 </div>
                             </div>
                             <div class="list-content">
                                <div class="statu"></div>
                                <ul  class="param clearfix">
                                    <li class="l" v-for="(obj,j) in item.mBlocHomePageProjectItems" :key="j">
                                        <i :class="['iconfont',obj.IconName]" :title="obj.ItemName"></i>
                                        <span :class="['value',{'red':obj.ItemCount>0}]">{{obj.ItemCount}}</span>
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
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Fault"></i></p>
                        <p>故障数</p>
                    </div>
                    <p class="l">{{count.FaultCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-SZXFY-Operations"></i></p>
                        <p>运维数</p>
                    </div>
                    <p class="l">{{count.MaintenanceCount}}</p>
                </li>
            </ul>
            <div id="map">
                <b-map ref="map"></b-map>
            </div>
            <div class="main-footer" v-if="formID == 1">
                <zw-table icon='icon-FireAlarm' title="实时火警" @rowClick='rowClick' :width='545' :bodyHeight='170' :labels='tableLabel' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
                <zw-table icon='icon-SZXFY-Earlywarning' title="实时预警" @rowClick='rowClick' :width='545' :bodyHeight='170' :labels='tableLabel' :data='wariningData?wariningData.Data:[]' ></zw-table>
            </div>
            <div class="main-footer" v-else>
                <zw-table icon='icon-SZXFY-Earlywarning' title="实时告警" @rowClick='rowClick' :width='1100' :bodyHeight='170' :labels='tableLabel1' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,bMap} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
import leftSide from './leftSide.vue'
import formatDate from '@/utils/formatDate.js'
let orderState = ['','待完成','已完成','待接单','待派单','已逾期','未完成','误报']
export default {
    data(){
        return{
            formID:1,
            map:null,
            count:{},
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:null,
            wariningData:null,
            active:null,
            timer:null,
            alarmTimes:0, //响铃报警次数，只报三次
            resetView:true,
            lastAlarmTime:'',
/*             swiperOption:{
                init:false,
                autoplay: {
                    disableOnInteraction: false,
                },
                direction : 'vertical',
                speed:300,
                loop:true,
                slidesPerView: 4,
            }, */
            tableLabel:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'25%',
                    formatter:(val) => formatDate(val,'YYYY-MM-DD HH:mm')
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'工单状态',
                    prop:'OrderState',
                    width:'15%',
                    color:'#FBA31E',
                    formatter:(val)=>orderState[val]
                }
            ],
            tableLabel1:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'位置',
                    prop:'AreaName',
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'工单状态',
                    prop:'OrderState',
                    width:'15%',
                    color:'#FBA31E',
                    formatter:(val)=>orderState[val]
                }
            ]
        }
    },
    props:['isOpen'],
    components:{
        number,
        zwTable,
        bMap,
        leftSide
    },
    computed:{
        myAudio(){
            return document.getElementById('myAudio')
        }
/*         swiper(){
            return  this.$refs.mySwiper.swiper
        } */
    },
    watch:{

    },
    created(){
        this.formID = this.$route.params.formID || 1
        this.queryData()
        this.$websocket.onclose = () => {
            this.$initWebSocket()
            this.queryData()
        }
    },
    updated(){
/*         if(this.fireList.length>0){
            this.swiper.init();
        } */
    },
    mounted(){
    },
    beforeDestroy(){
        clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        queryData(){
            this.$socket({
                FRouterName:'QueryBlocHomePageCount',
                FAction:'QueryBlocHomePageCount',
                FormID:this.formID
            },this.handleData)
        },
        handleData(data){
            console.log(new Date(),data);
            [this.systemList,this.fireList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject
            if(this.formID == 3){
                this.systemList = [{
                    AlarmKind: 0,
                    IconName: "icon-SZYJY-Chargingpile",
                    ParamID: 1,
                    SystemParamName: "充电桩系统",
                    mBlocHomePageCounts:[
                        {
                            AlarmCount: 0,
                            CountName: "充电桩",
                            DeviceCount: 0,
                            DeviceTypeID: 101,
                            IconName: "icon-SZYJY-Chargingpile",
                            ParamID: 1,
                            SystemParamIconName: "icon-SZYJY-Chargingpile",
                            SystemParamName: "充电桩系统",
                        }
                    ]
                },{
                    AlarmKind: 0,
                    IconName: "icon-SZYJY-Chargingpile",
                    ParamID: 1,
                    SystemParamName: "危化品系统",
                    mBlocHomePageCounts:[
                        {
                            AlarmCount: 0,
                            CountName: "可燃气体",
                            DeviceCount: 55,
                            DeviceTypeID: 101,
                            IconName: "icon-FireAlarm",
                            ParamID: 2,
                            SystemParamIconName: "icon-SZYJY-Chargingpile",
                            SystemParamName: "充电桩系统",
                        }
                    ]
                }]
                this.fireList = [{
                    Address: "创新科技广场二期",
                    AlarmTime: "0001-01-01T00:00:00",
                    DeviceCount: 0,
                    DeviceName: null,
                    Flat: "22.5359873547",
                    Flng: "114.0378070593",
                    ProjectID: 64,
                    ProjectName: "中物互联",
                    PropertyLeader: "陈丽霞",
                    PropertyPhone: "13066853062",
                    isAlarm: false,
                    mBlocHomePageProjectItems: Array(0),
                    unNormal: false
                }]
            }
            this.fireList.forEach(item => {
                let isAlarm = false
                let unNormal = item.mBlocHomePageProjectItems.some(obj => obj.ItemCount>0)
                if(this.formID == 1){
                    isAlarm = item.mBlocHomePageProjectItems.some(obj => obj.ItemName == '火警数'&&obj.ItemCount>0)
                }
                item.isAlarm = isAlarm
                item.unNormal = unNormal
            })
            this.fireList.sort((a,b) =>b.isAlarm - a.isAlarm ).sort((a,b) => b.unNormal -a.unNormal)
            if(this.lastAlarmTime ==''){
                this.lastAlarmTime = this.count.LastAlarmTime
            }
            if(new Date(this.lastAlarmTime) < new Date(this.count.LastAlarmTime)){
                this.lastAlarmTime = this.count.LastAlarmTime
                this.alarmTimes = 0
            }
            let isAlarm = this.fireList.some((item) => item.isAlarm)
            this.$nextTick(() => {
                if(this.alarmTimes<3&&this.isOpen ==1 && isAlarm){
                    this.playWarn()
                }
                if(!this.$refs.map) return
                this.showMarks(this.resetView)
                this.resetView = false 
            })
        },
        /**
         * 播放报警声
         */
        playWarn(){
            if(this.alarmTimes < 3){
                this.myAudio.play()
                this.alarmTimes ++ //只报警三次
                setTimeout(this.playWarn,3000)
            }
        },
        /**
         * @param {Boolean} resetView 改变中心位置
         */
/*         queryData(resetView = false){
            HomePage({
                FAction:'QueryBlocHomePageCount',
                FormID:this.formID
            })
            .then((data) => {
                [this.systemList,this.fireList,this.wariningData,this.fireAlarmData,this.count] = data.FObject&&data.FObject
                this.fireList.forEach(item => {
                    let isAlarm = false
                    let unNormal = item.mBlocHomePageProjectItems.some(obj => obj.ItemCount>0)
                    if(this.formID == 1){
                        isAlarm = item.mBlocHomePageProjectItems.some(obj => obj.ItemName == '火警数'&&obj.ItemCount>0)
                    }
                    item.isAlarm = isAlarm
                    item.unNormal = unNormal
                })
                this.fireList.sort((a,b) =>b.isAlarm - a.isAlarm ).sort((a,b) => b.unNormal -a.unNormal)
                if(this.lastAlarmTime ==''){
                    this.lastAlarmTime = this.count.LastAlarmTime
                }
                if(new Date(this.lastAlarmTime) < new Date(this.count.LastAlarmTime)){
                    this.lastAlarmTime = this.count.LastAlarmTime
                    this.alarmTimes = 0
                }
                let isAlarm = this.fireList.some((item) => item.isAlarm)
                this.$nextTick(() => {
                    if(this.alarmTimes<3&&this.isOpen ==1 && isAlarm){
                        this.myAudio.play()
                        this.alarmTimes ++ //只报警三次
                    }
                    if(!this.$refs.map) return
                    this.showMarks(resetView) 
                })
                this.timer = setTimeout(this.queryData,3000)
            }).catch((err) => {
                console.log(err)
            });
        }, */
        content(item){
            let temp = `
                <div class = 'info-window'>
                    <h5>${item.ProjectName}</h5> 
                    <ul >
                        <li><span>项目地址：</span>${item.Address}</li>
                        <li><span>安全负责人：</span>${item.PropertyLeader||'--'}　${item.PropertyPhone||'--'}</li>
                       `
            if(item.isAlarm||item.unNormal){
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
        showMarks(resetView){
            let Map = this.$refs.map
            Map.map.clearOverlays()
            this.fireList.forEach((item,i) => {
                if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
                  return
                }
                const point = new BMap.Point(item.Flng,item.Flat)
                let marker,icon,img,temp
                if(item.isAlarm||item.unNormal){
                    img = require(`@/assets/image/marker/icon_wrong_${this.formID}.gif`)
                    icon = Map.setIcon(img,75,75)
                }else{
                    img = require(`@/assets/image/marker/icon_normal_${this.formID}.png`)
                    icon = Map.setIcon(img,34,40)
                }
                marker = new BMap.Marker(point,{icon:icon})
                if(item.isAlarm||item.unNormal){
                    marker.setZIndex({zIndex:10})
                }
                temp = this.content(item)
                Map.map.addOverlay(marker)
                resetView && Map.map.centerAndZoom(point, 11);
                /* Map.setLabel(marker,item.ProjectName) */
                let label
                if(item.isAlarm||item.unNormal){
                    // Map.map.centerAndZoom(point, 11)
                    label = new BMap.Label(item.ProjectName,{offset:new BMap.Size(50,40)})
                    label.setStyle({
                      color:'red',
                      borderColor:'white',
                      padding:'4px 10px',
                    })
                    /* marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画 */
                    /* Map.openInfoWindow(temp,point) */
                }else{
                    label = new BMap.Label(item.ProjectName,{offset:new BMap.Size(20,20)})
                    label.setStyle({
                      color:'#999999 ',
                      backgroundColor:'rgb(227, 228, 228)',
                      borderColor:'rgb(227, 228, 228)',
                      padding:'0 10px',
                    })
                }
                marker.setLabel(label)
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
            if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
              return
            }
            const point = new BMap.Point(item.Flng,item.Flat)
            let Map = this.$refs.map
            Map.map.centerAndZoom(point,15)
            let temp = this.content(item)
            Map.openInfoWindow(temp,point)
        },
        changeRouter(item){
            sessionStorage.setItem('projectID',item.ProjectID)
            sessionStorage.setItem('projectName',item.ProjectName)
            this.$router.push(`/indexItem/${this.formID}`)
        },
        rowClick(row){
            sessionStorage.setItem('projectID',row.ProjectID)
            sessionStorage.setItem('projectName',row.ShortName)
            this.$router.push(`/indexItem/${row.FormID}`)
        }
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
