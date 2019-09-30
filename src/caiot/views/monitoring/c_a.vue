<template>
  <div class="chg_ground">
    <!-- 低配电组件  区域-->
    <div class="vdeo_items" :class="{'div_control':video_div==0}">
      <p
        class="vdeo_titles"
        @click="opens_video()"
        style="text-align: right; padding: 5px 15px; cursor: pointer;"
      >关闭</p>
      <div class="show_vdeos" id="innerVideo"></div>
    </div>
    <!--<video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" poster="http://vjs.zencdn.net/v/oceans.png">
	 <source src="http://hls.open.ys7.com/openlive/9afe414a6dfe481aad4a1d154d3dc954.m3u8" type="application/x-mpegURL">
    </video>-->
    <ul>
      <li v-for="(item, index) in datalist" :key="index" :class="{'show_warn_class':item.TopValue.length,'no_warn_class':!item.TopValue.length,}">
        <router-link :to="{ name: 'detail_info',params:{ id:item.AreaID,SingleType:2}}">
          <div class="hover_bg" style="margin: 0 5px 0 0;">
           <!--  <router-link :to="{ name: 'detail_info',params:{ id:item.AreaID,SingleType:2}}"> -->
              <p class="fi_ts">{{item.AreaTitle}}</p>
            <!-- </router-link> -->
            <div class="fi_eh">
              <div v-for="(list, key) in item.DataDetail ">
                <div>
                  <p class="ght">
                    <i class="jg">
                      {{list.SDataTitle}}
                      <br>
                    </i>
                    <i>（{{list.SDataUnit}})</i>
                  </p>
                  <p class="ght_text" v-for="(shcg, k) in list.SDataValue">{{shcg.DValue}}</p>
                  <!--温度-->
                </div>
              </div>
            </div>
            <div class="pi_itm_out">
              <div class="pi_itm" :id="setdocID + index"></div>
            </div>
            <div class="manu_li">
              <p class="l" v-if="item.VedioAddress">
                <img
                  src="../../static/image/index/icon_4.png"
                  @click="opens_video(item.VedioAddress)"
                  style=" vertical-align: 0px; cursor: pointer;"
                >
              </p>
              <p v-for="(lis, key) in item.TopValue" class="l">
                <i
                  class="icon iconfont set_imgColor"
                  :class="[lis.AlarmWebIcon]"
                  :data="lis.AlarmType"
                ></i>
                &nbsp;{{lis.AlarmCount}}&nbsp;
                <!--<span v-if="key==0"><img src="/static/image/index/content_icon_5.png"> {{lis.AlarmCount}} &nbsp;</span>
                <span v-if="key==1"><img src="/static/image/index/content_icon_4.png"> {{lis.AlarmCount}} </span>-->
                <!-- <span><img src="/static/image/index/content_icon_4.png"> {{lis.AlarmIcon}}</span>-->
              </p>
            </div>
            <div class="tl_t_fd">
              <p style="color: #F1F1F2; font-size: 10px;">{{item.TargetTitle}}</p>
              <p style="color: #F1F1F2; font-size: 22px;">{{item.TargetValue}}</p>
            </div>

            <div class="numb_fd">
              <div v-for="(abc, k) in item.TargetDetail" class="posi">
                <p :class="'abc' + k">{{abc.STargetValue}}</p>
              </div>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<style>
.chg_ground ul li {
  width: 381px;
  height: 220px;
  float: left;
  position: relative;
  background: url(../../static/image/index/c4e.png) no-repeat 95px 20px;
}
.chg_ground ul li:hover .hover_bg {
  /*background: url(/static/image/index/content_bg_3.png)  no-repeat 0 0;*/
  background: url(../../static/image/index/hover_10.png) no-repeat 0 0;
}
.chg_ground ul li:hover .manu_li {
  display: block;
}

.chg_ground ul li.show_warn_class {
  background: url(../../static/image/index/content_bg_3.png) no-repeat 0 0;
}
.chg_ground ul li.show_warn_class:hover .hover_bg {
  background: none;
}

