<template>
    <div class="device-container">
        <el-scrollbar>
            <div class="clearfix not-lift" v-if="data[0]&&data[0].DeviceTypeID != 1003">
                <div class="system-device l" v-for="(item,i) in data" :key="i">
                    <h5><i :class="['iconfont',item.WebIconName]"></i>{{item.DeviceType}}({{item.data.length}})</h5>
                    <ul class="clearfix device-list">
                        <li class="l" v-for="(device,i) in item.data" :key="device.DeviceID" :class="{alarm:device.IsAlarm}" :style="{width:width+'px'}">
                            <i :class="{r:true,'el-icon-star-off':!device.IsFocus,'el-icon-star-on':device.IsFocus}" @click="addOrDeleteUFocusMonitor(device)"></i>
                            <router-link :to="`/monitoring/detail_info_list/${device.DeviceID}/${device.DataDetail[0]?device.DataDetail[0].SDataID:0}/${device}`">
                                <h4 :title="device.DeviceName"><!-- { name: 'detail_info_list',params:{ id:device.DeviceID,PossionID:device.DataDetail[0]?device.DataDetail[0].SDataID:0,getalldata:device}} -->
                                        {{device.DeviceName}}
                                </h4>
                                <el-row>
                                    <el-col :span="11">
                                        <ul>
                                            <li v-for="(obj,j) in device.DataDetail.slice(0,3)" :key="j">
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content">
                                                        <span v-for="(value, i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span>
                                                    </div>
                                                    <p><span v-for="(value, i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span></p>
                                                </el-tooltip>
                                                <p class="value-title">{{obj.SDataTitle}} <i v-if="obj.SDataUnit!=null&&obj.SDataUnit!=''">({{obj.SDataUnit}})</i></p>
                                            </li>
                                        </ul>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="status" :class="'status-'+device.DeviceStatus">
                                            <p><i :class="['icon','iconfont',device.WebIconName]"></i></p>
                                            <p>{{device.DeviceStatusTitle}}</p>
                                        </div>
                                    </el-col>
                                    <el-col :span="10">
                                        <ul>
                                            <li v-for="(obj,j) in device.DataDetail.slice(3,6)" :key="j" style="text-align:right;padding-left:0;padding-right:4px">
                                                <el-tooltip placement="top" effect="light">
                                                    <div slot="content">
                                                        <span v-for="(value, i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span>
                                                    </div>
                                                    <p><span v-for="(value, i) in obj.SDataValue" :key="i" class="value">{{value.DValue}}<i v-if="i<obj.SDataValue.length-1">/</i></span></p>
                                                </el-tooltip>
                                                <p class="value-title">{{obj.SDataTitle}} <i v-if="obj.SDataUnit!=null&&obj.SDataUnit!=''">({{obj.SDataUnit}})</i></p>
                                            </li>
                                        </ul>
                                    </el-col>
                                </el-row>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="clearfix lift-list" v-else>
                <h4><i class="iconfont icon-Equipment"></i>设备列表</h4>
                <ul>
                  <li v-for="(item,i) in data[0]?data[0].data:[]" :key="i">
                    <i
                      :class="{r:true, 'el-icon-star-off':!item.IsFocus,'el-icon-star-on':item.IsFocus}"
                      @click.stop="addOrDeleteUFocusMonitor(item)"
                    ></i>           
                    <router-link :to="`/monitoring/detail_info_list/${item.DeviceID}/${item.DataDetail[0]?item.DataDetail[0].SDataID:0}/${item}/`">
                      <h5>
                        {{item.DeviceName}}
                      </h5>
                      <div >
                        <div class="statu l">
                            正常
                        </div>
                        <div class="statu-items l">
                          <p>
                            <span class="value">{{item.DataDetail[1].SDataValue[0].DValue>0?'上行':(item.DataDetail[1].SDataValue[0].DValue==0?'停止':'下行')}}</span><br>
                            <span class="label">运动方向</span>
                          </p>
                          <p>
                            <span class="value">{{item.DataDetail[3].SDataValue[0].DValue}}</span><br>
                            <span class="label">速度（m/s）</span>
                          </p>
                          <p>
                            <span class="value">{{item.DataDetail[0].SDataValue[0].DValue}}</span><br>
                            <span class="label">楼层</span>
                          </p>
                        </div>
                        <div class="statu-items l">
                          <p>
                            <span class="value">{{item.DataDetail[2].SDataValue[0].DValue}}</span><br>
                            <span class="label">是否有人</span>
                          </p>
                        </div>
                      </div>
                    </router-link>
                  </li>
                </ul>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import { Monitor } from '@/caiot/request/api.js'
