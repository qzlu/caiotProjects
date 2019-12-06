<template>
  <div id="app" :style="style">
   <!-- <img src="./assets/logo.png"> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      ratioHeigt:null,
      ratioWidth:null
    }
  },
  computed:{
    style(){
      return {
        transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ") ",
        transformOrigin: "left top ",
        backgroundSize: "100%" + ' 100%',
      }
    }
  },
  created(){
    window.addEventListener('resize',this.getHeight)
    this.getHeight()
  },
  methods:{
    getHeight(){
      this.ratioWidth = window.innerWidth/1920
      this.ratioHeigt=window.innerHeight/1080
    }
  }
}
</script>

<style>
body{
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}
#app {
  width: 1920px;
  height: 1080px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #F1F1F2;
  font-size: 12px;
  background: url(./static/image/index/bg_1.png);
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;

	
 
}




.l{ float: left;}
.r{ float: right;}




</style>
