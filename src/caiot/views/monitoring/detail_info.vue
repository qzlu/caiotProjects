<style>
.reset_green {
  color: #1bd1a1;
}
</style>
<template>
  <div class="detail">
    <div class="vdeo_items" :class="{'div_control':video_div==0}">
      <p
        class="vdeo_titles"
        @click="opens_video()"
        style="text-align: right; padding: 5px 15px; cursor: pointer;"
      >关闭</p>
      <div class="show_vdeos" id="innerVideo"></div>
    </div>

    <section :class="['det_top',{lift:(abc_datalist04[0]&&abc_datalist04[0].DeviceTypeID == 1003)}]">
      <p class="btn_back" @click="routerback()">
        <img src="../../static/image/index/back_btn.png" />返回
      </p>
      <div class="det_ghyi" v-if="abc_datalist04[0]&&abc_datalist04[0].DeviceTypeID != 1003">
        <!--右1-->

        <div
          class="det_left"
          v-for="(item, index) in abc_datalist01"
          :class="{abcdf:item.TopValue.length>0}"
        >
          <p class="dtitle">{{item.ItemTitle}}</p>
          <div class="dmes" style="text-align: right;">
            <span v-if="item.VedioAddress">
              <img
                src="../../static/image/index/icon_4.png"
                @click="opens_video(item.VedioAddress)"
                style=" vertical-align: 0px; cursor: pointer;"
              />
            </span>
            <span v-for="(lis, key) in item.TopValue">
              <span>
                <!--<input v-model="colortype"  v-model.number="lis.AlarmType" value="lis.AlarmType">-->
                <i :class="['icon','iconfont',lis.AlarmWebIcon]" :data="lis.AlarmType"></i>
                &nbsp;&nbsp;{{lis.AlarmCount}}&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </div>

          <div class="dt_kgs">
            <div v-if="item.DataDetail!=''">
              <div style="height: 50px;">
                <p>
                  <!--温度-->
                  {{item.DataDetail[0].SDataTitle}}
                  <br />
                  <!--(℃)-->
                  <i style="font-size: 10px;">&nbsp;&nbsp;({{item.DataDetail[0].SDataUnit}})</i>&nbsp;&nbsp;&nbsp;
                </p>
                <p
                  class="n"
                >{{item.DataDetail[0].SDataValue[0].DValue>1000?(item.DataDetail[0].SDataValue[0].DValue/10000).toFixed(1)+'w':item.DataDetail[0].SDataValue[0].DValue}}</p>
              </div>
              <div style="height: 50px;" v-if="item.DataDetail[1]">
                <p>
                  <!--湿度-->
                  {{item.DataDetail[1].SDataTitle}}
                  <br />
                  <!--(%)-->
                  <i style="font-size: 10px;">&nbsp;&nbsp;({{item.DataDetail[1].SDataUnit}})</i>&nbsp;&nbsp;&nbsp;
                </p>
                <p
                  class="n"
                >{{Math.abs(item.DataDetail[1].SDataValue[0].DValue)>1000?(item.DataDetail[1].SDataValue[0].DValue/10000).toFixed(1)+'w':item.DataDetail[1].SDataValue[0].DValue}}</p>
              </div>
            </div>
          </div>
          <div class="de_arc_li" id="det_0"></div>
          <div class="ge_pelin">
            <p>{{item.TargetTitle}}</p>
            <p style="font-size: 20px;">{{item.TargetValue}}</p>
          </div>
          <div class="de_numli" :class="setclass_ytpe(item.TargetDetail.length)">
            <p v-for="(abc, key) in item.TargetDetail">{{abc.STargetValue}}</p>
          </div>
        </div>

        <!--右1-->

        <!--bar-->
        <div class="det_rightItem">
          <div
            class="det_titles"
            style="width: 110px; height: 165px; padding: 25px 0 0 20px; float: left; font-size: 18px; color: #F1F2F2;"
          >分类概况</div>
          <div
            class="show_acr_c"
            style="width: 900px; height: 185px; float: left; color: #fff; margin-top: 25px;"
            id="container_list"
          ></div>
        </div>
        <!--bar-->
      </div>
    </section>

    <section :class="['det_itemList',,{lift:abc_datalist04[0]&&abc_datalist04[0].DeviceTypeID == 1003}]">
      <div class="gh_line" style="height: 25px;"></div>
      <!-- 不是电梯 -->
      <div class="mains" v-if="abc_datalist04[0]&&abc_datalist04[0].DeviceTypeID != 1003">
        <div v-for="(gitem,key) in abc_datalist04" style="float: left;">
          <div class="det_tlg">
            <div class="title">
              <p class="l ts">
                <i class="icon iconfont" :class="gitem.icon"></i>
                &nbsp;{{gitem.name}}
                <!--变压器-->
                <i>（{{gitem.item.length}}）</i>
              </p>
              <!--<p class="r tsg"><img src="/static/image/index/icon_2.png" />&nbsp;12&nbsp;&nbsp;<img src="/static/image/index/icon_1.png" /> 34</p>-->
            </div>
          </div>

          <div class="deo_list">
            <ul>
              <li v-for="(suList,key) in gitem.item" :class="{alarm:suList.IsAlarm}">
                <i
                  :class="{r:true, 'el-icon-star-off':!suList.IsFocus,'el-icon-star-on':suList.IsFocus}"
                  @click.stop="addOrDeleteUFocusMonitor(suList)"
                ></i>
                <router-link
                  :to="{ name: 'detail_info_list',params:{ id:suList.DeviceID,PossionID:suList.DataDetail[0].SDataID,getalldata:suList}}"
                >
                  <div :id="suList.DeviceID" class="clearfix">
                    <div class="inner_bg_sh">
                      <div class="a1">
                        <div class="jg">
                          <!--后端要求，PossionID为默认的第一个（三相线电压）id，带过去,还要把整个点击的当前数组带过去getalldata-->
                          <!-- <router-link :to="{ name: 'detail_info_list',params:{ id:suList.DeviceID,PossionID:suList.DataDetail[0].SDataID,getalldata:suList}}"> -->
                          <p class="t" :title="suList.DeviceName">
                            {{suList.DeviceName}}
                            <!--1#变压器-->
                          </p>
                          <!-- </router-link> -->
                        </div>
                        <!--三相线电压数据-->
                        <div v-for="(c,key) in suList.DataDetail" :class="setclass(c.SDataID)">
                          <p class="gre">
                            <i
                              v-for="(df,key) in c.SDataValue"
                              :data="df.DStatus"
                            >{{(suList.DeviceTypeID==1003 && c.SDataID == 1) ? (df.DValue>0?'上行':(df.FValue == 0 ? '停止': '下行')):df.DValue}}{{c.SDataValue.length>key+1?'/':''}}</i>
                          </p>

                          <p class="grd">
                            {{c.SDataTitle}}
                            <span v-if="c.SDataUnit">({{c.SDataUnit}})</span>
                            <!--三相线电压(V)-->
                          </p>
                        </div>
                        <!--end of 三相线电压数据-->
                      </div>

                      <div class="a2">
                        <div>
                          <p>
                            <i
                              class="icon iconfont reset_green"
                              :class="suList.WebIconName"
                              :data="suList.DeviceStatus"
                              style="font-size: 50px;"
                            ></i>
                            <!--<img src="/static/image/indexdetail/content_icon_3.png" />-->
                          </p>
                          <p class="tx">
                            <!--合闸-->
                            <i :data="suList.DeviceStatus">{{suList.DeviceStatusTitle}}</i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 电梯页面 -->
      <div class="lift-list" v-else>
        <h4><i class="iconfont icon-Equipment"></i>设备列表</h4>
        <ul>
          <li v-for="(item,i) in abc_datalist04[0]?abc_datalist04[0].item:[]" :key="i">
            <i
              :class="{r:true, 'el-icon-star-off':!item.IsFocus,'el-icon-star-on':item.IsFocus}"
              @click.stop="addOrDeleteUFocusMonitor(item)"
            ></i>
            <router-link :to="{ name: 'detail_info_list',params:{ id:item.DeviceID,PossionID:item.DataDetail[0].SDataID,getalldata:item}}">
              <h5>
                {{item.DeviceName}}
              </h5>
              <div >
                <div class="statu l">
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
    </section>
  </div>
