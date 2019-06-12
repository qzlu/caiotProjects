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
<!--                 <swiper class="list" ref="mySwiper"  :options="swiperOption">
                    <swiper-slide :class="{alarm:item.FireCount>0,'active':active === i}" v-for="(item,i) in fireList" :key="item.ProjectID" >
                        <div style="width:100%;height:100%" @click="selectProject(item,i)" @dblclick="changeRouter(item)">
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
                        </div>
                    </swiper-slide>
                </swiper> -->
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
                <zw-table icon='icon-FireAlarm' title="实时火警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
                <zw-table icon='icon-SZXFY-Earlywarning' title="实时预警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='wariningData?wariningData.Data:[]' ></zw-table>
            </div>
            <div class="main-footer" v-else>
                <zw-table icon='icon-SZXFY-Earlywarning' title="实时告警" :width='1100' :bodyHeight='170' :labels='tableLabel1' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,bMap} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
import leftSide from './leftSide.vue'
let orderState = ['','待完成','已完成','待接单','待派单','已逾期','未完成']
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
            test:1,
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
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'当前状态',
                    prop:'OrderState',
                    width:'15%',
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
                    label:'当前状态',
                    prop:'OrderState',
                    width:'15%',
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
        this.formID = this.$route.params.formID
        this.queryData(true)
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
        /**
         * @param {Boolean} resetView 改变中心位置
         */
        queryData(resetView = false){
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
                let isAlarm = this.fireList.some((item) => item.isAlarm)
                this.$nextTick(() => {
                    this.isOpen ==1 && isAlarm && this.myAudio.play()
                    if(!this.$refs.map) return
                    this.showMarks(resetView) 
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
                const point = new BMap.Point(item.Flat,item.Flng)
                let marker,icon,img,temp
                if(item.isAlarm||item.unNormal){
                    img = require(`@/assets/image/marker/icon_wrong_${this.formID}.png`)
                    icon = Map.setIcon(img,40,54)
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
                let label = new BMap.Label(item.ProjectName,{offset:new BMap.Size(20,20)})
                if(item.isAlarm||item.unNormal){
                    // Map.map.centerAndZoom(point, 11)
                    label.setStyle({
                      color:'red',
                      borderColor:'white',
                      padding:'4px 10px',
                    })
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    Map.openInfoWindow(temp,point)
                }else{
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
            const point = new BMap.Point(item.Flat,item.Flng)
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
