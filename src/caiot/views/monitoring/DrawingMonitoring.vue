<template>
    <div class="drawing-monitor" >
      <ul class="tab-header">
        <li :class="[{'active':activeIndex == i}]" v-for="(item,i) in  tabList" :key="i" @click="changeTab(i)">{{item}}</li>
      </ul>
      <div class="scard-system">
        <component :is="activeComponent" :style="style"></component>
      </div>
    </div>
</template>
<script>
import {AirConditioning,Power,Water} from '@/components/index.js'
export default {
    data(){
        return{
            ratioHeigt:null,
            ratioWidth:null,
            tabList:['中央空调','供配电','给排水'],
            activeIndex:0,
            componentList:{
              '0':AirConditioning,
              '1':Power,
              '2':Water
            }
        }
    },
    computed:{
      style(){
        return {
          width:`${1/this.ratioWidth*100}%`,
          height:`${1/this.ratioHeigt*100}%`,
          transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ") ",
          transformOrigin: "left top ",
        }
      },
      activeComponent(){
        return this.componentList[this.activeIndex]
      }
    },
    components:{
        AirConditioning
    },
    created(){
      window.addEventListener('resize',this.getHeight)
      this.getHeight()
      this.activeIndex = sessionStorage.getItem('activeIndex')||0
    },
    methods:{
      getHeight(){
        this.ratioWidth = 1920/window.innerWidth
        this.ratioHeigt=1080/window.innerHeight
      },
      changeTab(i){
        this.activeIndex = i
        sessionStorage.setItem('activeIndex',i)
      }
    }
}
</script>
<style lang="scss">
.drawing-monitor{
    height: 100%;
    position: relative;
    border:2px solid rgba(64,120,143,1);
    border-radius:10px 6px 6px 10px;
    overflow: hidden;
    .tab-header{
      width: 504px;
      margin: 0 auto;
      display: flex;
      overflow: hidden;
      li{
        width:168px;
        height:48px;
        line-height:48px;
        box-sizing: border-box;
        border:1px solid rgba(212, 208, 208, 0.63);
        color: #9EE5F3;
        font-size: 20px;
        cursor:pointer;
      }
      li:nth-of-type(2){
        border-left: none;
        border-right: none
      }
      li.active{
        background:linear-gradient(4deg,rgba(41,118,204,1),rgba(7,71,119,1));
      }
    }
    .scard-system{
      width: 100%;
      height: 864px;
    }
}
.scarda-system-dialog.el-dialog__wrapper{
  .el-dialog__header{
    background: linear-gradient(90deg,#105389,#092f52,#092f52,#05203c);
    .el-dialog__title{
      color: white;
      font-size: 22px;
    }
  }
  .el-dialog__body{
    background: #05203c;
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        width: 50%;
        height: 30px;
        padding-left: 10px;
        line-height: 30px;
        box-sizing: border-box;
        color: #2a91fc;
        font-size: 18px;
        .label{
          margin-right: 10px;
        }
        .value{
          color: #ed7961;
          margin-right: 4px;
        }
      }
    }
  }
} 
</style>