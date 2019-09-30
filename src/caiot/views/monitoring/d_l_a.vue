<template>
  <div class="dl_a">
    <div class="pr_top">
      <p class="pr_title" v-if="showTitle">
        <img src="../../static/image/indexdetail/content_icon_2.png"> 大事记
      </p>

      <section class="pr_are">
        <ul class="clearfix">
          <li class="first ">
            <div class="imtems">
              <p>
                {{t}}
              </p>
            </div>
						<div class="step-border"></div>
            <!--2018-->
          </li>
          <li v-for="(items,key) in data" :class="{'d':key%2!=0}">
            <h2>
              {{items[props.title]}}
              <!--报废-->
            </h2>
            <p class="gt">
              {{items[props.time]}}
              <!--2017.6.12 22:23-->
            </p>
            <div class="imtems">
              <p>
                <i class="icon iconfont" :class="items[props.icon]" style="font-size: 30px;"></i>
                <!--<img src="/static/image/indexdetail/avb.png">-->
              </p>
            </div>
						<div class="step-border"></div>
            <div class="step-arrow">
              <div class="step-arrow-circle"></div>
              <div class="step-arrow-border"></div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<style>
</style>
<script>
export default {
  data() {
    return {
      t: ""
    };
  },
  props:{
    data:Array,
    showTitle:{
      default:true
    },
    props:{
      default:() =>{return{
        title:'HappenContext',
        time:'HappenTime',
        icon:'WebIconName',
      }}
    }
  },
  created() {
    var myDate = new Date();
    this.t = myDate.getFullYear();
  },
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
.pr_top {
  height: 290px;
  /* background: url(/static/image/indexdetail/content_img.png) no-repeat 22px 51px; */
  margin: 10px 30px 10px 30px;
}
.pr_top .pr_title {
  text-align: left;
  font-size: 20px;
  color: #18a1ec;
}
.pr_top .pr_title img {
  vertical-align: -5px;
}
.pr_top .pr_are {
	height: 260px;
}
.pr_top .pr_are	ul{
		height: 100%;
		white-space: nowrap;
    overflow-y:hidden;
    text-align: left;
    padding-left:30px;
}
.pr_top .pr_are ul li {
  position: relative;
  width: 170px;
  height: 250px;
  display: inline-block;
  color: #f1f1f2;
  /* background: url(/static/image/indexdetail/content_circle_1.png) 39px 20px
		no-repeat; */
		white-space:normal;
}
.pr_top .pr_are ul li.first {
  background: none;
  font-size: 24px;
	line-height: 230px;
}
.pr_top .pr_are ul li.first .imtems{
	width:94px;
	height: 94px;
	top: 74px
}
.pr_top .pr_are ul li .step-border{
	position: absolute;
	width:104px;
	height: 5px;
	background: #1876d8;
  top: 120px;
  left: 118px;
  z-index: 2;
}
.pr_top .pr_are ul li.first .step-border{
	width:96px;
  left: 146px;
}
.pr_top .pr_are ul li:last-of-type .step-border{
	display:none
}
.pr_top .pr_are ul li .step-arrow{
  width:8px;
  height: 100%;
  margin:30px auto;
}
.pr_top .pr_are ul li .step-arrow-circle{
  width:8px;
  height: 8px;
  border-radius:50%;
  background:#287fe4;
  position: absolute;
}
.pr_top .pr_are ul li .step-arrow-border{
  width: 2px;
  height: 61px;
  background:#287fe4;
  position: relative;
  left:3px;
}
.pr_top .pr_are ul li:nth-of-type(2n+1) .step-arrow{
  transform:rotate(180deg);
  transform-origin: 0 50%;
  margin-top: -32px;
  margin-left: 88px;
}
.pr_top .pr_are ul li h2 {
  font-size: 20px;
  color: #2a91fc;
  position: absolute;
  top: 0px;
  left: 0;
  width: 170px;
  white-space: nowrap;
  text-align:center;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pr_top .pr_are ul li .gt {
  width: 100px;
  height: 30px;
  position: absolute;
  top: 32px;
  left: -7px;
  font-size: 14px;
  color: #f1f1f2;
}
.pr_top .pr_are ul li .imtems {
  width: 66px;
  height: 66px;
  position: absolute;
  top: 91px;
  left: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
	align-content: center;
	background:#1876d8;
	border-radius:50%;
	box-shadow:0 0 0 8px #0e4e97,0 0 0 16px #043267;
}
.pr_top .pr_are ul li.d {
  /* background: url(/static/image/indexdetail/content_circle_2.png) 38px 71px
    no-repeat; */
}
.pr_top .pr_are ul li.d h2 {
  top: 224px;
}
.pr_top .pr_are ul li.d .gt {
  top: 182px;
}
.pr_top .pr_are ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.pr_top .pr_are ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px #1752ba;
  background: #c1c1c1;
}
.pr_top .pr_are ul::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px #1752ba;
  border-radius: 10px;
}
</style>