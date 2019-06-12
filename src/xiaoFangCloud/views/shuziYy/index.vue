<template>
    <div class="yingji">
        <div class="left-side l">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FTotalCount:0"></number>
                <span>当前告警</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                    <ul class="list">
                        <li :class="['system-card',{unnormal:item.AlarmKind == 1,'alarm':item.AlarmKind == 2}]" v-for="(item,i) in systemList[0]" :key="i">
                            <router-link :to="`/index/${item.FormID}`">
                                <h3>
                                   <i :class="['iconfont','icon-'+item.IconName]"></i>
                                   <span>{{item.FormName}}</span>
                                   <i class="iconfont icon-Up"></i>
                                   <ul class="r">
                                       <li>
                                           <i class="iconfont icon-Numberofentry"></i>
                                           {{item.ProjectCount||0}}
                                       </li>
                                       <li style="margin-top:0">
                                           <i class="iconfont icon-Equipment"></i>
                                           {{item.DeviceCount}}
                                       </li>
                                   </ul>
                                </h3>
                                <div class="list-content">
                                    <div class="statu">
                                    </div>
                                    <ul class="param">
                                        <li v-for="(obj,j) in item.Items" :key="j">
                                            <p class="l" :title="obj.ItemName">
                                                <i :class="['iconfont',obj.IconName]"></i>
                                                {{obj.ItemName}}
                                            </p>
                                            <span class="value">
                                                <span :class="{red:obj.AlarmCount>0}">{{obj.AlarmCount}}</span> / {{obj.ItemCount}}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                 </el-scrollbar>
            </div>
        </div>
        <div class="right-side r">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FDayCount:0"></number>
                <span>当日告警</span>
            </div>
            <div class="side-content">
                    <ul class="list">
                        <li :class="['system-card',{unnormal:item.AlarmKind == 1,'alarm':item.AlarmKind == 2}]" v-for="(item,i) in systemList[1]" :key="i">
                            <router-link :to="`/index/${item.FormID}`">
                                <h3>
                                   <i :class="['iconfont','icon-'+item.IconName]"></i>
                                   <span>{{item.FormName}}</span>
                                   <i class="iconfont icon-Up"></i>
                                   <ul class="r">
                                       <li>
                                           <i class="iconfont icon-Numberofentry"></i>
                                           {{item.ProjectCount||0}}
                                       </li>
                                       <li style="margin-top:0">
                                           <i class="iconfont icon-Equipment"></i>
                                           {{item.DeviceCount}}
                                       </li>
                                   </ul>
                                </h3>
                                <div class="list-content">
                                    <div class="statu">
                                    </div>
                                    <ul class="param">
                                        <li v-for="(obj,j) in item.Items" :key="j">
                                            <p class="l" :title="obj.ItemName">
                                                <i :class="['iconfont',obj.IconName]"></i>
                                                {{obj.ItemName}}
                                            </p>
                                            <span class="value">
                                                {{obj.ItemCount}} / <span :class="{red:obj.AlarmCount>0}">{{obj.AlarmCount}}</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </router-link>
                        </li>
                    </ul>
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
                    <p class="l">{{count.DeviceCount}}</p>
                </li>
            </ul>
            <div id="map">
                <b-map ref="map"></b-map>
            </div>
            <div class="main-footer">
                <zw-table 
                  icon='icon-SZXFY-Earlywarning' 
                  title="实时告警" 
                  :showMore='true' 
                  @click="queryMonitorData" 
                  @rowClick='rowClick' 
                  :width='1070' 
                  :bodyHeight='170' 
                  :labels='tableLabel1' 
                  :data='fireAlarmData?fireAlarmData.Data:[]' >
                </zw-table>
            </div>
            <el-dialog class="zw-dialog" :visible.sync = 'show' title="实时告警" append-to-body width="910px">
                <div class="clearfix">
                    <div class="shuzi-yy r">
                        <el-radio-group v-model="time" @change="selectDate">
                           <el-radio-button label="今日"></el-radio-button>
                           <el-radio-button label="本周"></el-radio-button>
                           <el-radio-button label="本月"></el-radio-button>
                        </el-radio-group>
                        <span style="margin:0 10px">时间段</span>
                        <el-date-picker ref="pick" v-model="time1" type="datetimerange" @change="queryMonitorData" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="table" style="margin-top:20px">
                    <table style="width:100%;color:white">
                        <thead>
                            <tr>
                                <th v-for="(item,i) in tableLabel" :width='item.width' :key="i">{{item.label}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,i) in monitorData" :key="i">
                                <td v-for="(obj,j) in tableLabel" :key="j" :width='obj.width'>{{obj.formatter?obj.formatter.call(null,item[obj.prop]):item[obj.prop]}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable,bMap} from '@/components/index.js'
