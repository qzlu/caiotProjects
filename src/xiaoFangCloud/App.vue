<template>
  <div id="app" :style="style">
    <transition name="fade" mode="out-in" appear>
      <router-view/>
    </transition>
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
    let project = JSON.parse(sessionStorage.getItem('project'))
    if(this.$store.state.token != ''&&sessionStorage.getItem('FToken')){
      this.$store.state.token = sessionStorage.getItem('FToken')
      this.$store.state.projectId = sessionStorage.getItem('projectId')
      this.$store.state.FContacts =sessionStorage.getItem('FContacts')
      this.$store.state.userType =project.FType
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
