<template>
    <div class="lift-detaile">
        <h3>
            <i class="iconfont icon-Passengerlift"></i>
            电梯数据
        </h3>
        <ul class="lift-info">
<!--             <li v-for="(item,i) in dataLabel" :key="i">
                <span class="label">{{item.label}} :</span>
                <span class="value">{{liftInfo[item.prop]}}</span>
            </li> -->
            <li>
                <span class="label">运行方向</span>
                <span class="value">{{liftInfo.DataDetail&&liftInfo.DataDetail[1].SDataValue[0].DValue>0?'上行':(liftInfo.DataDetail[1].SDataValue[0].DValue==0?'停止':'下行')}}</span>
            </li>
            <li>
                <span class="label">速度</span>
                <span class="value">{{liftInfo.DataDetail&&liftInfo.DataDetail[3].SDataValue[0].DValue}} m/s</span>
            </li>
            <li>
                <span class="label">楼层</span>
                <span class="value">{{liftInfo.DataDetail&&liftInfo.DataDetail[0].SDataValue[0].DValue}} 楼</span>
            </li>
            <li>
                <span class="label">是否有人</span>
                <span class="value">{{liftInfo.DataDetail&&liftInfo.DataDetail[2].SDataValue[0].DValue}}</span>
            </li>
        </ul>
        <h3>
            <i class="iconfont icon-Transformer"></i>
            大事记
        </h3>
        <div class="event-list">
            <event-list :data='eventData' :showTitle='false'></event-list> 
        </div>
        <div class="lift-video">
            <ul class="operation top-operation">
                <li :class="{'not-allowed':!isJoining}" @click="takePhoto()">拍照</li>
                <li :class="{'not-allowed':isJoining}" @click="join()">视频<br>连接</li>
                <li :class="{'not-allowed':!isJoining}" @click="closeVideo()">关闭</li>
            </ul>
            <ul class="operation bottom-operation">
                <!-- <li>确认<br>保修</li> -->
                <li @click="closeAlarm()">误报<br>取消</li>
            </ul>
            <div class="video-center">
                <div class="scan-line" v-if="loading">
                </div>
                <div id="agora_local" v-if="isJoining">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eventList from './d_l_a.vue'