import {HomePage,Alarm} from '@/xiaoFangCloud/request/api.js'
import {zwPagination} from '@/components/index'
let orderState = ['','待完成','已完成','待接单','待派单','已逾期','未完成']
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
            show:false,
            time:'今日',
            time1:[new Date(new Date().toLocaleDateString()),new Date()],
            total:0,
            pageIndex:1,
            monitorData:[],
            tableLabel:[
                {
                    label:'序号',
                    prop:'RowIndex',
                    width:'10%'
                },
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'20%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'当前状态',
                    prop:'OrderState',
                    width:'10%',
                    formatter:(val)=>orderState[val]
                },
            ],
            tableLabel1:[
                {
                    label:'序号',
                    prop:'RowIndexs',
                    width:'10%'
                },
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'20%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'20%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'40%'
                },
                {
                    label:'当前状态',
                    prop:'OrderState',
                    width:'10%',
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
        zwPagination
    },
    computed:{
        myAudio(){
            return document.getElementById('myAudio')
        }
    },
    watch:{

    },
    created(){
        this.queryData(true)
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
        /**
         * @param {Boolean} resetView 改变中心位置
         */
        queryData(resetView = false){
            HomePage({
                FAction:'QueryDigtalHomePageCount'
            })
            .then((data) => {
                let systemList
                [this.count,systemList,this.fireAlarmData,this.fireList] = data.FObject&&data.FObject
                let len = Math.ceil(systemList.length/2)
                let arr1 = systemList.slice(0,len)
                let arr2 = systemList.slice(len)
                this.systemList = [arr1,arr2]
                let isAlarm = this.fireList.some((item) => item.FireCount>0)
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
        showMarks(resetView){
            let Map = this.$refs.map
            Map.map.clearOverlays()
            window.$BAIDU$._instances = {}
            this.fireList.forEach((item,i) => {
                if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
                  return
                }
                const point = new BMap.Point(item.Flat,item.Flng)
                let marker,icon,img,temp
                if(item.FireCount>0){
                    img = require('@/assets/image/marker/333(1).gif')
                    icon = Map.setIcon(img,75,75)
                }else{
                    img = require('@/assets/image/marker/bMap_icon.png')
                    icon = Map.setIcon(img,34,40)
                }
                marker = new BMap.Marker(point,{icon:icon})
                item.FireCount&&marker.setZIndex({zIndex:10})
                temp = this.content(item)
                Map.map.addOverlay(marker)
                resetView && Map.map.centerAndZoom(point, 11);
                /* Map.setLabel(marker,item.ProjectName) */
                let label
                if(item.FireCount>0){
                    /* Map.map.centerAndZoom(point, 11) */
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
        selectDate(val){
            const end = new Date();
            if(val === '今日'){
                const start = new Date();
                this.time1 = [new Date(start.toLocaleDateString()),end]
            }else if(val === '本周'){
                const start = new Date(new Date().toLocaleDateString()).getTime() - 3600*1000 *24*(new Date().getDay()-1);
                this.time1 = [new Date(start),end]
            }else{
                const start = new Date(new Date().toLocaleDateString()).getTime() - 3600*1000 *24*(new Date().getDate()-1);
                this.time1 = [new Date(start),end]
            }
            this.queryMonitorData()
        },
        queryMonitorData(){
            this.show = true
            Alarm({
                FAction:'QueryPageUAlarmByDate',
                PageIndex:this.pageIndex,
                PageSize:10,
                StartDateTime:this.time1[0].toLocaleDateString() +' ' + this.time1[0].toTimeString().split(' ')[0],
                EndDateTime:this.time1[1].toLocaleDateString() +' ' + this.time1[1].toTimeString().split(' ')[0]
            })
            .then((data) => {
                this.total = data.FObject.FTotalCount || 0
                this.monitorData = data.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryMonitorData()
        },
        rowClick(row){
            sessionStorage.setItem('projectID',row.ProjectID)
            sessionStorage.setItem('projectName',row.ShortName)
            this.$router.push(`/indexItem/${row.FormID}`)
        }
    }
}
</script>
<style lang="scss">
.home{
    .yingji{
        .left-side,.right-side{
            width: 413px;
            .list{
                >li.system-card{
                    height: 446px;
                    border: none;
                    background: url('../../../assets/image/cloud/index/leftbar.png');
                    background-size: 100% 100%;
                    cursor: pointer;
                    a{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        color: #A5EFFC;
                    }
                    h3{
                        padding-top: 21px;
                        padding-left: 5px;
                        font-size:18px;
                        font-weight:400;
                        color:rgba(165,239,252,1);
                        line-height:28px;
                        text-align: left;
                        .icon-Up{
                            display: inline-block;
                            margin-left: 10px;
                            font-size: 22px;
                            transform: rotate(90deg)
                        }
                        ul.r{
                            margin-right: 20px;
                            display: flex;
                            li{
                                line-height: 32px;
                                .iconfont{
                                    margin-right: 0;
                                }
                            }
/*                             background: url('../../../assets/image/shuziYy/number.png');
                            background-size: 100% 100%; */
/*                             li{
                                width:38px;
                                height:32px;
                                line-height: 32px;
                                text-align: center;
                                background:linear-gradient(0deg,rgba(61,111,182,1),rgba(16,56,113,1));
                                border:2px solid rgba(29, 118, 170, 1);
                                border-radius: 4px;
                                margin-top: 0;
                            } */
                            li+li{
                                margin-left: 40px;
                            }
                        }
                    }
                    .list-content{
                        height: 390px;
                        .param{
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;
                            li{
                                width: 100%;
                                height: 60px;
                                line-height: 60px;
                                font-size: 14px;
                                margin: 0;
                                p{
                                    width: 180px;
                                    height: 100%;
                                    line-height: 60px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    text-align: left;
                                    i{
                                        display: inline-block;
                                        width: 40px;
                                        vertical-align: middle;
                                    }
                                }
                            }
                        }
                    }
                }
                .system-card+.system-card{
                    margin-top: 16px;
                }
            }
        }
        .main{
            margin: 0 423px;
        }
    }
}
.zw-dialog .el-dialog__body {
    .shuzi-yy{
        height: 40px;
        color: #A5EFFC;
        font-size: 16px;
        .el-radio-group{
            color: #F1F1F2; 
            background:rgba(5,28,74,1);
            border:1px solid rgba(83,123,174,1);
            border-radius:8px;
            .el-radio-button{
                border: none;
                .el-radio-button__inner{
                    background: transparent;
                    border: none;
                    font-size:16px;
                    color: #F1F1F2; 
                }
            }
            .el-radio-button.is-active{
                background:linear-gradient(0deg,rgba(0,79,177,1),rgba(16,137,172,1));
                border-radius:8px;
                .el-radio-button__inner{
                    color: #F1F1F2; 
                }
            }
            .el-radio-button__orig-radio:checked+.el-radio-button__inner{
                box-shadow: none;
            }
        }
        .el-date-editor--datetimerange.el-date-editor {
            width: 380px;
            .el-range-input , .el-range-separator{
                background: none;
                color: #A5EFFC
            }
        }
    }
    .table{
        height: 510px;
        tr{
            th,td{
                height: 44px;
                line-height: 44px;
                text-align: center;
            }
        }
        tbody{
            tr:nth-of-type(2n+1){
                background: #0A3F8A
            }
            tr:nth-of-type(2n){
                background: #052A57
            }
        }
        .zw-pagination{
            bottom: 10px;
        }

    }
}

</style>
