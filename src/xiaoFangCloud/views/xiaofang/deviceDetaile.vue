<template>
    <div class="device-detaile">
        <div class="l">
            <el-scrollbar>
                <el-tree
                 ref="tree"
                 :data="treeData"
                  highlight-current
                  default-expand-all
                  :props="treeProp"
                  node-key="DeviceID"
                  @node-click="handleClick"
                 >
                    <span slot-scope="{ node, data }">
                        <span v-if="data.index === 0">
                            {{data.SystemParamName}}
                        </span>
                        <span v-else-if="data.index === 1">
                            {{data.DeviceTypeName}}
                        </span>
                        <span v-else>
                            {{data.DeviceName}}
                        </span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="device-info">
            <div>
                <div class="item-header">
                    <i class="iconfont icon-SZXFY-Monitor"></i>
                    实时监测
                </div>
                <div class="monitor">
                    <div class="device-statu">
                        <div class="l">
                            <i :class="['iconfont',deviceInfo.IconName]" :style="{'color':colors[deviceMonitorInfo.DeviceColor]}"></i>
                        </div>
                        <div>
                            <p>{{deviceInfo.DeviceName}}</p>
                            <p :style="{'color':colors[deviceMonitorInfo.DeviceColor]}">{{deviceMonitorInfo.DeviceStatusName}}</p>
                        </div>
                    </div>
                    <ul v-if="deviceMonitorInfo.mDeviceHomePageShowPositions">
                        <li :class="{active:active == i}" v-for="(item,i) in deviceMonitorInfo.mDeviceHomePageShowPositions" @click="selectItem(item,i)" :key="i">
                            <span class="label">{{item.ShowName}}<span v-if="item.Unit">（{{item.Unit}}）</span></span> {{(formID==2&&i==0)?statu[item.ShowData]:item.ShowData}}
                        </li>
                    </ul>
                    <div class="chart">
                        <div v-if="deviceInfo.DeviceTypeID ==500" style="margin-top:16px;padding-left:30px;line-height:40px;text-align:left"></div>
                        <div :class="['time-select',{right:deviceInfo.DeviceTypeID ==500}]">
                            <span>时间　</span>
                            <el-date-picker v-model="time" type="date" @change="timeChange"></el-date-picker>
                        </div>
                        <line-chart v-if="deviceInfo.DeviceTypeID !=500&&lineData.columns&&lineData.columns.length>0" :data='lineData' :color='["#FBA31E","#5FCDF2","#FF3600"]'></line-chart>
                        <div class="alarm-list"  v-else>
                            <el-scrollbar v-loadmore="loadMore">
                                <ul>
                                    <li  v-for="(item,i) in record" :key="i"><span class="l">{{item.AlarmTime}}</span><span>{{item.eventTypeName}}</span><span class="">{{item.AlarmText}}</span></li>
                                </ul>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="item-header">
                    <i class="iconfont icon-SZXFY-basicinformation"></i>
                    基本信息
                    <p class="r">
                        <i class="iconfont icon-SZXFY-date"></i>
                        大事记
                    </p>
                </div>
                <div class="basi-info l" v-if="deviceInfo.index">
                    <ul class="basi-info-list l">
                        <li class="l" v-for="(item,i) in basiInfo" :key="i">
                            <span class="label">{{item.label}}　</span>
                            {{deviceInfo[item.prop]}}
                        </li>
                    </ul>
                    <div class="device-img r">
                        <div>
                            <el-image :src="`http://www.caszyj.com/${deviceInfo.DeviceLedgerPhoto}`" alt="">
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                              </div>
                            </el-image>
                            <p>
                                设备照片
                            </p>
                        </div>
                        <div>
                            <el-image :src="`http://www.caszyj.com/${deviceInfo.DeviceLedgerQrCode}`" alt="">
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                              </div>
                            </el-image>
                            <p>设备二维码</p>
                        </div>
                    </div>
                </div>
                <div class="event-record" v-if="deviceInfo.index">
                    <el-scrollbar>
                        <ul>
                            <li v-for="(item,i) in deviceEvent" :key="i">
                                <p class="event-text">{{item.EventsText}}</p>
                                <div class="icon-time">
                                    <p class="event-time" :title="item.EventsTime&&item.EventsTime.split(' ')[0]">{{item.EventsTime&&item.EventsTime.split(' ')[0]}}</p>
                                    <div>
                                        <div class="circle">
                                        </div>
                                        <div class="line">
                                        </div>
                                    </div>
                                </div>
                                <div class="event-item">
                                    <i :class="['iconfont',item.WebIconName]"></i>
                                </div>
                            </li>
                            <li>
                                <div class="event-year">
                                    {{new Date().getFullYear()}}
                                </div>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Project,Alarm} from '@/xiaoFangCloud/request/api.js'