import {project} from '../../request/api.js'
import AgoraRTC from 'agora-rtc-sdk'
import axios from 'axios'
import html2Canvas from 'html2canvas'
export default {
    data(){
        return{
            dataLabel:[
                {
                    label: '运行方向',
                    prop: 'DeviceName'
                },
                {
                    label: '设备编码',
                    prop: 'DeviceCode'
                },
                {
                    label: '电梯速度',
                    prop: 'DeviceName'
                },
                {
                    label: '安装地址',
                    prop: 'DeviceName'
                },
                {
                    label: '所在楼层',
                    prop: 'DeviceName'
                },
                {
                    label: '维保人员1',
                    prop: 'DeviceName'
                },
                {
                    label: '是否有人',
                    prop: 'DeviceName'
                },
                {
                    label: '维保人员2',
                    prop: 'DeviceName'
                },
                {
                    label: '厅门状态',
                    prop: 'DeviceName'
                },
                {
                    label: '维保单位',
                    prop: 'DeviceName'
                },
                {
                    label: '是否在门区',
                    prop: 'DeviceName'
                },
                {
                    label: '使用单位',
                    prop: 'DeviceName'
                },
            ],
            client:null,
            isJoining:false, //是否正在视频中
            localStream:null,
            liftStatus:null, //电梯状态
            loading:false,
            timer:null,
        }
    },
    props:{
        liftInfo:{
            default:Object,
            default:() => {return {}}
        },
        eventData:Array,
    },
    components:{
        eventList
    },
    created(){
    },
    mounted(){
        this.getLiftStatus()
    },
    methods:{
        /**
         * 获取电梯状态
         */
        getLiftStatus(){
            project({
                FAction:'GetDeviceElevatorAlarmStatusByDeviceID',
                DeviceID:this.liftInfo.DeviceID
            })
            .then((result) => {
                this.liftStatus = result.FObject[0]||null
                this.timer = setTimeout(() => {
                    this.getLiftStatus()
                },3000)
            }).catch((err) => {
                
            });
        },
        /************** 通知电梯打开视频 */
        openLiftVideo(){
            axios({
                method:'post',
                url:`https://dt.caszyj.com:8444/elevator-monitor/elev/changeA_VByClientID?client_id=${this.liftInfo.OtherSourceID}&changeValue=A`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': 'eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblVzZXIiOiJ7XCJ1c2VyXCI6e1widXNlcl9pZFwiOlwiN2Q1MzkxNjBmOWMzNDc1YWEyMGYzZGE3OGJhNDViMmJcIixcInVzZXJfbm9cIjpcInN5eXNcIixcInVzZXJfbmFtZVwiOlwi5Lit54mp566h55CGXCIsXCJ1c2VyX3R5cGVcIjpcIk1HXCIsXCJyb2xlX2lkXCI6XCJNR1wiLFwic2FmZV9waG9uZVwiOlwiMTMzMDAwMDAwXCIsXCJ1c2VyX25pY2tuYW1lXCI6XCLkuK3niannrqHnkIZcIixcIm9yZ19pZFwiOlwiMDAwMDAwMTUwXCIsXCJjaGlsZHJlbk9yZ0NvdW50XCI6MixcIm9yZ190eXBlXCI6XCLnu7Tkv51cIixcIm9yZ19uYW1lXCI6XCLkuK3niannlLXmoq9cIixcInNlZ21lbnRcIjpcIlwiLFwic2VnbWVudF9kZXNjXCI6XCJcIixcInN0YXR1c1wiOlwiMVwiLFwicGhvdG9ncmFwaFwiOlwiaHR0cDovL3d3dy5kYWFudGMuY29tOjgwNTQvZWxldmF0b3Jtcy9waG90by8xL3N5eXMvMC9OQU5cIixcInVzZXJfc2NvcmVcIjowLFwic21zX2ZsYWdcIjowfSxcInVuaXRJbmZvXCI6XCLkuK3niannlLXmoq9cIn0ifQ.63yiDX4Hzs876zPD1c1RYA_dEOXZMe5N8gX7WNj-GOo'
                },
            })
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                
            });
        },
        /**
         * 视频连接
         */
        async join(){
            if(!this.liftStatus){
                this.$message({
                    message:'电梯正常',
                    type:'warning',
                    druration:500
                })
                return
            }
            if(this.isJoining){
                return
            }
            this.loading = true
            /**  初始化 */
            this.client = AgoraRTC.createClient({mode: 'live', codec: "h264"});
            await new Promise((resolve,reject) => {
                this.client.init('ce1902b6be334d6a8ad60f313b222eea', function () {
                  console.log("AgoraRTC client initialized");
                  resolve()

                }, function (err) {
                  console.log("AgoraRTC client init failed", err);
                  reject()
                });
            })
            /** 加入频道 */
            await new Promise((resolve,reject) => {
                console.log('ceshi',this.liftInfo.OtherSourceID);
                this.client.join('ce1902b6be334d6a8ad60f313b222eea', this.liftInfo.OtherSourceID, undefined, (uid) => {
                  console.log("User " + uid + " join channel successfully");
                  this.isJoining = true;
                  this.loading = false
                  this.openLiftVideo()
                  resolve(uid)

                }, function(err) {
                  console.log("Join channel failed", err);
                  reject(err)
                });
            })
            .then((uid) => {
                /********** 初始化音视频流 **********/
                this.localStream =  AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: true,
                    screen: false
                });
            }).catch((err) => {
                
            });
            this.localStream.init(() => {
              console.log("getUserMedia successfully");
              /* this.localStream.play('agora_local'); */
              /************* 发布本地音视频流 **************/
              this.client.publish(this.localStream, function (err) {
                console.log("Publish local stream error: " + err);
              });

            }, function (err) {
              console.log("getUserMedia failed", err);
            });
            this.client.on('stream-published', function (evt) {
              console.log("Publish local stream successfully");
            });
            /*************** 订阅远端音视频流 **************/
            this.client.on('stream-added',  (evt) => {
              var stream = evt.stream;
              console.log("8888888888New stream added: " + stream.getId());

              this.client.subscribe(stream, function (err) {
                console.log("Subscribe stream failed", err);
              });
            });
            this.client.on('stream-subscribed', function (evt) {
              var remoteStream = evt.stream;
              console.log("9999Subscribe remote stream successfully: " + remoteStream.getId());
              remoteStream.play('agora_local');
            })
            this.client.on('stream-removed',evt => {
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                this.removeView(id)
            })
            this.client.on('peer-leave', evt =>{
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                this.removeView(id)
            })
        },
        removeView(id){
            let parent = document.querySelector('#agora_local')
            let video = document.querySelector(`#player_${id}`)
            parent.removeChild(video)
        },
        /**
         * 关闭视屏
         */
        closeVideo(){
            if(!this.isJoining){
                return
            }
            this.client.leave(() => {
                this.isJoining = false
                this.closeAlarm()
            },(err) =>{
                console.log(err)
            })
        },
        /**
         * 取消报警
         */
        closeAlarm(){
            if(!this.liftStatus){
                this.$message({
                    message:'电梯正常',
                    type:'warning',
                    druration:500
                })
                return
            }
            axios({
                method:'post',
                url:`https://dt.caszyj.com:8444/elevator-monitor/elev/pushCancelAlarm?client_id=${this.liftInfo.OtherSourceID}&historyID=${this.liftStatus.HistoryID}&status=${this.liftStatus.Status}&op_type=1`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': 'eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblVzZXIiOiJ7XCJ1c2VyXCI6e1widXNlcl9pZFwiOlwiN2Q1MzkxNjBmOWMzNDc1YWEyMGYzZGE3OGJhNDViMmJcIixcInVzZXJfbm9cIjpcInN5eXNcIixcInVzZXJfbmFtZVwiOlwi5Lit54mp566h55CGXCIsXCJ1c2VyX3R5cGVcIjpcIk1HXCIsXCJyb2xlX2lkXCI6XCJNR1wiLFwic2FmZV9waG9uZVwiOlwiMTMzMDAwMDAwXCIsXCJ1c2VyX25pY2tuYW1lXCI6XCLkuK3niannrqHnkIZcIixcIm9yZ19pZFwiOlwiMDAwMDAwMTUwXCIsXCJjaGlsZHJlbk9yZ0NvdW50XCI6MixcIm9yZ190eXBlXCI6XCLnu7Tkv51cIixcIm9yZ19uYW1lXCI6XCLkuK3niannlLXmoq9cIixcInNlZ21lbnRcIjpcIlwiLFwic2VnbWVudF9kZXNjXCI6XCJcIixcInN0YXR1c1wiOlwiMVwiLFwicGhvdG9ncmFwaFwiOlwiaHR0cDovL3d3dy5kYWFudGMuY29tOjgwNTQvZWxldmF0b3Jtcy9waG90by8xL3N5eXMvMC9OQU5cIixcInVzZXJfc2NvcmVcIjowLFwic21zX2ZsYWdcIjowfSxcInVuaXRJbmZvXCI6XCLkuK3niannlLXmoq9cIn0ifQ.63yiDX4Hzs876zPD1c1RYA_dEOXZMe5N8gX7WNj-GOo'
                },
            })
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                
            });
        },
        takePhoto(){
            let  canvas = document.createElement("canvas");
            let  canvasCtx = canvas.getContext("2d");
            canvas.width = 240
            canvas.height = 320
            let  video=document.querySelector('video')
            canvasCtx.drawImage(video, 0, 0, 240, 320);
            let dataUrl = canvas.toDataURL("image/png");
            let a = document.createElement('a')
            a.href = dataUrl
            a.download = 'download'
            a.click()
        }
    }
}
</script>
<style lang="scss">
    $url:'../../static/image/';
    .lift-detaile{
        height: 100%;
        background: url(#{$url}index/count_back.png);
        padding:32px 22px;
        box-sizing: border-box;
        position: relative;
        h3{
            height:55px;
            line-height: 55px;
            padding-left: 50px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            text-align: left;
            color: #18A1EC;
            font-size: 20px;
            font-weight: normal;
            .iconfont{
                font-size: 30px;
                vertical-align: middle;
            }   
        }
        .lift-info{
            width: 900px;
            height: 353px;
            padding-top: 20px;
            li{
                float: left;
                width: 50%;
                line-height: 50px;
                font-size: 17px;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                span{
                    display: inline-block;
                }
                .label{
                    width: 150px;
                    margin-right: 30px;
                    text-align: right;
                    color: #737373;
                }
                .value{
                    color: #00D294
                }
            }
        }
        .event-list{
            height: 393px;
        }
        .lift-video{
            width: 577px;
            height: 645px;
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: url(#{$url}indexdetail/lift-video.png);
            .operation{
                width: 100%;
                height: 138px;
                position: absolute;
                display: flex;
                justify-content: space-around;
                li{
                    width: 138px;
                    height: 138px;
                    background: url(#{$url}indexdetail/content_button_1.png);
                    cursor: pointer;
                    color: #2A91FC;
                    font-size: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                li.not-allowed{
                    cursor: not-allowed
                }
            }
            .top-operation{
                top: -44px;
            }
            .bottom-operation{
                bottom: -50px;
            }
            .video-center{
                width: 413px;
                height: 413px;
                position: absolute;
                left: 50%;
                top:50%;
                transform: translate(-50%,-50%);
                background: url(#{$url}indexdetail/content_user.png);
                .scan-line{
                    width:449px;
                    height:86px ;
                    background: url(#{$url}indexdetail/content_line_dynamic.png);
                    position: absolute;
                    left: -16px;
                    animation: scan 2s linear infinite;
                }
                #agora_local{
                    height: 100%;
                    video{
                        left: 0;
                    }
                }
                @keyframes scan {
                    0%{top: 0px;}
                    50%{top:327px }
                    100%{top: 0px;}
                }
            }
        }
    }
</style>