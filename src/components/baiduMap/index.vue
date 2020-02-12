<template>
    <div class="map" :id="id">

    </div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
require('@/plugins/BMapLib_InfoBox.js')
export default {
    data(){
        return{
            id:'',
            map:null
        }
    },
    created(){
        this.id = uuidv1()
    },
    mounted(){
        this.$nextTick(() => {
            this.initMap()
        })
    },
    methods:{
        initMap(){
          this.map =  new BMap.Map(this.id)
	        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
          //添加地图类型控件
          var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
          var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
          this.map.addControl(top_left_control);        
		      this.map.addControl(top_left_navigation);   
	        this.map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
          this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
          this.map.setMapStyle({style:'midnight'});
          this.setInfoWindow()
        },
        setInfoWindow(){
          let html = `
            <div>
              <h5>展厅烟感</h5>
              <ul class="info-list">
                <li><span class='label'>告警时间 : </span>2020-02-12</li>
              </ul>
            </div>
          `
          var infoBox = new BMapLib.InfoBox(this.map,html,{boxStyle:{background:"rgba(16,44,87,0.78)",width: "369px",height:"165px",color:"white",border:"1px solid #AFE0FF",borderRadius:"10px"},enableAutoPan: true
          ,alignBottom: false});
          let point = new BMap.Point(116.404, 39.915)
          var marker = new BMap.Marker(point)
          this.map.addOverlay(marker)
          infoBox.open(marker)
        },
        setIcon(url,x = 32, y = 34){
          var myIcon = new BMap.Icon(url, new BMap.Size(x,y));
          return myIcon
        },
        /**
         * 给覆盖物设置label
         * @param {} marker 覆盖物
         * @param {type String} text 文字
         * @param {type Number} x 水平距离
         * @param {type Number} y 垂直距离
         */
        setLabel(marker,text,x=20,y=-20){
          let label = new BMap.Label(text,{offset:new BMap.Size(x,y)})
          label.setStyle({
            color:'#999999 ',
            borderColor:'white',
            padding:'0 10px',
          })
          marker.setLabel(label)
        },
        /**
         * 设置信息窗口
         * @param {String} content 信息窗口内容
         * @param {*}
         */
        openInfoWindow(content,point){
          let infoWindow = new BMap.InfoWindow(content,{
            height:0,
          })
          this.map.openInfoWindow(infoWindow,point)
        },
    }
}
</script>
<style lang="scss">
.map{
    width: 100%;
    height: 100%;
    .anchorBL{
      display:none;
    }
    .infoBox{
      h5{
        height:50px;
        line-height:50px;
        padding-left:25px;
        background:rgba(57,75,115,0.5);
        font-size:18px;
        color:#00D294;
      }
      .info-list{
        padding-left:10px;
        line-height:34px;
        font-size:16px;
        color:#F1F1F2;

      }
    } 
}
</style>
