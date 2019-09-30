<template>
  <!-- 供配电 分类 -->
  <div class="ght_listn">
    <section class="png_ygts">
      <ul class="gpn_siItem">
        <li
          v-for="(item, index) in datalist"
          :key="index"
          :class="{'show_warn_class':item.TopValue.length,'no_warn_class':!item.TopValue.length}"
        >
          <router-link :to="{ name: 'detail_info',params:{ id:item.DeviceItemID,SingleType:1}}">
            <p class="u_tle">{{item.DeviceItemTitle}}</p>
            <div class="u_cen">
              <div class="icon_lig">
                <p v-for="(lis, key) in item.TopValue" class="r">
                  <span>
                    <i
                      class="icon iconfont set_imgColor"
                      :class="[lis.AlarmWebIcon]"
                      :data="lis.AlarmType"
                    ></i>
                    &nbsp;{{lis.AlarmCount}}&nbsp;
                  </span>
                </p>
              </div>

              <div class="tl_t">
                <p style="color: #F1F1F2; font-size: 10px;">{{item.TargetTitle}}</p>
                <p style="color: #F1F1F2; font-size: 22px;">{{item.TargetValue}}</p>
              </div>
              <div class="numb_t">
                <p v-for="(abc, key) in item.TargetDetail">{{abc.STargetValue}}</p>
              </div>
              <div class="u_acr">
                <pie-chart :data="item.data" :color="item.color" :setting="{center:['35%', '51%']}"></pie-chart>
              </div>
            </div>
          </router-link>
          <!-- 							<a v-else href="https://www.daantc.com:8443/cas/autoLogin?token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblVzZXIiOiJqaWFuZ2dvbmcxIiwibG9naW5Qc3N3b3JkIjoiamc1MTg4In0.Qi2ETx3m-wgBIJmdsDa8Our_MrKWBSMRpmZ5w8Dk3dg&se&service=https://www.daantc.com:8444/elevator-monitor/shiro-cas" target="_blank" rel="noopener noreferrer">
								<p class="u_tle">{{item.DeviceItemTitle}}</p>
								<div class="u_cen">
									 <div class="icon_lig">
									 	<p v-for="(lis, key) in item.TopValue" class="r">
									 		<i class="icon iconfont set_imgColor" :class="[lis.AlarmWebIcon]"  :data="lis.AlarmType"></i>&nbsp;{{lis.AlarmCount}}&nbsp;</span>

										</p>
										</div>

										<div class="tl_t"><p style="color: #F1F1F2; font-size: 10px;">{{item.TargetTitle}}</p><p style="color: #F1F1F2; font-size: 22px;">{{item.TargetValue}}</p></div>
										<div class="numb_t">
											<p v-for="(abc, key) in item.TargetDetail">{{abc.STargetValue}}</p>
										</div>							
									 <div class="u_acr">
										 	<pie-chart :data='item.data' :color='item.color' :setting="{center:['35%', '51%']}"></pie-chart>
										</div>
								</div>
          </a>-->
        </li>
      </ul>
    </section>
  </div>
</template>
<style>
</style>
<script>
import * as comm from "@/caiot/assets/js/pro_common";
import { project } from "@/caiot/request/api";
import { pieChart } from "@/caiot/zw-components/index";
export default {
  data() {
    return {
      datalist: []
    };
  },
  components: {
    pieChart
  },
  created() {},
  methods: {
    Pro() {
      project({
        FAction: "GetPrjDeviceItemInfo"
      })
        .then(data => {
          this.datalist = data.FObject;
          this.datalist.forEach(item => {
            let rows = item.TargetDetail.map(obj => {
              return { name: obj.STargetTitle, value: obj.STargetValue };
            });
            this.$set(item, "data", {
              colums: item.TargetDetail.map(obj => obj.STargetTitle),
              rows: rows
            });
            let colors = item.TargetDetail.map(obj =>
              comm.resetColor(obj.SColor)
            );
            this.$set(item, "color", colors);
		  });
		  console.log(this.datalist)
        })
        .catch(err => {});
    }
  },

  mounted: function() {
    let _this = this;
    function settimeouts_data_b() {
      _this.Pro();
      let timeoutId_b = setTimeout(settimeouts_data_b, 4000);
      let router_currt = _this.$route.name;
      if (router_currt != "product") {
        clearTimeout(timeoutId_b);
      }
    }
    settimeouts_data_b();
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
  color: #fff;
}
.ght_listn {
  height: 245px;
  position: relative;
  margin-top: -15px;
  overflow-y: auto;
}

.ght_listn::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.ght_listn::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
}
.ght_listn::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.ght_listn .png_ygts {
  height: 233px;
  position: relative;
}
.ght_listn ul {
  position: absolute;
  white-space: nowrap;
}
.ght_listn ul li {
  cursor: pointer;
  width: 313px;
  height: 234px;
  display: inline-block;
  background: url(../../static/image/index/content_bg_1.png) no-repeat;
  font-size: 16px;
}

.ght_listn ul li:hover {
  background: url(../../static/image/index/hover_09.png) no-repeat 0 1px; /*background: url(/static/image/index/content_bg_2.png) no-repeat 0 1px;*/
}
.ght_listn ul li:hover .icon_lig {
  display: block;
}
.ght_listn ul li.show_warn_class:hover {
  background: url(../../static/image/index/content_bg_2.png);
}
.ght_listn ul li.show_warn_class {
  background: url(../../static/image/index/content_bg_2.png);
}

.ght_listn ul li .u_tle {
  padding: 3px 0 0 0;
}
.ght_listn ul li .u_cen {
  position: relative;
  height: 200px;
}
.icon_lig {
  font-size: 15px; /*color: #941413;*/
  position: absolute;
  top: 16px;
  right: 23px; /*display: none;*/
}
.icon_lig img {
  vertical-align: -2px;
}
.ght_listn ul li .u_cen .u_acr {
  height: 200px;
}
.ght_listn ul li .u_cen {
  height: 200px;
  z-index: 100;
  background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat 39px 30px;
  color: #fff;
}
.ght_listn ul li .u_cen .tl_t {
  position: absolute;
  top: 82px;
  left: 81px;
  min-width: 60px;
}
.ght_listn ul li .u_cen .numb_t {
  position: absolute;
  width: 50px;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 20px;
  line-height: 28px;
  text-align: left;
}
.ght_listn ul li .u_cen .tns_1 {
  top: 86px;
}
.ght_listn ul li .u_cen .tns_2 {
  top: 72px;
}
.ght_listn ul li .u_cen .tns_3 {
  top: 58px;
}
.ght_listn ul li .u_cen .tns_4 {
  top: 43px;
}
.ght_listn .fin_item {
  height: 700px;
  background: url(../../static/image/index/content_bg_6.png) no-repeat;
}
</style>