import {lineChart} from '@/components/index.js'
export default {
    data(){
        return{
            formID:1,
            treeData:[],
            treeProp:{
                children:'Data'
            },
            basiInfo:[ //基本信息字段
                {label:'设备名称',prop:'DeviceName'},
                {label:'设备编码',prop:'DeviceCode'},
                {label:'规格类型',prop:'SpecificationsCode'},
                {label:'设备类型',prop:'DeviceTypeName'},
                {label:'生产厂商',prop:'Manufacturer'},
                {label:'系统类型',prop:'SystemParamName'},
                {label:'保质年限',prop:'ServiceLife'},
                {label:'安装位置',prop:'Address'},
                {label:'出厂日期',prop:'ManufacturingTime'},
                {label:'启用日期',prop:'OperatingDateTime'},
                {label:'相关参数',prop:'DeviceLedgerParam'},
                {label:'配置参数',prop:'AcsDeviceLedgerParam'},
            ],
            deviceInfo:{ //设备基本信息
            },
            deviceMonitorInfo:{},
            active:0,
            showPosition:null,
            pageIndex:1,
            time:new Date(),
            lineData:{
            },
            record:[] ,//消防主机记录
            deviceEvent:[],
            type:1,
            timer:null,
            colors:['','#1bd1a1', '#73777a', '#0091fe', '#fef500', '#FC0404'],
            statu:{'-1':'下行','1':'上行','0':'停止'}, //电梯状态
            swiperOption:{
                init:false,
                autoplay: {
                    disableOnInteraction: false,
                },
                direction : 'vertical',
                speed:300,
                loop:true,
                slidesPerView: 4,
                slidesPerGroup : 4,
            }
        }
    },
    components:{
        lineChart,
    },
    computed:{
    },
    directives:{
        loadmore:{
            bind(el, binding){
                var p = 0;
                var t = 0;   
                var down = true;
                var selectWrap = el.querySelector('.el-scrollbar__wrap')    
                selectWrap.addEventListener('scroll', function() {      
                  //判断是否向下滚动      
                  p = this.scrollTop;      // 
                  if ( t < p){
                    down=true
                  }else{
                    down=false
                  }      
                  t = p;      //判断是否到底      
                  const sign = 10;      
                  const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight      
                  if (scrollDistance <= sign && down) {        
                    binding.value()      
                  }    
                })  
            }
        }
    },
    created(){
        this.formID = this.$route.params.formID
        this.queryDevice()
    },
    methods:{
        /**
         * 查询树状系统分类设备
         */
        queryDevice(){
            Project({
                FAction:'QuerySystemUDeviceLedgerTree',
                FormID:this.formID
            })
            .then((data) => {
                this.treeData = data.FObject
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(this.$route.params.id)
                    this.deviceInfo = this.$refs.tree.getCurrentNode()
                    this.queryMonitorData(this.deviceInfo)
                    this.queryUDeviceEvents(this.deviceInfo)
                })
            }).catch((err) => {
                
            });
        },
        handleClick(data){
            this.active = 0
            this.showPosition = null
            if(data.index === 2){
                this.deviceInfo = data
                this.queryMonitorData(data)
                this.queryUDeviceEvents(data)
            }else{
                this.deviceInfo = {}
                this.deviceMonitorInfo = {}
                this.lineData = {}
                this.deviceEvent = []
                this.record = []
            }
        },
        /**
         * 查询设备实时数据
         */
        queryMonitorData(){
            if(!this.deviceInfo.DeviceID){
                return
            }
            Project({
                FAction:'QueryDeviceRealData',
                DeviceID:this.deviceInfo.DeviceID,
                SystemParamID:this.deviceInfo.SystemParamID
            })
            .then((data) => {
                this.deviceMonitorInfo = data.FObject[0]||{}
                if(this.deviceInfo.DeviceTypeID ==500){
                    /* let type = this.deviceMonitorInfo.mDeviceHomePageShowPositions[0].ShowPosition */
                    this.queryUAlarmByDate()
                }else{
                    if(this.showPosition){
                        console.log(this.showPosition)
                        this.queryLineData(this.showPosition)
                    }else{
                        this.queryLineData(this.deviceMonitorInfo.mDeviceHomePageShowPositions[0].ShowPosition)
                    }
                }
                this.timer = setTimeout(() => {
                    this.queryMonitorData()
                },3000)
            }).catch((err) => {
                
            });
        },
        /**
         * 查询设备大事记
         */
        queryUDeviceEvents(obj){
            Project({
                FAction:'QueryUDeviceEvents',
                DeviceID:obj.DeviceID
            })
            .then((data) => {
                this.deviceEvent = data.FObject.reverse()
            }).catch((err) => {
            });
        },
        selectItem(item,i){
            if(this.deviceInfo.DeviceTypeID ==500){
               /*  this.queryUAlarmByDate(item.ShowPosition) */
            }else{
                this.active = i;
                this.queryLineData(item.ShowPosition)
            }
        },
        queryUAlarmByDate(scroll = false){
            if(!scroll){
              this.pageIndex = 1
            }
            Alarm({
                FAction:'QueryUAlarmByDate',
                ID:this.deviceInfo.DeviceID,
                FDateTime:this.time.toLocaleDateString(),
                FType:0,
                PageIndex:this.pageIndex,
                PageSize:20
            })
            .then((data) => {
                if(scroll){
                    if(data.FObject.length>0){
                        this.record.push(...data.FObject)
                    }else{
                        this.pageIndex --
                    }
                }else{
                    this.record  = data.FObject
                }
            }).catch((err) => {
                
            });
        },
        loadMore(){
            this.pageIndex ++
            this.queryUAlarmByDate(true)
        },
        /**
         * 查询曲线图数据
         */
        queryLineData(item = this.showPosition,i = this.active){
            this.active = i
            this.showPosition = item
            Project({
                FAction:'QueryDataItemChartDataByDeviceID',
                DeviceID:this.deviceInfo.DeviceID,
                FDateTime:this.time.toLocaleDateString(),
                ShowPosition:item===null?-2:item
            })
            .then((data) => {
                let chartData = {
                    name:[],
                    columns:[],
                    rows:{}
                },
                arr = data.FObject
                chartData.name = arr.map(item => item.DataItemName)
                chartData.columns = arr[0]&&arr[0].ProjectChartLineDatas.map(item => item.X)
                chartData.rows = arr.map(item => {
                    let yAxis = item.ProjectChartLineDatas.map(obj => obj.Y)
                    return {
                      type: "line",
                      name: item.DataItemName,
                      data: yAxis
                    };
                }) 
                this.lineData = chartData
            }).catch((err) => {
                console.log(err)
            });
        },
        timeChange(){
            if(this.deviceInfo.DeviceTypeID ==500){
                this.queryUAlarmByDate()
            }else{
                 this.queryLineData()
            }
        }
    },
    beforeDestroy(){
        clearTimeout(this.timer)
        this.timer = null
    }
}
</script>
<style lang="scss">
$url:'../../../assets/image/cloud/index/';
.device-detaile{
    width: 1913px;
    height:970px;
    box-sizing: border-box;
    margin: 20px auto 0 auto;
    padding: 24px 0 22px 25px;
    background: url(#{$url}detaile_bg.png);
    .label{
        color: #A4A3A5;
        font-size: 18px;
    }
    >div.l{
        width: 261px;
        height: 100%;
        padding: 20px 0;
        box-sizing: border-box;
        border:2px solid #19318D;
        border-radius:10px 6px 6px 10px;
        .el-tree{
            background: none;
            padding-left: 20px;
            .el-input__inner{
                background: none;
                border: none;
                font-size: 16px;
                color: #9EE5F3
            }
            .el-tree-node:focus {
                >.el-tree-node__content {
                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                }
            }
            &-node__content{
                height: 66px;
                line-height: 66px;
                span{
                    font-size: 16px;
                    color: #9EE5F3
                }
                .el-tree-node__expand-icon.is-leaf{
                    color: transparent
                }
            }
            &-node__content:hover {
                background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
            }
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
            background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
        }
    }
    .device-info{
        margin-left: 260px;
        height: 100%;
        >div{
            .item-header{
                height:55px;
                padding-left: 20px;
                position: relative;
                line-height: 55px;
                border-radius:10px 6px 6px 10px;
                font-size: 20px;
                text-align: left;
                background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
                .iconfont{
                    font-size: 24px;
                    vertical-align: middle;
                }
                p{
                    position: absolute;
                    top: 0;
                    right: 370px;
                    font-size: 18px;
                }
            }
            .monitor{
                height: 286px;
                display: flex;
                .device-statu{
                    width: 304px;
                    height: 100%;
                    position: relative;
                    >div.l{
                        height: 100%;
                        line-height: 286px;
                        margin-left: 30px;
                        .iconfont{
                            font-size: 100px;
                            color: #03CD82;
                            vertical-align: middle;

                        }
                    }
                    >div:last-of-type{
                        position: absolute;
                        left: 130px;
                        top:50%;
                        transform: translateY(-50%);
                        text-align: left;
                        line-height: 40px;
                        p:first-of-type{
                            font-size:22px;
                            font-family:MicrosoftYaHeiUI;
                            font-weight:400;
                            color:rgba(182,192,220,1);
                        }
                        p:last-of-type{
                            font-size:18px;
                            font-family:MicrosoftYaHeiUI;
                            font-weight:400;
                            color:rgba(3,205,130,1);
                        }
                    }
                }
                .device-statu:after{
                    content: '';
                    display: block;
                    width: 4px;
                    height: 193px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 4px;
                    background: url(#{$url}/border-right.png);
                }
                >ul{
                    margin-top: 16px;
                    >li{
                        width:375px;
                        height:44px;
                        padding-left: 45px;
                        line-height: 44px;
                        font-size:20px;
                        font-weight:400;
                        color:#03CD82;
                        text-align: left;
                        cursor: pointer;
                        .label{
                            display: inline-block;
                            width: 180px;
                        }
                    }
                    >li.active{
                        background:linear-gradient(90deg,rgba(6,34,75,1),rgba(16,61,138,1),rgba(36,85,167,1),rgba(6,34,75,1));
                    }
                }
                .chart{
                    width: 806px;
                    height: 100%;
                    padding-top: 10px;
                    padding-bottom: 20px;
                    box-sizing: border-box;
                    position: relative;
                    .time-select{
                        position: absolute;
                        left: 64px;
                        top: 16px;
                        z-index: 10000;
                        .el-date-editor{
                            width: 150px;
                            height: 40px;
                            .el-input__inner{
                                background:rgba(40,70,114,1);
                                border:1px solid rgba(12,55,110,1);
                                color:rgba(165,239,252,1);
                            }
                        }
                    }
                    .time-select.right{
                        left: 600px;
                    }
                    .alarm-list{
                        margin-top: 60px;
                        margin-left: 30px;
                        height: 200px;
                        li{
                            line-height: 39px;
                            border-bottom: 1px solid #5F6B91;
                            text-align: left;
                            span.l{
                                width: 200px;

                            }
                            span:nth-of-type(2){
                                width: 200px;
                                display: inline-block;
                            }
                        }
                    }
                }
            }
            .basi-info{
                width: 1153px;
                height: 510px;
                padding-top: 20px;
                position: relative;
                &-list{
                    width: 830px;
                    height: 100%;
                    li{
                        width: 50%;
                        box-sizing: border-box;
                        padding-left: 40px;
                        line-height: 60px;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 20px;
                        font-weight:400;
                    }
                }
            }
            .device-img{
                width: 233px;
                height: 100%;
                position: relative;
                left: -80px;
                display: flex;
                flex-direction: column;
                justify-content:space-around;
                p{
                    color: #A4A3A5;
                    font-size: 18px;
                    margin-top: 10px;
                }
                .el-image{
                    width: 148px;
                    height: 148px;
                }
                .image-slot{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    background: #f5f7fa;
                    color: #909399;
                    font-size: 20px;
                }
            }
            .basi-info:after{
                content: '';
                display: block;
                width: 4px;
                height: 193px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 4px;
                background: url(#{$url}/border-right.png);
            }
            .event-record{
                width: 467px;
                height: 510px;
                float: right;
                ul{
                    padding: 40px 0;
                    li{
                        display: flex;
                        align-items: center;
                        .event-text{
                            width: 180px;
                            text-align: right;
                            font-size:18px;
                            margin-right: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .icon-time{
                            .event-time{
                                width: 80px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            >div{
                                display: flex;
                                .circle{
                                    width:6px;
                                    height:6px;
                                    background:rgba(96,229,247,1);
                                    border-radius:50%;
                                }
                                .line{
                                    width:74px;
                                    height:2px;
                                    margin-top: 2px;
                                    background:rgba(96,229,247,1);
                                }
                            }
                        }
                        .event-item{
                            width: 53px;
                            height: 53px;
                            margin-left: 20px;
                            position: relative;
                            line-height: 53px;
                            border-radius: 50%;
                            background: #429FB9;
                            box-shadow: 0 0 0 10px #30779D,0 0 0 16px rgba($color: #173969, $alpha: 0.5);
                            .iconfont{
                                color: white;
                            }
                        }
                        .event-item:after{
                            content: '';
                            display: block;
                            width:2px;
                            height:54px;
                            position: absolute;
                            left: 50%;
                            z-index: 10;
                            margin-left: -1px;
                            background:rgba(96,229,247,1);

                        }
                        .event-year{
                            width: 78px;
                            height: 78px;
                            margin-left: 272px;
                            position: relative;
                            line-height: 78px;
                            border-radius: 50%;
                            background: #429FB9;
                            box-shadow: 0 0 0 10px #30779D,0 0 0 18px rgba($color: #173969, $alpha: 0.5);
                            .iconfont{
                                color: white;
                            }
                        }
                    }
                    li+li{
                        margin-top: 54px;
                    }
                }
            }
        }
    }
}
</style>
