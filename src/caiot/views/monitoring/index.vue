<template>
  <div class="monitoring">
    <div v-if="$route.name === 'SystemBrowse'||$route.name === 'AreaBrowse'">
      <router-view></router-view>
    </div>
    <div v-else>
      <!-- 实时监控 -->
      <div class="left">
        <div class="left_item01">
          <ul>
            <li class="top">
              <p class="text">
                <span class="tc">天气信息</span>
              </p>
              <p class="time">{{time.clock}}</p>
              <p class="date">{{time.currs}}</p>
              <div class="sd">
                <!--<img src="/static/image/index/leftbar_icon_1.png">-->
                <i class="icon iconfont tq_icons" :class="weathers.img_id"></i>
                <i class="sm" style="margin-left: 5px;">{{weathers.s}}℃/</i>
                <i>{{weathers.h}}℃</i>
              </div>
            </li>
          </ul>
        </div>

        <div class="left_item02">
          <my-componentLeft :datas="datalist"></my-componentLeft>
        </div>
      </div>
      <div class="m_right ">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style>
.monitoring .m_right {
  width: 1565px;
  float: left;
  margin-left: 8px;
}
.monitoring .m_right .fin_item ul {
  padding: 29px 20px;
}
.monitoring .fin_item {
  height: 700px;
  background: url(../../static/image/index/content_bg_6.png) no-repeat;
}
</style>
<script>
import * as comm from "../../assets/js/pro_common";
import cm_left from "./c_left.vue"; //左组件
import {project} from '@/caiot/request/api';
export default {
  data() {
    return {
      weathers: {
        h: "",
        s: "",
        img_id: ""
      },
      time: "",
      datalist: ["terry", "12", "jkkna"]
    };
  },
  created() {
    /*显示时间*/
    const gettimes = () => {
      let CurentTime = comm.CurentTime(); //显示时间
      this.time = CurentTime;
      setTimeout(gettimes, 1000);
    }
    gettimes();

    /*显示天气*/
	  this.getWeather()
  },
  methods: {
    /**
     * getWeather 获取天气信息
     * @private
     */
    getWeather: function() {
      project({
		    FAction: "GetPrjWeatherData",
	    })
	    .then(data => {
        this.weathers.h = data.FObject[0].HighTemp;
        this.weathers.s = data.FObject[0].LowTemp;
        this.weathers.img_id = data.FObject[0].WeatherIconID;
	    })
	    .catch(error => {
	    })
    }
  },
  components: { "my-componentLeft": cm_left },
  mounted: function() {}
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
.monitoring .left {
  width: 299px;
  overflow: hidden;
  padding: 0 12px 0 8px;
  float: left;
}

.monitoring .left .left_item01 ul {
  width: 100%;
}
.monitoring .left .left_item01 ul li {
  width: 100%;
  margin: 0 0 15px 0;
  height: 200px;
  background: url(../../static/image/index/leftbar_bg_1.png);
  padding-top: 14px;
}
.monitoring .left .left_item01 ul li .text {
  width: 273px;
  height: 35px;
  background: url(../../static/image/index/leftbar_bg_2.png) 5px 14px no-repeat;
  margin: 0px 0 0 8px;
}
.monitoring .left .left_item01 ul li .text .tc {
  float: left;
  margin: -2px 0 0 12px;
  font-size: 18px;
  color: #f1f1f2;
}
.monitoring .left .left_item01 ul li.top .time {
  color: #607ab3;
  font-size: 20px;
  padding: 15px 0 5px 0;
}
.monitoring .left .left_item01 ul li.top .date {
  color: #607ab3;
  font-size: 18px;
  padding: 3px 0 5px 0;
}
.monitoring .left .left_item01 ul li.top .sd img {
  width: 70px;
  height: 60px;
  vertical-align: -16px;
}
.monitoring .left .left_item01 ul li.top .sd i {
  font-size: 32px;
  color: #2a91fc;
  padding: 0 2px 0 10px;
}
.monitoring .left .left_item01 ul li.top .sd i.tq_icons {
  font-size: 50px;
}
.monitoring .left .left_item01 ul li.top .sd i.sm {
  font-size: 26px;
  color: #525e7e;
  padding: 0;
}

.monitoring .left .left_item01 ul li .ball_outsi {
  position: relative;
  overflow: hidden;
}
.monitoring .left .left_item01 ul li .ball_outsi .show_mon {
  height: 146px;
  margin: 5px 10px;
  background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat 26px 4px;
  color: #fff;
}
.monitoring .left .left_item01 ul li .ball_outsi .tl {
  position: absolute;
  top: 62px;
  left: 81px;
}
.monitoring .left .left_item01 ul li .ball_outsi .numb {
  position: absolute;
  top: 37px;
  right: 24px;
  font-size: 20px;
  line-height: 27px;
}
.monitoring .left .left_item01 ul li .ball_outsi .n1 {
  top: 52px;
}
.monitoring .left .left_item01 ul li .ball_outsi .n2 {
  top: 52px;
  right: 18px;
}
</style>
