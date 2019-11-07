<template>
  <div class="detail">
    <!--{{$route.params.id}} //设备id ,则是DeviceID
 	{{$route.params.PossionID}}
 	后端要求带第一个小分类的默认第一个分类的PossionID，设备自己的id,还有当前设备的所有数据，都带过来
    -->
    <!--<router-link :to="{ name: 'foreshow',}">
	   <p>121313</p>
    </router-link>-->
    <div class="det_top" v-if="datalist02.DeviceTypeID==801||datalist02.DeviceTypeID==800">
      <p class="btn_back" @click="routerback()">
        <img src="../../static/image/index/back_btn.png">返回
      </p>
      <div class="video-container" id="innerVideo">
        <video
          v-if="video_div"
          id="my-video"
          class="video-js vjs-big-play-centered"
          controls
          preload="auto"
          poster="/static/image/index/video_start.jpg"
        >
          <source :src="videoUrl" type="application/x-mpegURL">
        </video>
      </div>
      <section class="info">
        <div class="gh_line" style="height: 25px;"></div>
        <div class="mains">
          <!--组件2 基本信息及资料-->
          <table_data @ready="getInfo"></table_data>
          <!--组件2-->
        </div>
      </section>
    </div>
    <div v-else-if="datalist02.DeviceTypeID==1003">
      <div class="iframe-container">
        <p class="btn_back" @click="routerback()">
          <img src="../../static/image/index/back_btn.png">返回
        </p>
        <div style="height:920px;">
          <lift-detaile :liftInfo="datalist02" :eventData="dl_datalist"></lift-detaile>
        </div>
      </div>
    </div>
    <div v-else>
      <section class="det_top">
        <p class="btn_back" @click="routerback()">
          <img src="../../static/image/index/back_btn.png">返回
        </p>
        <div class="det_ghyi">
          <div class="det_left">
            <ul>
              <li>
                <div class="inner_bg_sh">
                  <div class="a1">
                    <div class="jg">
                      <p class="t" :title="datalist02.DeviceName">
                        {{datalist02.DeviceName}}
                        <!--1#变压器-->
                      </p>
                    </div>
                    <div v-for="(c,key) in datalist02.DataDetail" :class="setclass(c.SDataID)" :key="key">
                      <p class="gre">
                        <i
                          v-for="(df,key) in c.SDataValue"
                          :data="df.DStatus"
                          :key="key"
                          @click="clickDeviceItem(c)"
                        >{{(datalist02.DeviceTypeID==1003&&c.SDataID==1) ? (df.DValue>0?'上行':(df.FValue == 0 ? '停止': '下行')) : df.DValue}}{{key!==c.SDataValue.length-1?'/':''}}</i>
                      </p>
                      <p class="grd">
                        {{c.SDataTitle}} ({{c.SDataUnit}})
                        <!--三相线电压(V)-->
                      </p>
                      <p class="line"></p>
                    </div>
                    <!--<p class="gre">456/526/455</p>
                    <p class="grd">三相线电流(A)</p>-->
                  </div>

                  <div class="a2">
                    <div>
                      <p>
                        <i
                          class="icon iconfont"
                          :class="[datalist02.WebIconName,`status-${datalist02.DeviceStatus}`]"
                          style="font-size: 50px;"
                        ></i>
                      </p>
                      <p class="tx">
                        <i
                          :class="[`status-${datalist02.DeviceStatus}`]"
                        >{{datalist02.DeviceStatusTitle}}</i>
                        <!--合闸-->
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="det_rightItem">
            <div
              class="det_titles"
              style="width: 110px; height: 165px; padding: 25px 0 0 20px; float: left; font-size: 18px; color: #F1F2F2;"
            >实时监测</div>
            <div
              class="show_acr_c"
              style="width: 900px; height: 185px; float: left; color: #fff; margin-top: 19px;"
              id="container_vn"
            >
              <div v-if="datalist02.DeviceTypeID == 500" class="type-500">
                <el-scrollbar>
                  <ul v-if="activeItem">
                    <li v-for="(item,i) in alarmData" :key="i">
                      <span>{{item.FDateTime}}</span>
                      <span>{{activeItem.SDataTitle.replace(/数/ig,'')}}</span>
                      <span>{{item.event}}</span>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
              <line-chart v-else  :data="linedata" :color='["#FF3600", "#00D1D9", "#FF7300"]'></line-chart>
            </div>
          </div>
        </div>
      </section>
      <section class="det_itemList">
        <div class="gh_line" style="height: 25px;"></div>
        <div class="mains">
          <!--组件1 大事记-->
          <my-imgdata :data="dl_datalist"></my-imgdata>
          <!--组件1-->
          <!--组件2 基本信息及资料-->
          <table_data @ready="getInfo"></table_data>
          <!--组件2-->
        </div>
      </section>
    </div>
  </div>
