<template>
    <div id="container">
        <div id="map">

        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
        this.$nextTick(() => {
            this.initMap()
        })
    },
    methods:{
        initMap(){
            //初始化地图对象，加载地图
            var map = new AMap.Map("map", {resizeEnable: true});
            var lnglats = [
                [116.368904, 39.923423],
                [116.382122, 39.921176],
                [116.387271, 39.922501],
                [116.398258, 39.914600]
            ];
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            for (var i = 0, marker; i < lnglats.length; i++) {
                var marker = new AMap.Marker({
                    position: lnglats[i],
                    map: map
                });
                marker.content = '我是第' + (i + 1) + '个Marker';
                marker.on('click', markerClick);
                marker.emit('click', {target: marker});
            }
            function markerClick(e) {
                console.log(123)
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }
            map.setFitView();
        }
    }
}
</script>
<style lang="scss">
#container{
    height: 100%;
    width: 900px;
    /* transform: scale(1.1,1.1); */
    #map{
        width: 800px;
        height: 600px;
        // margin: 50px auto;
        position: absolute;
        left: 50px;

    }
}
</style>
