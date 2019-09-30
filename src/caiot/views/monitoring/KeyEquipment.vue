<template>
    <div class="report focus-monitor">
        <h3><img src="../../static/image/indexdetail/title-icon.png" style="vertical-align: middle;margin-right: 10px" />重点监测</h3>
        <el-scrollbar>
            <ul class="clearfix device-list">
                <li class="l" v-for="item in focusMonitorData" :key="item.DeviceID" :class="{alarm:item.IsAlarm}">
                    <i :class="{r:true,'el-icon-star-off':!item.IsFocus,'el-icon-star-on':item.IsFocus}" @click="addOrDeleteUFocusMonitor(item)"></i>
                    <router-link :to="{ name: 'detail_info_list',params:{ id:item.DeviceID,PossionID:item.DataDetail[0].SDataID,getalldata:item}}">
                        <h4>
                                {{item.DeviceName}}
                        </h4>
                        <el-row>
                            <el-col :span="11">
                                <ul>
                                    <li v-for="(obj,j) in item.DataDetail.slice(0,3)" :key="j">
                                        <p><span v-for="(value, i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span></p>
                                        <p class="value-title">{{obj.SDataTitle}} <i v-if="obj.SDataUnit!=null&&obj.SDataUnit!=''">({{obj.SDataUnit}})</i></p>
                                    </li>
                                </ul>
                            </el-col>
                            <el-col :span="3">
                                <div class="status" :class="'status-'+item.DeviceStatus">
                                    <p><i :class="['icon','iconfont',item.WebIconName]"></i></p>
                                    <p>{{item.DeviceStatusTitle}}</p>
                                </div>
                            </el-col>
                            <el-col :span="10">
                                <ul>
                                    <li v-for="(obj,j) in item.DataDetail.slice(3)" :key="j">
                                        <p><span v-for="(value,i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span></p>
                                        <p class="value-title">{{obj.SDataTitle}} <i v-if="obj.SDataUnit!=null&&obj.SDataUnit!=''">({{obj.SDataUnit}})</i></p>
                                    </li>
                                </ul>
                            </el-col>
                        </el-row>
                    </router-link>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>
<script>
import {Monitor} from '@/caiot/request/api'
export default {
    data(){
        return{
            focusMonitorData:[],
            timer:null
        }
    },
    components:{

    },
    created(){
        this.queryUFocusMonitorData()
    },
    mounted(){
    },
    methods:{
        /**
         * 获取重点监测设备
         */
        queryUFocusMonitorData(){
            Monitor({
                FAction:'QueryUFocusMonitorData'
            })
            .then((data) => {
                this.focusMonitorData = data.FObject
                this.focusMonitorData.sort((a,b) => b.IsAlarm - a.IsAlarm)
                this.timer = setTimeout(this.queryUFocusMonitorData,1000*5)
            })
            .catch((err) => {
                console.log(err);
            });
        },
    	/**
		 * 162.标记或取消重点监测设备
		 */
		addOrDeleteUFocusMonitor(item){
			Monitor({
				FAction:'AddOrDeleteUFocusMonitor',
				DeviceID:item.DeviceID
			})
			.then(data => {
				this.queryUFocusMonitorData()
			})
			.catch(err => {})
		}															
    },
    beforeDestroy(){
        clearTimeout(this.timer)
    }
}
</script>
<style lang="scss">
.report.focus-monitor{
    padding: 36px 18px;
    color: #F1F1F2;
    h3{
        height: 55px;
        line-height: 55px;
        padding-left: 50px;
        font-size: 20px;
        text-align: left;
    }
    .el-scrollbar {
        height: 790px;
        .el-scrollbar__wrap{
            overflow-x:hidden;
        }
    }
    ul.device-list{
        [class*="el-icon-star-"]{
        	font-size:24px;
            cursor: pointer;
            margin-right: 20px;
        }  
        .el-icon-star-off{
        	color:#525E7E
        }
        .el-icon-star-on{
        	color:#2a91fc
        }
        >li.alarm{
            background: url(../../static/image/indexdetail/content_bg_2.png) 10px 0 no-repeat;
        }
        >li{
            width: 25%;
            height: 192px;
            box-sizing: border-box;
            background: url(../../static/image/indexdetail/fvc4e.png) 89px -10px no-repeat;
            h4{
                height: 30px;
                line-height: 30px;
                font-size: 16px;
                color: #525E7E;
                text-align: left;
                padding:0px 20px;
            }
            .el-row{
                height: 162px;
                .el-col{
                    height: 100%;
                    font-size:16px;
                    position: relative;
                    ul{
                        position: absolute;
                        bottom: 20px;
                        li{
                            text-align: left;
                            padding-left: 26px;
                            margin-top: 10px;
                        }
                    }
                    .status{
                        padding-top: 10px; 
                    }
                    .status.status-1{
                        color: #1bd1a1
                    }
                    .status.status-2{
                        color: #73777a
                    }
                    .status.status-3{
                        color: #0091fe
                    }
                    .status.status-4{
                        color: #fef500
                    }
                    .status.status-5{
                        color: #9c1428
                    }
                    span.value{
                        color: #03CD82
                    }
                    .value-title{
                        font-size:12px;
                        color: #737373
                    }
                }
                [class*="icon"]{
                    font-size: 50px;
                }
            }
        }
    }

}
</style>
