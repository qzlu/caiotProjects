<template>
    <div class="map" :id="id">

    </div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
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
}
</style>