export default {
    data(){
        return{

        }
    },
    props:{
        data:Array,
        width:Number,
        height:Number
    },
    methods:{
    	/**
		 * 162.标记或取消重点监测设备
		 */
		addOrDeleteUFocusMonitor(item){
			Monitor({
				FAction:'AddOrDeleteUFocusMonitor',
				DeviceID:item.DeviceID
			})
			.then(data => {
				this.$emit('change',item)
			})
			.catch(err => {})
		}
    }
}
</script>
<style lang="scss" scoped>
$url:'../../static/image';
.device-container{
    width: 100%;
    height: 100%;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius:10px 6px 6px 10px;
    background: rgba($color: #052256, $alpha: 0.4);
    box-shadow: 0 0 8px 8px rgba($color: #052256, $alpha: 1) inset;
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
    .not-lift{
        h5{
            padding-left: 20px;
            line-height: 38px;
            text-align: left;
            font-size:16px;
            color:rgba(24,161,236,1);
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            .iconfont{
                font-size: 26px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
        ul.device-list{
            >li.alarm{
                background: url(#{$url}/indexdetail/content_bg_2.png) 10px 0 no-repeat;
                background-size: 100% 100%;
            }
            >li{
                width: 25%;
                height: 192px;
                box-sizing: border-box;
                background: url(#{$url}/indexdetail/fvc4e.png) 13px no-repeat;
                background-size: 100% 100%;
                h4{
                    width: 200px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 16px;
                    color: #525E7E;
                    text-align: left;
                    padding:0px 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .el-row{
                    height: 162px;
                    .el-col{
                        height: 100%;
                        font-size:16px;
                        position: relative;
                        ul{
                            width: 100%;
                            position: absolute;
                            bottom: 20px;
                            li{
                                width: 100%;
                                text-align: left;
                                padding-left: 4px;
                                margin-top: 10px;
                                box-sizing: border-box;
                                p{
                                    width: 100%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                        .status{
                            padding-top: 10px;
                            display: flex;
                            flex-direction: column;
                            align-items: center; 
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
    /************************* 电梯 ****************************/
    .lift-list{
      h4{
        padding-left: 48px;
        text-align: left;
        color: #18A1EC;
        height: 55px;
        line-height: 55px;
        font-size: 20px;
        display: flex;
        .iconfont{
          font-size: 28px;
          margin-right: 10px;
        }
      }
      ul{
        li{
          width: 25%;
          height: 192px;
          box-sizing: border-box;
          background: url(#{$url}/indexdetail/fvc4e.png) 13px no-repeat;
          background-size: 100% 100%;
          h5{
            text-align: left;
            padding-left: 16px;
            font-size:18px;
            font-weight:400;
            color:rgba(82,94,126,1);
          }
        }
        .statu{
          width:72px;
          height:124px;
          line-height: 124px;
          margin-top: 20px;
          margin-left: 14px;
          position: relative;
          font-size: 28px;
          background:rgba(11,38,79,1);
          border:1px solid rgba(1,150,7,1);
          border-radius:9px;
          box-shadow:  0 0 14px rgba(1,150,7,1);
          color: #02CD35;
          /* background: url(/static/image/indexdetail/normal.gif) */
        }
        .statu::after{
            content: "";
            display: block;
            background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 42%, #00ff33 100%);
            width: 36px;
            height: 36px;
            position: absolute;
            top: 26px;
            left: 0;
            animation: radar-beam 3s infinite;
            animation-timing-function: linear;
            transform-origin: bottom right;
            border-radius: 100% 0 0 0;
        }
        .statu.alarm{
            border:1px solid #fb0d0d;
            box-shadow:  0 0 14px #fb0d0d;
            color: #fb0d0d;
        }
        .statu.alarm::after{
            background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #fb0d0d,$alpha:1));
        }
        .statu.warning{
            border: 1px solid #e0e213;
            box-shadow: 0 0 14px #e0e213;
            color: #e0e213;
        }
        .statu.warning::after{
            background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #e0e213,$alpha:1));
        }
        @keyframes radar-beam {
            from{transform: rotate(0deg)}
            to{transform: rotate(360deg)}
        }
        .statu-items{
          margin-left: 20px;
          p{
            text-align: left;
            span.value{
              font-size: 16px
            }
            span.label{
              font-size: 12px;
              color: #737373;
            }
          }
          p+p{
            margin-top: 20px;
          }
        }
      }
    }
}
</style>