</template>
<style>
.det_top .btn_back {
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
.det_top .btn_back img {
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

[class*="el-icon-star-"] {
  font-size: 24px;
  cursor: pointer;
  position: relative;
  top: 20px;
  right: 20px;
  z-index: 100;
}
.el-icon-star-off {
  color: #525e7e;
}
.el-icon-star-on {
  color: #2a91fc;
}
</style>
<script>
import videojs from "video.js";
// import 'videojs-contrib-hls'
var echarts = require("echarts");
import * as comm from "../../assets/js/pro_common";
import { project, Monitor } from "@/caiot/request/api";
export default {
  data() {
    return {
      video_div: 0, //视频
      colortype: "",
      setdocID: "det_0",
      datalist: [],
      abc_datalist01: [], //pie图
      abc_datalist02: [], //bar图
      abc_datalist03: [], //大框列表图ajax初始化值，需要组装才能
      abc_datalist04: [] //大框列表图ajax值组装后，用v-for读出来
    };
  },
  created() {
    //let aaa= this.$route.params.id;
    //console.log(this.$route.params.SingleType)
    var data = [
      {
        id: "0",
        title: "供配电0",
        name: "设备总数",
        num: "1000",
        a1: "22",
        a2: "12",
        list: [
          { value: 80, name: "运行" },
          { value: 15, name: "停止" },
          { value: 5, name: "故障" }
        ]
      }
      /*{id:"1",title:"告警总况",name:"及时恢复",num:"500",list:[{value:80, name:'已恢复'},{value:20, name:'未恢复'}]},		*/
    ];
    this.datalist = data;
  },
  methods: {
    setclass_ytpe(x) {
      return "uib_" + x;
    },

    setclass(x) {
      return "pui_" + x;
    },
    routerback() {
      this.$router.back(-1);
    },
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

    /*动态数据pie*/

    Pro() {
      let _this = this;
      //返回一个Promise对象
      //console.log(localStorage.getItem("projectid")+" "+_this.$route.params.SingleType+" "+_this.$route.params.id)
      return new Promise(function(resolve, reject) {
        _this.$axios
          .post("Project", {
            FTokenID: localStorage.getItem("Token"),
            FAction: "GetPrjSingleInfo",
            FVersion: "1.0.0",
            ProjectID: localStorage.getItem("projectid"),
            SingleType: _this.$route.params.SingleType, //1属于分类，2是区域
            SingleID: _this.$route.params.id //产品自己id
          })
          .then(function(jsons) {
            //console.log(jsons.data.FObject.ProjectItemInfo)
            //console.log(jsons.data.FObject.ProjectDeviceDataDetail)
            //console.log(jsons.data.FObject.ProjectDeviceTypeValue)

            // comm.messageErr(jsons.data.Result) //公共状态提示
            if (jsons) {
              _this.abc_datalist01 = jsons.data.FObject.ProjectItemInfo; //右一pie图
              _this.abc_datalist02 = jsons.data.FObject.ProjectDeviceTypeValue; //bar右一图
              _this.abc_datalist03 = jsons.data.FObject.ProjectDeviceDataDetail; //右下大框列表

              resolve("succ");
            }
          })
          .catch(function(err) {});
      });
    },
    Pro2() {
      let _this = this;
      //返回一个Promise对象
      return new Promise(function(resolve, reject) {
         _this.big_typeList();
        _this.Pie_list(_this.setdocID, 0); //生成pie图
        _this.set_bar(); //生成柱图
        resolve("succ");
      });
    },

    /*右下大分类列表详细信息*/
    /*obj.name=e.DeviceType;
						obj.id=e.DeviceTypeID;
						obj.item=arrs01;*/
    big_typeList() {
      /*重新组装可以直接v-for读取的数据*/
      this.abc_datalist04 = this.abc_datalist02.map(item => {
        return {
          DeviceTypeID: item.DeviceTypeID,
          name: item.DeviceType,
          icon: item.WebIconName,
          item: this.abc_datalist03.filter(
            obj => obj.DeviceTypeID == item.DeviceTypeID
          )
        };
      });
      /*end of 重新组装可以直接v-for读取的数据*/
    },

    /*end of 右下大分类列表详细信息*/

    Pie_list(d, n) {
      var arrs01 = [],
        arrs02 = [],
        gcolor = [];
      var arr03 = this.abc_datalist01[n].TargetDetail;
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
            name: "显示来源",
            type: "pie",
            center: ["25%", "48%"], //图形显示位置
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
    },

    /*动态数据 pie*/

    /*分类概况 bar图*/

    set_bar() {
      //柱形图
      let o = comm.chart_utis(this.abc_datalist02); //调用组装成数据
      var dom = document.getElementById("container_list");
      var myChart = echarts.init(dom);
      var app = {};
      var option = null;
      app.title = "堆叠条形图"; //右一

      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: {
            fontWeight: "normal", //标题颜色
            color: "#fff"
          },
          //  data: ['运行', '停止','营运']
          data: o.arr
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLine: {
            //y轴色
            lineStyle: {
              color: "#fff",
              width: 1
            }
          },
          data: o.DeviceType
          // data: ["变压器", "进线柜", "馈线柜", "联络柜1","联络柜2","联络柜3" ]
        },
        yAxis: {
          type: "value",
          splitLine: { show: false }, //去除网格线
          axisLine: {
            //y轴色
            lineStyle: {
              color: "#fff",
              width: 1
            }
          }
        },
        series: o.series_arr,
        color: o.color_change
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    },
    /**
     * 162.标记或取消重点监测设备
     */
    addOrDeleteUFocusMonitor(item) {
      Monitor({
        FAction: "AddOrDeleteUFocusMonitor",
        DeviceID: item.DeviceID
      })
        .then(data => {
          item.IsFocus = !item.IsFocus;
        })
        .catch(err => {});
    }
  },
  mounted: function() {
    let _this = this;

    function settimeouts_detail_info() {
      _this
        .Pro()
        .then(function(d) {
          return _this.Pro2(d);
        })
        .then(function() {
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

          /* 去除最后一条"/" */
          /* var doc_gh=document.querySelectorAll(".gre")	
					  for(let j of doc_gh){
					   	let ab=j.children,len=j.children.length 			   	 
					   	 if(len){
					   	 	ab[len-1].innerHTML=ab[len-1].innerHTML.replace("/",'')
					   	 	//console.log(ab[len-1].innerHTML)
					   	 }
					   }*/
          /* end of 去除最后一条"/" */
        })
        .catch(function(err) {});

      /*如果不是当前页面，清除定时器，不让自动执行*/
      //console.log(_this.$route.name)
      let timeoutId_detail_info = setTimeout(settimeouts_detail_info, 4000);
      let router_currt = _this.$route.name;
      if (router_currt != "detail_info") {
        clearTimeout(timeoutId_detail_info);
      }
    }
    settimeouts_detail_info();
  },
  computed: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->



<style lang='scss' scoped>
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

.det_top {
  height: 226px;
  position: relative;
}
.det_top.lift{
  height: 0;
}
.det_top .det_left {
  position: relative;
  margin-top: -15px;
  width: 456px;
  height: 230px;
  float: left;
  background: url(../../static/image/indexdetail/bg_blue_1.png) no-repeat;
}
.det_top .det_left:hover {
  background: url(../../static/image/index/hover_11.png) no-repeat;
}
.det_top .abcdf {
  background: url(../../static/image/indexdetail/bg_red_1.png) no-repeat;
}
.det_top .abcdf:hover {
  background: url(../../static/image/indexdetail/bg_red_1.png) no-repeat;
}
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
  vertical-align: -4px;
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
  padding: 10px 0 50px 0;
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
  left: 193px;
}

.det_top .det_left .de_arc_li {
  width: 280px;
  margin-left: 25px;
  height: 148px;
  margin-top: -8px;
  float: left;
  background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat;
}
.det_top .det_left .de_numli {
  width: 70px;
  height: 90px;
  position: absolute;
  top: 97px;
  right: 5px;
  text-align: left;
}

.det_top .det_left .de_numli p {
  line-height: 27px;
  font-size: 20px;
}

.det_top .det_left .uib_1 {
  top: 125px;
}
.det_top .det_left .uib_2 {
  top: 110px;
}
.det_top .det_left .uib_3 {
  top: 98px;
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
  background: url(../../static/image/index/content_bg_6.png);
  background-size: 100% 100%;
}
.detail .det_itemList.lift{
  height: 920px;
}
.detail .det_itemList .mains {
  padding: 0 5px 0 20px;
  margin-right: 5px;
  height: 636px;
  overflow: auto;
}
.detail .det_itemList.lift .mains{
  height:862px
}
.detail .det_tlg {
  /*padding: 25px 16px 0 20px;*/
  overflow: hidden;
}
.detail .pjngh {
  padding: 2px 16px 0 20px;
}

.detail .det_itemList .title {
  height: 55px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 0 50px 0 35px;
  font-size: 20px;
  color: #18a1ec;
  line-height: 55px;
  text-align: left;
  background: url(../../static/image/indexdetail/content_bg_1sret.png) repeat;
}
.detail .det_itemList .title .ts i {
  font-size: 16px;
}
.detail .det_itemList .title .ts img {
  vertical-align: -3px;
  width: 20px;
  height: 22px;
}
.detail .det_itemList .title .yug img {
  width: 19px;
  height: 30px;
  vertical-align: -8px;
}
.detail .det_itemList .title .tsg {
  color: #d01e11;
  font-size: 16px;
}
.detail .det_itemList .title .tsg img {
  vertical-align: -5px;
}
.det_itemList .deo_list {
  min-width: 365px;
  height: 195px;
  margin: 2px 0 0 5px;
}
.det_itemList .deo_list ul li {
  width: 362px;
  padding: 0 8px 0 5px;
  height: 194px;
  float: left;
  background: url(../../static/image/indexdetail/fvc4e.png) 89px 0 no-repeat;
}

.det_itemList .deo_list ul li.alarm {
  background: url(../../static/image/indexdetail/content_bg_2.png) 0px 0 no-repeat;
}
.det_itemList .deo_list ul li.err .inner_bg_sh {
  width: 100%;
  height: 194px;
  background: url(../../static/image/indexdetail/content_bg_2.png) 0px 0 no-repeat;
}
.det_itemList .deo_list ul li .a1 {
  position: relative;
  width: 138px;
  height: 175px;
  float: left;
  padding: 10px 0 0 10px;
  text-align: left;
}

.det_itemList .deo_list ul li .a1 .pui_1 {
  position: absolute;
  top: 42px;
  left: 9px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_2 {
  position: absolute;
  top: 88px;
  left: 9px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_3 {
  position: absolute;
  top: 138px;
  left: 9px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_4 {
  position: absolute;
  top: 42px;
  right: -245px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_5 {
  position: absolute;
  top: 88px;
  right: -245px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_6 {
  position: absolute;
  top: 138px;
  right: -245px;
  width: 140px;
}
.det_itemList .deo_list ul li .a1 .pui_7 {
  position: absolute;
  top: 138px;
  right: -144px;
  width: 140px;
}

.det_itemList .deo_list ul li .a1 .jg {
  position: relative;
  height: 35px;
  width: 320px;
}
.det_itemList .deo_list ul li .a1 .jg .t {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 35px;
  width: 210px;
  overflow: hidden;
  font-size: 18px;
  color: #525e7e;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.det_itemList .deo_list ul li .a1 .gre {
  color: #03cd82;
  font-size: 15px;
  padding: 1px 0;
  white-space: nowrap;
}
.det_itemList .deo_list ul li .a1 .grd {
  font-size: 13px;
  color: #737373;
}
.det_itemList .deo_list ul li .a1 .line {
  height: 1px;
}

.det_itemList .deo_list ul li .a2 {
  width: 70px;
  height: 175px;
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
}
.det_itemList .deo_list ul li .a2 p {
  width: 100%;
}
.det_itemList .deo_list ul li .a2 p.tx {
  font-size: 16px;
  color: #03cd82;
}
.det_itemList .deo_list ul li.err .a2 p.tx {
  font-size: 16px;
  color: #d62445;
}
.det_itemList .deo_list ul li .a2 p.p1 {
  color: #525e7e;
}
.det_itemList .deo_list ul li .a2 p.p2 {
  color: #d62445;
}
.det_itemList .deo_list ul li .lrn {
  width: 116px;
  margin: 15px 15px 0 0;
}

.det_itemList .deo_list ul li .lrn .gre {
  color: #03cd82;
  font-size: 17px;
  padding: 7px 0;
}
.det_itemList .deo_list ul li .lrn .grd {
  font-size: 13px;
  color: #737373;
}
.det_itemList .deo_list ul li .lrn .line {
  height: 18px;
}
/************************* 电梯 ****************************/
.lift-list{
  padding: 22px;
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
      width: 380px;
      height: 192px;
      background: url(../../static/image/indexdetail/fvc4e.png) 89px 0 no-repeat;
      background-size:290px 100%;
      h5{
        text-align: left;
        padding-left: 16px;
        font-size:18px;
        font-weight:400;
        color:rgba(82,94,126,1);
      }
      [class*="el-icon-star-"]{
        top: 0px;
      }
    }
    .statu{
      width:72px;
      height:124px;
      line-height: 124px;
      margin-top: 20px;
      margin-left: 24px;
      font-size: 32px;
      background:rgba(11,38,79,1);
      border:1px solid rgba(1,150,7,1);
      border-radius:9px;
      box-shadow:  0 0 14px rgba(1,150,7,1);
      background: url(../../static/image/indexdetail/normal.gif)
    }
    .statu-items{
      margin-left: 30px;
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
</style>