</template>
<style>
 .btn_back {
  cursor: pointer;
  z-index: 118;
  position: absolute;
  top: -30px;
  border-radius: 5px;
  left: 10px;
  width: 68px;
  text-align: center;
  height: 30px;
  opacity: 0.5;
  color: #c2ddff;
  background: #4379cd;
  font-size: 20px;
}
 .btn_back img {
  vertical-align: 2px;
}
/*滚动条样式*/

.mains::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.mains::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #4472c7;
}
.mains::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #fff;
}
</style>
<script>
import videojs from "video.js";
// import 'videojs-contrib-hls'
import * as comm from "../../assets/js/pro_common";
import img_data from "./d_l_a.vue"; //中间图片
import table_data from "./d_l_b.vue"; //列表组件
import {project} from '@/caiot/request/api';
import {lineChart} from '@/caiot/zw-components/index';
import liftDetaile from './liftDetaile.vue' //电梯页面
export default {
  data() {
    return {
      datalist: [], //静态数据
      datalist02: this.$route.params.getalldata, //点击进来当前设备详情，左1
      linedata: {}, //图表线条数据
      alarmData:[], //消防主机告警数据
      video_div: false,
      dl_datalist: [], //大事件数据
      activeItem:null, //当前选中的设备数据项
      timer:null,
      videoUrl:
        "http://hls.open.ys7.com/openlive/669cf1ba63a34653a1c358b17ceea2b6.m3u8"
    };
  },
  created() {
    this.getDeviceInfo()
    this.getDeviceMemorabilia()
  },
  methods: {
    setclass(x) {
      return "pui_" + x;
    },
    routerback() {
      this.$router.back(-1);
    },
      /**
     * 获取设备信息
     */
    getDeviceInfo() {
      project({
        FAction: "GetPrjSingleAreaDeviceInfo",
        AreaID: 1,
        DeviceID: this.$route.params.id
      })
      .then(data => {
        this.datalist02 = data.FObject[0]||{}
        if(this.datalist02.DataDetail&&this.datalist02.DataDetail.length>0){
          !this.activeItem&&(this.activeItem = this.datalist02.DataDetail[0])
          this.clickDeviceItem(this.activeItem)
        }
        this.timer = setTimeout(() => {
          this.getDeviceInfo()
        },1000*10)
      })
      .catch(err => {});
    },
    /**
     * 获取大事件数据
     */
    getDeviceMemorabilia(){
        project({
          FAction: "GetDeviceMemorabilia",
          DeviceID: this.$route.params.id //产品自己id
        })
        .then(data => {
          this.dl_datalist = data.FObject
        })
        .catch(err => {
        })
    },
    /**
     * 格式化折线图数据
     */
    formatChartData(arr){
      let chartData = {
          name:[],
          columns:[],
          rows:{}
      }
      chartData.name = arr.map(item => item.DataItemName)
      chartData.columns = arr[0].ProjectChartLineDatas.map(item => item.X)
      chartData.rows = arr.map(item => {
          let yAxis = item.ProjectChartLineDatas.map(obj => obj.Y)
          return {
            type: "line",
            name: item.DataItemName,
            data: yAxis
          };
      })
      return chartData
    },
    opens_video(urls) {
      //播放视频地址
      if (urls) {
        /* var obj=`<video id='my-video'  class='video-js vjs-big-play-centered' controls preload='auto' poster='/static/image/index/video_start.jpg'>
			 <source src=${urls} type='application/x-mpegURL'></video>` */
        // obj=obj.replace("adress_src",urls)
        videojs(
          "my-video",
          {
            bigPlayButton: false,
            textTrackDisplay: false,
            posterImage: true,
            errorDisplay: false,
            controlBar: true,
            height: 520,
            width: 1540,
            loop: true
          },
          function() {
            this.play();
          }
        );
      } else {
        videojs("my-video", {}, function() {
          this.dispose();
        });
        this.video_div = false;
      }
    },
    getInfo(info) {
      if (
        this.datalist02.DeviceTypeID == 801 ||
        this.datalist02.DeviceTypeID == 800
      ) {
        this.videoUrl = info && info.ExtendAddress;
        if (!this.videoUrl) return;
        this.video_div = true;
        this.$nextTick(() => {
          this.opens_video(this.videoUrl);
        });
      }
    },
    /**
     * 点击设备的每个数据项时
     */
    clickDeviceItem(item){
      this.activeItem = item
      if(this.datalist02.DeviceTypeID == 500){
        this.queryFireHostAlarmData()
      }else{
        this.getChartData()
      }
    },
    /**
     * 获取实时监测折线图数据
     */
    getChartData(){
      project({
        FAction: "GetDeviceDataItemChartData",
        DeviceID: this.$route.params.id,
        PossionID:this.activeItem.SDataID
      })
      .then((result) => {
        this.linedata = this.formatChartData(result.FObject)
      }).catch((err) => {
        
      });
    },
    /**
     * 398.查询消防主机未恢复告警数据
     */
    queryFireHostAlarmData(id){
      project({
        FAction: 'QueryFireHostAlarmData',
        DeviceID:this.$route.params.id,
        DataItemID:this.activeItem.SDataID
      })
      .then((result) => {
        this.alarmData = result.FObject || []
      }).catch((err) => {
        
      });
    },

  },
  components: { "my-imgdata": img_data, table_data ,lineChart,liftDetaile},
  mounted: function() {

  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  destroyed() {
    if (this.video_div) {
      this.opens_video();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

a {
  color: #42b983;
}

.det_top {
  height: 227px;
  position: relative;
}

.det_top .det_left {
  position: relative;
  margin-top: -6px;
  width: 456px;
  height: 230px;
  float: left;
  background: url(../../static/image/indexdetail/bg_blue.png) no-repeat;
}
/*.det_top .det_left:hover {background: url(/static/image/indexdetail/bg_red_1.png) no-repeat;}*/
.det_top .det_left .dtitle {
  height: 20px;
  width: 130px;
  margin: 0 auto;
  padding: 3px 0;
  overflow: hidden;
  font-size: 16px;
  color: #f1f1f2;
}
.det_top .det_left .dmes {
  height: 25px;
  font-size: 15px;
  padding: 10px 15px;
}
.det_top .det_left .dmes img {
  vertical-align: -2px;
}
.det_top .det_left .dmes img.dc {
  vertical-align: -5px;
  width: 18px;
  height: 18px;
}
.det_top .det_left .dmes img.da {
  vertical-align: -6px;
  width: 18px;
  height: 18px;
}
.det_top .det_left .dmes img.db {
  vertical-align: -3px;
  width: 18px;
  height: 18px;
}

.det_top .det_left .dt_kgs {
  width: 92px;
  height: 108px;
  float: left;
  padding: 0 15px 0 20px;
}
.det_top .det_left .dt_kgs > div {
  padding: 0 0 70px 0;
}
.det_top .det_left .dt_kgs > div p {
  width: 50%;
  float: left;
  font-size: 15px;
  color: #737373;
}
.det_top .det_left .dt_kgs > div p.n {
  color: #03cd82;
  font-size: 25px;
}

.det_top .det_left .ge_pelin {
  position: absolute;
  top: 117px;
  left: 170px;
}

.det_top .det_left .de_arc_li {
  width: 310px;
  height: 148px;
  margin-top: -8px;
  float: left;
  background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat;
}
.det_top .det_left .de_numli {
  width: 115px;
  height: 120px;
  position: absolute;
  top: 97px;
  right: 10px;
}
.det_top .det_left .de_numli p {
  line-height: 27px;
  font-size: 20px;
}
.det_top .det_left .de_two {
  top: 111px;
  right: -1px;
}

.det_top .det_rightItem {
  width: 1086px;
  height: 227px;
  margin: -5px 15px 0 0;
  background: url(../../static/image/indexdetail/bg_blue_2.png) no-repeat;
  float: right;
}
.det_top .det_rightItem .det_titles {
  float: left;
}
.det_top .det_rightItem .show_acr_c {
}

.detail .det_itemList {
  width: 1559px;
  height: 690px;
  background: url(../../static/image/indexdetail/content_fg_1.png);
}
.detail .det_itemList .mains {
  padding: 0 5px 0 20px;
  margin-right: 5px;
  height: 600px;
  overflow: hidden;
}
.detail .det_tlg {
  /*padding: 25px 16px 0 20px;*/
  overflow: hidden;
}
.detail .pjngh {
  padding: 2px 16px 0 20px;
}

.det_left ul li {
  padding: 15px 25px 5px 25px;
  height: 194px;
}
.det_left ul li.err .inner_bg_sh {
  width: 100%;
  height: 194px;
  background: url(../../static/image/indexdetail/content_bg_2.png) 0px 0 no-repeat;
}
.det_left ul li .a1 {
  position: relative;
  width: 148px;
  height: 175px;
  float: left;
  padding: 0px 0 0 10px;
  text-align: left;
}

.det_left ul li .a1 .pui_1 {
  position: absolute;
  top: 41px;
  left: 0;
  width: 140px;
}
.det_left ul li .a1 .pui_2 {
  position: absolute;
  top: 88px;
  left: 0;
  width: 140px;
}
.det_left ul li .a1 .pui_3 {
  position: absolute;
  top: 135px;
  left: 0;
  width: 140px;
}
.det_left ul li .a1 .pui_4 {
  position: absolute;
  top: 41px;
  right: -265px;
  width: 140px;
}
.det_left ul li .a1 .pui_5 {
  position: absolute;
  top: 88px;
  right: -265px;
  width: 140px;
}
.det_left ul li .a1 .pui_6 {
  position: absolute;
  top: 135px;
  right: -265px;
  width: 140px;
}
.det_left ul li .a1 .pui_7 {
  position: absolute;
  top: 135px;
  right: -144px;
  width: 140px;
}

.det_left ul li .a1 .jg {
  position: relative;
  height: 35px;
}
.det_left ul li .a1 .jg .t {
  position: absolute;
  top: 0px;
  left: -12px;
  height: 35px;
  width: 205px;
  font-size: 20px;
  color: #525e7e;
  white-space: nowrap;
}
.det_left ul li .a1 .gre {
  color: #03cd82;
  font-size: 17px;
  padding: 1px 0;
  cursor: pointer;
}
.det_left ul li .a1 .grd {
  font-size: 13px;
  color: #737373;
}
.det_left ul li .a1 .line {
  height: 5px;
}

.det_left ul li .a2 {
  width: 96px;
  height: 175px;
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
}
.det_left ul li .a2 p {
  width: 100%;
}
.det_left ul li .a2 p.tx {
  font-size: 16px;
  color: #03cd82;
}
.det_left ul li.err .a2 p.tx {
  font-size: 16px;
  color: #d62445;
}
.det_left ul li .a2 p.p1 {
  color: #525e7e;
}
.det_left ul li .a2 p.p2 {
  color: #d62445;
}
.det_left ul li .lrn {
  width: 116px;
  margin: 15px 15px 0 0;
}

.det_left ul li .lrn .gre {
  color: #03cd82;
  font-size: 17px;
  padding: 7px 0;
}
.det_left ul li .lrn .grd {
  font-size: 13px;
  color: #737373;
}
.det_left ul li .lrn .line {
  height: 18px;
}
.video-container {
  width: 1562px;
  height: 546px;
  box-sizing: border-box;
  background: url("../../static/image/indexdetail/video_bg.png") center no-repeat;
  padding-top: 14px;
  /* 
	  border:5px solid #004876;
	  border-radius:6px; */
}
.video-container #my-video {
  width: 1540px !important;
  height: 520px !important;
  margin: auto;
}
.info {
  width: 1563px;
  height: 359px;
  margin-top: 33px;
  background: url("../../static/image/indexdetail/info_bg.png") center no-repeat;
}
.info .table_bh {
  padding: 0px 50px 5px 50px;
}
.iframe-container{
  position: relative;
}
.iframe-container iframe{
  width: 100%;
  height: 900px;
}
.status-1{
    color: #1bd1a1
}
.status-2{
    color: #73777a
}
.status-3{
    color: #0091fe
}
.status-4{
    color: #fef500
}
.status-5{
    color: #9c1428
}
.type-500{
  height: 164px;
  margin-top: 30px;
}
.type-500 ul li{
  height: 34px;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.type-500 ul li span+span{
  margin-left: 50px;
}
</style>
