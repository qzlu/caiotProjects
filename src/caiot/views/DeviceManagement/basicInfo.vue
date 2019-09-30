<template>
    <div>
        <div class="tab-content-item clearfix">
            <div class="header">
                <img src="static/image/nav_new/nav_icon_3.png" alt="">
                <span>基本信息</span>
            </div>
            <div class="info-content">
                <ul class="l">
                    <li class="l"><span class="label">设备名称：</span>　<span>{{info.DeviceLedgerName}}</span></li>
                    <li class="l"><span class="label">设备编码：</span>　<span>{{info.DeviceCode}}</span></li>
                    <li class="l"><span class="label">生产厂家：</span>　<span>{{info.Manufacturer}}</span></li>
                    <li class="l"><span class="label">出厂型号：</span>　<span>{{info.SpecificationsCode}}</span></li>
                    <li class="l"><span class="label">出厂编号：</span>　<span>{{info.ManufacturingNumber}}</span></li>
                    <li class="l"><span class="label">出厂日期：</span>　<span>{{info.ManufacturingTime}}</span></li>
                    <li class="l"><span class="label">使用年限：</span>　<span>{{info.ServiceLife}}</span></li>
                    <li class="l"><span class="label">项目名称：</span>　<span>{{projectName}}</span></li>
                    <li class="l"><span class="label">设备类型：</span>　<span>{{info.DeviceTypeName}}</span></li>
                    <li class="l"><span class="label">区域名称：</span>　<span>{{info.AreaName}}</span></li>
                    <li class="l"><span class="label">系统名称：</span>　<span>{{info.ParamName}}</span></li>
                    <!-- <li class="l"><span class="label">维护截止：</span>　<span>{{info.EditorDateTime}}</span></li> -->
                </ul>
                <div class="r">
                    <div>
                        <img v-if="info.DeviceLedgerPhoto" :src="`http://szqianren.com/${info.DeviceLedgerPhoto}`" alt="">
                        <div v-else style="width:140px;height:140px;background:white"></div>
                        <p>设备照片</p>
                    </div>
                    <div>
                        <img v-if="info.DeviceLedgerQrCode" :src="`http://szqianren.com/${info.DeviceLedgerQrCode}`" alt="">
                        <p>设备二维码</p>
                    </div>
                </div>
            </div>
            <ul class="tab-header clearfix">
                <li>
                        设备档案
                </li>
                <li>
                        大事件
                </li>
                <li>
                        告警记录
                </li>
                <li>
                        维修记录
                </li>
                <li>
                        保养记录
                </li>
                <li>
                        启停日志
                </li>
                <li>
                        相关资料
                </li>
            </ul>
            <div class="header">
                <img src="static/image/count/icon_2.png" alt="">
                <span>使用登记</span>
            </div>
            <div class="use-time">
                <ul class="l">
                    <li class="l"><span class="label">购买日期：</span>　<span>{{info.PurchaseDateTime}}</span></li>
                    <li class="l"><span class="label">安装日期：</span>　<span>{{info.InstallationDateTime}}</span></li>
                    <li class="l"><span class="label">验收日期：</span>　<span>{{info.AcceptanceDateTime}}</span></li>
                    <li class="l"><span class="label">投运日期：</span>　<span>{{info.OperatingDateTime}}</span></li>
                </ul>
            </div>
            <div class="header clearfix">
                <div class="l">
                    <img src="static/image/count/icon_3.png" alt="">
                    <span>设备参数</span>
                </div>
                <div class="l" style="margin-left:30%">
                    <img src="static/image/count/icon_3.png" alt="">
                    <span>配套设备参数</span>
                </div>
            </div>
            <div class="device-param clearfix">
                <ul class="l" v-if="info.DeviceLedgerParam">
                    <li>
                       {{info.DeviceLedgerParam}}
                    </li>
                </ul>
                <ul class="l" v-if="info.AcsDeviceLedgerParam">
                    <li>
                        {{info.AcsDeviceLedgerParam}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {Device} from '@/caiot/request/api.js'
export default {
    data(){
        return{
            info:{},
            projectName:localStorage.getItem('projectname')
        }
    },
    props:{
        deviceID:{
            type:String
        }
    },
    created(){
        this.queryUDeviceLedgerInfo()
    },
    methods:{
        /**
         * 243.查询设备台账详情
         */
        queryUDeviceLedgerInfo(){
            Device({
                FAction:'QueryUDeviceLedgerInfo',
                ID:this.$props.deviceID
            })
            .then(data => {
                this.info = data.FObject[0]
            })
            .catch(err => {})
        }
    }
}
</script>
<style lang="scss">
    $img-url:'../../static/image/';
    .device-info{
        position: relative;
        .tab-content{
            &-item{
                height: 100%;
                .header{
                    height:55px;
                    line-height: 55px;
                    background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
                    border-radius:10px 6px 6px 10px;
                    text-align: left;
                    padding-left: 50px;
                    box-sizing: border-box;
                    >div{
                        height: 100%;
                    }
                    img{
                        width:30px;
                        height:25px;
                        vertical-align: middle;
                    }
                    span{
                        font-size:16px;
                        font-family:MicrosoftYaHeiUI;
                        font-weight:400;
                        color:#18A1EC;
                    }
                }
                .info-content,.use-time{
                    width: 100%;
                    height: 216px;
                    ul{
                        width: 70%;
                        margin-top: 30px;
                        padding: 0 50px;
                        box-sizing: border-box;
                        li{
                            width: 33.33%;
                            text-align: left;
                            font-size: 17px;
                            line-height: 40px;
                            span{
                                display: inline-block;
                                color: #00D294
                            }
                            .label{
                                width: 90px;
                                text-align: right;
                                color: #737373;
                            }
                        }
                    }
                    div.r{
                        width: 30%;
                        height: 216px;
                        >div{
                            height: 100%;
                            display: inline-block;
                            padding-top: 20px;
                            img{
                                width: 140px;
                                height: 140px;
                                vertical-align: middle;
                            }
                            p{
                                margin-top: 16px;
                            }
                        }
                        div+div{
                            margin-left: 20px;
                        }
                    }

                }
                .use-time{
                    height: 120px;
                    ul{
                        width: 100%;
                        li{
                            width: 25%
                        }
                    }
                }
                .device-param{
                    width: 100%;
                    height: 280px;
                    ul{
                        width: 30%;
                        margin-top: 30px;
                        padding: 0 50px;
                        box-sizing: border-box;
                        li{
                            width: 100%;
                            text-align: left;
                            font-size: 17px;
                            line-height: 40px;
                            span{
                                display: inline-block;
                                color: #00D294
                            }
                            .label{
                                width: 120px;
                                text-align: right;
                                color: #737373;
                            }
                        }
                    }
                    ul+ul{
                        margin-left: 100px;
                    }
                }
            }
        }
    }
</style>
