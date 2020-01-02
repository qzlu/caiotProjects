<template>
    <div class="device-ctr">
        <div class="l device-ctr-left">
            <div class="mode-ctr box-shadow">
                <h4>控制模式 <button class="r operation-btn">群控策略</button></h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <ul class="tab-header">
                    <li :class="{active:activeIndex == i+1}" v-for="(item,i) in tabList" :key="i" @click="updateULdasAutoMode(i+1)">{{item}}</li>
                </ul>
                <div class="tab-content">
                    <ul class="operation-list clearfix">
                        <li v-for="(item,i) in operationList" :key="i">
                            <button class="operation-btn" @click="item.GroupMode==2?sendCMD('GroupCMD',item.GroupID):queryControlProjectAdjust(item.GroupID)">{{item.GroupShortName}}</button>
                        </li>
                    </ul>
                    <div class="mode">
                        <div class="title">
                            当前模式
                        </div>
                        <div v-if="currentMode">
                            <div class="mode-type-name">
                                {{currentMode.SceneName}}
                            </div>
                            <p>{{currentMode.Week}} <!-- <span class="badge">重复</span> --></p>
                            <p>{{currentMode.TimeStart}}<span v-if="currentMode.TimeEnd">~{{currentMode.TimeEnd}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mode-list box-shadow">
                <h4>今日场景</h4>
                <div class="border">
                </div>
                <div class="icon">
                </div>
                <div class="mode-record">
                    <el-scrollbar>
                        <ul>
                            <li :class="{unstart:!item.IsRun}" v-for="(item,i) in modeList" :key="i">
                                <p class="mode-name">{{item.SceneName}}</p>
                                <div class="icon-time">
                                    <p class="mode-time">{{item.TimeStart}}</p>
                                    <div>
                                        <div class="circle">
                                        </div>
                                        <div class="line">
                                        </div>
                                    </div>
                                </div>
                                <div class="mode-item">
                                    <i>{{i+1}}</i>
                                </div>
                                <span class="mode-state">{{item.IsRun?'已完成':'未开始'}}</span>
                                <button class="operation-btn" @click="sendCMD('GroupCMD',item.CmdID)">立即执行</button>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <div class="device-ctr-main box-shadow">
            <h4>区域控制 </h4>
            <div class="border">
            </div>
            <div class="icon">
            </div>
            <div class="main-top">
                <div :class="['l', 'operation', 'pre',{'no-click':lastIndex === 3}]" v-if="areaCount.length>4&&lastIndex>3" @click="pre()">
                    <i class="iconfont icon-Leftparentheses"></i>
                </div>
                <div :class="['r', 'operation', 'next',{'no-click':lastIndex >= areaCount.length-1}]" v-if="areaCount.length>4&&lastIndex<areaCount.length-1" @click="next()">
                    <i class="iconfont icon-Rightparentheses"></i>
                </div>
                <div class="area-container">
                    <ul class="area-list l" :style="{left:-(lastIndex-3)*310+'px'}">
                        <li :class="['item',{alarm:item.AlarmCount>0,active:activeArea&&item.AreaID == activeArea.AreaID}]" v-for="(item,i) in areaCount" :key="i" @click="selectArea(item)">
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
                                    <li v-for="(obj,j) in item.GroupCMDs" :key="j">
                                        <button class="operation-btn" @click.stop="obj.GroupMode==2?sendCMD('GroupCMD',obj.GroupID):queryUGroupDetail(obj.GroupID)">{{obj.GroupShortName}}</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="device-container">
                    <el-scrollbar>
                        <div>
                            <div class="device-type-list l" v-for="(item,i) in deviceTypes" :key="i">
                                <h5>
                                    <i class="iconfont icon-Flatlight"></i>
                                    {{item.DeviceType}}({{item.data.length}})
                                </h5>
                                <ul class="device-list clearfix">
                                    <li :class="['l',{'top10':j>3,'opening':device.DeviceStatus == 1}]" v-for="(device,j) in item.data" :key="j">
                                        <h5>
                                            <span>{{device.DeviceName}}</span>
                                            <button class="operation-btn"  v-for="(obj,j) in device.BaseCMDs" :key='j' @click="obj.CMDMode==1?sendCMD('BaseCMD',obj.CmdID):queryControlDeviceAdjust(device.DeviceID)">{{obj.CMDShortName}}</button>
                                        </h5>
                                        <div class="device-list-content">
                                            <div class="device-aside">
                                                <ul>
                                                    <li v-for="(obj,j) in device.DataDetail?device.DataDetail.slice(0,3):[]" :key="j">
                                                        <span>{{obj.SDataTitle}}</span>
                                                        <br><span>{{obj.SDataUnit||'--'}}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="device-control">
                                                <div class="device-statu">
                                                    <p><i class="iconfont icon-Flatlight"></i></p>
                                                    <p>{{device.DeviceStatusTitle}}</p>
                                                </div>
                                            </div>
                                            <div class="device-aside">
                                                <p></p>
                                                <ul>
                                                    <li v-for="(obj,j) in device.DataDetail?device.DataDetail.slice(3):[]" :key="j">
                                                        <span>{{obj.SDataTitle}}</span>
                                                        <br><span>{{obj.SDataUnit||'--'}}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <el-dialog title="全部遥调" class="zw-dialog" width="400px" :visible.sync="show">
            <ul>
                <li v-for="(item,i) in remoteControlList" :key="i"></li>
            </ul>
        </el-dialog>
    </div>
</template>
<script>
import {Control} from '@/caiot/request/api.js'
export default {
    data(){
        return{
            areaCount:[], //所有区域
            lastIndex:3, //记录区域当前显示的最后一个index
            activeArea:null,
            areaDevice:[], //区域设备
            tabList:['就地', '远程', '群控'],
            activeIndex:1,
            operationList:[],
            modeList:[],
            currentMode:null,
            deviceTypes:[],
            show:false,
            remoteControlList:[],
            timer:null,
            weekMap:{
                '1':'周一',
                '2':'周二',
                '3':'周三',
                '4':'周四',
                '5':'周五',
                '6':'周六',
                '7':'周日',
            }

        }
    },
    created(){
        this.queryData()
    },
    beforeDestroy(){
        clearTimeout(this.timer)
    },
    methods:{
        /**
         * 点击区域列表上一个
         */
        pre(){
            this.lastIndex > 3 && this.lastIndex --
        },
        /**
         * 点击区域列表下一个
         */
        next(){
            this.lastIndex < this.areaCount.length-1 && this.lastIndex ++
        },
        /**
         * 选择区域
         */
        selectArea(item){
            this.activeArea = item
            this.queryAreaControlDetail(item.AreaID)
        },
        queryData(){
            this.queryControlModeData()
            this.queryAreaControl()
            this.timer = setTimeout(() => {
                this.queryData()
            },1000*5)
        },
        /**
         *34.PC前端—查询控制模式数据
         */
        queryControlModeData(){
            Control({
                FAction:'QueryControlModeData'
            })
            .then((result) => {
                let data = result.FObject
                this.activeIndex = data.Table[0]&&data.Table[0].AutoMode
                this.operationList = data.Table1
                this.currentMode = data.Table2[0]||null
                if(this.currentMode.Week){
                    this.currentMode.Week = this.currentMode.Week.split(',').map(item => this.weekMap[item]).join(',')
                }
                this.modeList = data.Table3
            }).catch((err) => {
                
            });
        },
        /**
         * 35.PC前端—查询区域控制
         */
        queryAreaControl(){
            Control({
                FAction:'QueryAreaControl',
            })
            .then((result) => {
                let data = result.FObject
                this.areaCount = data
                if(data&&data.length>0){
                    if(this.activeArea){
                        this.queryAreaControlDetail(this.activeArea.AreaID)
                    }else{
                        this.activeArea = data[0]
                        this.queryAreaControlDetail(data[0].AreaID)
                    }
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 36.PC前端—查询该区域控制设备详情
         */
        queryAreaControlDetail(id){
            Control({
                FAction:'QueryAreaControlDetail',
                ID:id
            })
            .then((result) => {
                let data =  result.FObject
                let areaDevice = data.ProjectDeviceTypeValue.map(item => {
                    return Object.assign(item,{
                        data:data.ProjectDeviceDataDetail
                        .filter(obj => obj.DeviceTypeID == item.DeviceTypeID)
                        .map(obj =>{
                            return {
                                ...obj
                            }
                        })
                    })
                })
                this.deviceTypes = areaDevice.filter(item => item.data.length>0)
            }).catch((err) => {
                
            });
        },
        /**
         * 37.PC前端—查询项目级全部摇调
         */
        queryControlProjectAdjust(id){
            this.show = true
            Control({
                FAction:'QueryControlProjectAdjust',
                GroupID:id
            })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                
            });
        },
        /**
         * 8.管理后台--查询区域控制明细
         */
        queryUGroupDetail(id){
            this.show = true
            Control({
                FAction:'QueryUGroupDetail',
                ID:id
            })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                
            });
        },
        /**
         *38.PC前端—查询设备摇调
         */
        queryControlDeviceAdjust(id){
            Control({
                FAction:'QueryControlDeviceAdjust',
                DeviceID:id
            })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                
            });
        },
        /**
         * 发送指令
         * @param {String} type GroupCMD:群控指令，BaseCMD:单控指令
         * @param {Int} ID  群控/单控指令ID
         */
        sendCMD(type,ID,data = ''){
            Control({
                FAction:'SendCMD',
                FType:type,
                ID:ID,
                FData:data
            })
            .then((result) => {
                console.log(result);
                /* this.queryAreaControl() */
            }).catch((err) => {
                
            });
        },
        /**
         * 50. 修改项目控制模式
         */
        updateULdasAutoMode(id){
            Control({
                FAction:'UpdateULdasAutoMode',
                AutoMode:id
            })
            .then((result) => {
                this.activeIndex = id
                clearTimeout(this.timer)
                this.queryData()
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang="scss">
$url:'../../static/image';
.device-ctr{
    width: 100%;
    height: 912px;
    .box-shadow{
        background: rgba(5, 34, 86, 0.2);
        border:1px solid rgba(4,44,113,1);
        border-radius:10px 6px 6px 10px;
        /* box-shadow: 0 0 4px 4px #052256 inset; */
        h4{
            margin-top: 10px;
            padding: 0 22px;
            font-size:18px;
            font-family:MicrosoftYaHeiUI;
            font-weight:400;
            color:#18a1ec;
            text-align: left;
        }
        .border{
            height: 1px;
            margin: 9px 25px 0 13px;
            background: #07A6FF;
        }
        .icon{
            width: 100px;
            height: 6px;
            margin-left:13px;
            position: relative;
            background: #07A6FF;
        }
        .icon:after{
            display: block;
            width: 0px;
            height: 0px;
            position: absolute;
            right: -6px;
            border: 3px solid transparent;
            border-top-color: #07A6FF;
            border-left-color: #07A6FF;
            content: ""
        }
    }
    button.operation-btn{
        height:30px;
        padding: 0 10px;
        background:linear-gradient(90deg,rgba(28,76,137,1),rgba(10,57,113,1),rgba(12,56,106,1),rgba(10,57,113,1),rgba(30,79,141,1));
        border:1px solid rgba(81, 128, 205, 0.82);
        border-radius:2px;
        outline: none;
        color: rgba(158, 229, 243, 1);
        cursor: pointer;
    }
    &-left{
        width: 489px;
        height: 100%;
        .mode-ctr{
            width: 100%;
            height: 316px;
            h4{
                button{
                    margin-top: -4px;
                    margin-right: 40px;
                }
            }
            ul.tab-header{
                width: 414px;
                height: 39px;
                line-height: 39px;
                margin: 12px auto;
                display: flex;
                background:rgba(6,43,81,1);
                border:1px solid rgba(83,123,174,1);
                border-radius:8px;
                font-size:16px;
                color: rgba(241, 241, 242, 1);
                li{
                    flex: 1;
                    cursor: pointer;
                }
                li+li{
                    border-left: 1px solid rgba(83,123,174,1);
                }
                li.active{
                    background:linear-gradient(0deg,rgba(0,79,177,1),rgba(16,137,172,1));
                    border-radius:6px;
                    border: none;    
                }
            }
            .tab-content{
                ul.operation-list{
                    margin-right: 43px;
                    text-align: right;
                    li{
                        display: inline-block;
                        margin-right: 12px;
                    }
                }
                .mode{
                    width: 418px;
                    height: 146px;
                    margin: 12px auto;
                    position: relative;
                    border:1px solid rgba(37, 205, 255, 0.43);
                    border-radius:8px;
                    background: rgba(42, 145, 252, 0.17);
                    .title{
                        position: absolute;
                        width:65px;
                        height:28px;
                        top: 4px;
                        left: 0;
                        line-height: 28px;
                        font-size: 14px;
                        color: white;
                        background:rgba(53,131,214,1);
                        border-radius:0px 14px 0px 14px;
                    }
                    .mode-type-name{
                        height: 40px;
                        margin-top: 17px;
                        position:relative;
                        font-size: 20px;
                        color: rgba(209, 219, 230, 1);
                    }
                    p{
                        line-height: 40px;
                        font-size: 20px;
                        color: #84F2FF;
                        position: relative;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        .badge{
                            position: absolute;
                            width: 40px;
                            height: 25px;
                            margin-left: 20px;
                            line-height: 25px;
                            top: 8px;
                            right: 10px;;
                            background:rgba(53,131,214,1);
                            border-radius:5px;
                            font-size: 14px;
                            color: white;
                        }
                    }
                }
            }
        }
        .mode-list{
            width: 100%;
            height: 580px;
            margin-top: 14px;
            .mode-record{
                width: 100%;
                height: 510px;
                ul{
                    padding: 40px 0;
                    color: rgba(165, 239, 252, 1);
                    li{
                        display: flex;
                        align-items: center;
                        .mode-name{
                            width: 120px;
                            text-align: right;
                            font-size:18px;
                            margin-right: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .icon-time{
                            position: relative;
                            .mode-time{
                                width: 80px;
                                position: absolute;
                                top: -20px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                font-size: 14px;
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
                        .mode-item{
                            width: 50px;
                            height: 50px;
                            margin-left: 20px;
                            position: relative;
                            line-height: 53px;
                            border-radius: 50%;
                            background: #429FB9;
                            box-shadow: 0 0 0 8px #30779D,0 0 0 14px rgba($color: #173969, $alpha: 0.5);
                            i{
                                color: white;
                                font-size: 26px;
                            }
                        }
                        .mode-item:after{
                            content: '';
                            display: block;
                            width:2px;
                            height:54px;
                            position: absolute;
                            top: 50px;
                            left: 50%;
                            z-index: 10;
                            margin-left: -1px;
                            background:rgba(96,229,247,1);

                        }
                        .mode-state{
                            margin-left: 26px;
                            font-size: 18px;
                        }
                        button{
                            margin-left: 26px;
                        }
                    }
                    li+li{
                        margin-top: 54px;
                    }
                    li:last-of-type{
                        .mode-item:after{
                            display: none;
                        }
                    }
                    li.unstart{
                        color:rgba(170, 190, 210, 1);
                        .icon-time{
                            .circle,.line{
                                background:rgba(177, 179, 179, 1)
                            }
                        }
                        .mode-item{
                            background: RGBA(120, 126, 140, 1);
                            box-shadow: 0 0 0 8px RGBA(120, 126, 140, 0.6),0 0 0 14px RGBA(120, 126, 140, 0.3);
                            i{
                                color:rgba(170, 190, 210, 1);
                            }
                        }
                        .mode-item::after{
                            background: rgba(177, 179, 179, 1)
                        }
                        .mode-state{
                            color: rgba(169, 168, 168, 1)
                        }
                    }
                }
            }
        }
    }
    &-main{
        margin-left: 502px;
        height: 100%;
        .main-top{
            width: 100%;
            height: 230px;
            position: relative;
            margin-top: 15px;
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
                            height: 190px;
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
                                }
                            }
                            ul.data-item{
                                li{
                                    height: 60px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
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
                                text-align: right;
                                li+li{
                                    margin-top: 10px;
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
        .device-container{
            height: 610px;
            margin-top: 4px;
            .device-type-list{
                >h5{
                    padding-left: 20px;
                    line-height: 38px;
                    text-align: left;
                    font-size: 16px;
                    color: #18a1ec;
                    background: linear-gradient(90deg, rgba(17, 45, 69, 0.34), rgba(16, 52, 78, 0.34), rgba(15, 60, 89, 0.34), rgba(15, 64, 94, 0.34), rgba(16, 71, 101, 0.34), rgba(15, 66, 95, 0.34), rgba(15, 61, 87, 0.34), rgba(16, 50, 77, 0.34), rgba(18, 45, 72, 0.34))
                }
                ul.device-list{
                    >li{
                        width:329px;
                        height:208px;
                        margin-left:16px;
                        box-sizing: border-box;
                        border-radius:8px;
                        background:RGBA(8, 34, 82, 0.37);
                        >h5{
                            height: 40px;
                            line-height: 50px;
                            padding-left: 10px;
                            text-align: left;
                            span{
                                font-size:16px;
                                font-weight:400;
                                color:rgba(170,190,210,1);
                            }
                            button{
                                margin-left: 10px;
                            }
                        }
                        .device-list-content{
                            display: flex;
                            height: 168px;
                            overflow: hidden;
                            .device-aside{
                                width: 120px;
                                color: rgba(170, 190, 210, 1);
                                font-size: 20px;
                                >p{
                                    width: 100%;
                                    height: 24px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    padding-left: 10px;
                                    text-align: left;
                                    box-sizing: border-box;
                                }
                                >ul{
                                    margin-top: 14px;
                                    padding-left: 20px;
                                    li{
                                        text-align: left;
                                        width: 100px;
                                        line-height: 20px;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        span{
                                            line-height: 0;
                                        }
                                        span:first-of-type{
                                            font-size: 16px;
                                            color: rgba(3, 205, 130, 1);
                                        }
                                        span:last-of-type{
                                            font-size: 12px;
                                            color: rgba(169, 168, 168, 1)
                                        }
                                    }
                                    li+li{
                                        margin-top: 12px;
                                    }
                                }
                            }
                            .device-control{
                                width: 100px;
                                padding-top: 10px;
                                >div{
                                    p{
                                        font-size: 16px;
                                        .iconfont{
                                            font-size: 60px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    li.top10{
                        margin-top: 14px;
                    }
                    li.opening{
                        border: 1px solid RGBA(3, 131, 163, 1);
                        background:RGBA(7, 43, 75, 1);
                        box-shadow: 0 0 16px 4px RGBA(5, 104, 128, 1) inset;
                        .device-control{
                            .device-statu{
                                color: RGBA(84, 250, 188, 1)
                            }
                        }
                    }
                }
            }
        }
    }
    .el-dialog{
        background: url(#{$url}/task/inspection.png);
        background-size: 100% 100%;
        padding-left: 48px!important;
        &__header{
            text-align: left
        }
    }
    .zw-dialog{
        .el-dialog{
            height: 500px;
            background-size: 100% 100%;
            .zw-tree{
                width:270px;
                margin: 0 auto;
                .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
                    background-color: #999999;
                    color: #999999
                }
            }
            .submit{
                margin-top: 20px;
            }
        }
    }
}
</style>