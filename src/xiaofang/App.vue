<template>
  <div id="app" :style="style">
<!--     <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
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
        transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ")",
        transformOrigin: "left top ",
        backgroundSize: "100%" + ' 100%',
      }
    }
  },
  created(){
    window.addEventListener('resize',this.getHeight)
    this.getHeight()
    if(this.$store.state.token != ''&&localStorage.getItem('FToken')){
      this.$store.state.token = localStorage.getItem('FToken')
    }
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
}
</style>