.chg_ground ul li .fi_ts {
  font-size: 20px;
  color: #525e7e;
  text-align: left;
  padding: 15px 0 0 15px;
}
.chg_ground ul li .fi_eh {
  width: 100px;
  height: 123px; /*height: 126px;*/
  overflow: hidden;
  position: absolute;
  top: 80px;
  left: 10px;
  color: #737373;
}
.chg_ground ul li .ght {
  float: left;
  width: 50%;
}
.chg_ground ul li .fi_eh > div {
  overflow: hidden;
  padding-bottom: 4px;
}
.chg_ground ul li .fi_eh .jg {
  font-size: 16px;
  padding-left: 3px;
}
.chg_ground ul li .fi_eh .ght_text {
  font-size: 22px;
  color: #03cd82;
}
.chg_ground ul li .pi_itm_out {
  height: 175px;
  background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat 117px
    10px;
  z-index: 110;
}
.chg_ground ul li .pi_itm {
  height: 175px;
  padding-left: 100px;
  z-index: 115;
}
.chg_ground ul li .manu_li {
  width: 104px;
  height: 40px;
  position: absolute;
  top: 19px;
  right: 15px;
  font-size: 14px;
}
.chg_ground ul li .manu_li i {
  padding: 0 5px;
}
.chg_ground ul li .manu_li img {
  vertical-align: -3px;
}
.chg_ground ul li .tl_t_fd {
  position: absolute;
  top: 106px;
  left: 140px;
  width: 100px;
}
.chg_ground ul li .numb_fd {
  position: absolute;
  top: 94px;
  right: -5px;
  width: 60px;
  text-align: left;
  font-size: 20px;
  line-height: 27px;
}
.chg_ground ul li .chi_1 {
  top: 116px;
}
.chg_ground ul li .chi_2 {
  top: 103px;
}
.chg_ground ul li .chi_3 {
  top: 90px;
}
.chg_ground ul li .chi_4 {
  top: 75px;
}
.chg_ground ul li .chi_5 {
  top: 60px;
}
</style>
<script>
import videojs from "video.js";
//import "videojs-contrib-hls";
var echarts = require("echarts");
import * as comm from "@/caiot/assets/js/pro_common";
import {project} from '@/caiot/request/api';
export default {
  data() {
    return {
      datalist: [],
      setdocID: "nfs_",
      video_div: 0,
      timer:null,//实时刷新定时器
    };
  },
  created() {},
  methods: {
    opens_video(urls) {
      //播放视频地址

      if (urls) {
        var obj =
          "<video id='my-video'  class='video-js vjs-big-play-centered' controls preload='auto' poster='/static/image/index/video_start.jpg'>" +
          "<source src='adress_src' type='application/x-mpegURL'></video>";
        obj = obj.replace("adress_src", urls);
        this.video_div = 1;

        document.getElementById("innerVideo").innerHTML = obj;

        videojs(
          "my-video",
          {
            bigPlayButton: false,
            textTrackDisplay: false,
            posterImage: true,
            errorDisplay: false,
            controlBar: true,
            height: 574,
            width: 800,
            loop: true
          },
          function() {
            this.play();
          }
        );
      } else {
        this.video_div = 0;
        videojs("my-video", {}, function() {
          this.dispose();
        });
        document.getElementById("innerVideo").innerHTML = "";
      }
    },
    Pro() {
	    //返回一个Promise对象
	    return new  Promise((resolve,reject) => {
		    project({
		  	  FAction: "GetPrjAreaInfo"
		    })
		    .then(data => {
              this.datalist = data.FObject;
              console.log(this.datalist);
              resolve("succ");
		    })
		    .catch(error => {
		  	  reject(error)
		    })
	    })
    },

    Pro2() {
      let _this = this;
      //返回一个Promise对象
      return new Promise(function(resolve, reject) {
        let arr = _this.datalist;
        for (var g = 0; g < _this.datalist.length; g++) {
          _this.Pie_list(_this.setdocID + g, g);
        }

        /*给所有图动态加色*/
        var doc_all = document.getElementsByTagName("i");
        for (var gg = 0; gg < doc_all.length; gg++) {
          if (doc_all[gg].getAttribute("data")) {
            var hg = Number(doc_all[gg].getAttribute("data"));
            var ggg = comm.resetColor(hg);
            doc_all[gg].style.color = ggg;
          }
        }

        /*给所有图动态加色*/

        /*区域数据位置div 显示top位置*/
        var docs = document.querySelectorAll(".numb_fd");
        for (let r = 0; r < docs.length; r++) {
          //console.log(docs[r].children.length)
          if (docs[r].className.indexOf("chi_") == -1) {
            docs[r].className += " " + "chi_" + docs[r].children.length;
          }
        }

        /*区域数据位置top*/
      });
    },

    Pie_list(d, n) {
      var arrs01 = [],
        arrs02 = [],
        gcolor = [];
      var arr03 = this.datalist[n].TargetDetail;
      for (var j = 0; j < arr03.length; j++) {
        arrs02.push(arr03[j].STargetTitle); //取['运行','停止','故障'],
        arrs01.push({
          value: arr03[j].STargetValue,
          name: arr03[j].STargetTitle,
          color: arr03[j].SColor
        }); //取{value:10, name:'运行',}

        gcolor.push(comm.resetColor(arr03[j].SColor)); //设置图色
      }

      var dom_right = document.getElementById(d);
      var myChart = echarts.init(dom_right);
      var app = {};
      app.title = "环形图";
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "169px",
          y: "center",
          //data:['运行','停止','故障'],
          data: arrs02,
          textStyle: { color: "#fff" },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 15
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: ["32%", "46%"], //图形显示位置
            radius: ["50", "60"],
            label: {
              normal: {
                show: false, //文字显示在图中间位置
                position: "center"
              }
            },
            /* data:[
											{value:10, name:'运行',},
											{value:30, name:'停止'},
											{value:60, name:'故障'},
									] */
            data: arrs01
          }
        ],
        //color:['#1bd1a1','#73777a','#8f1c2d']
        color: gcolor
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
  },
  mounted: function() {
    let _this = this;
    function settimeouts_data_a() {
      _this.Pro()
      .then(function(d) {
        return _this.Pro2(d);
      })
      .catch(function(err) {
        console.log(err);
        //  throw new Error(err)
      });
      _this.timer = setTimeout(settimeouts_data_a, 4000);
     /*  let timeoutId_a = setTimeout(settimeouts_data_a, 4000);
      let router_currt = _this.$route.name;
      if (router_currt != "product") {
        clearTimeout(timeoutId_a);
      } */
    }

    settimeouts_data_a();
  },
  computed: {},
  beforeDestroy(){
    clearTimeout(this.timer)
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

.vdeo_items {
  width: 800px;
  height: 600px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  background: #5a5c5f;
  z-index: 500;
  /*display: flex;justify-content:center;align-items:center;align-content:center*/
}

.div_control {
  display: none;
}
/*引入videojs视频播放器*/
.video-js .vjs-big-play-button {
  font-size: 2.5em;
  line-height: 2.3em;
  height: 2.5em;
  width: 2.5em;
  -webkit-border-radius: 2.5em;
  -moz-border-radius: 2.5em;
  border-radius: 2.5em;
  background-color: #73859f;
  background-color: rgba(115, 133, 159, 0.5);
  border-width: 0.15em;
  margin-top: -1.25em;
  margin-left: -1.75em;
}
/* 中间的播放箭头 */
.vjs-big-play-button .vjs-icon-placeholder {
  font-size: 1.63em;
}
/* 加载圆圈 */
.vjs-loading-spinner {
  font-size: 2.5em;
  width: 2em;
  height: 2em;
  border-radius: 1em;
  margin-top: -1em;
  margin-left: -1.5em;
}

.video-js .vjs-time-control {
  display: block;
}
.video-js .vjs-remaining-time {
  display: none;
}
/*引入videojs视频播放器*/
</style>
