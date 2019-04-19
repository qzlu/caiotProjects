<template>
    <div class="zw-card" :style="style">
        <div class="left-top-corner corner" :style="style2">
        </div>
        <div class="right-top-corner corner" :style="style2">
        </div>
        <div class="right-bottom-corner corner" :style="style2">
        </div>
        <div class="left-bottom-corner corner" :style="style2">
        </div>
        <h3 class="title" v-if="title">
          <div class="bg" :style="style1"></div>
          <span>{{title}}</span>
        </h3>
        <slot>
        </slot>
    </div>
</template>
<script>
export default {
    data(){
      return{

      }
    },
    props:{
        width:Number,
        height:Number,
        title:String,
        titleWidth:Number,
        titleHeight:{
          type:Number,
          default:34
        },
        cornerWidth:{
          type:Number,
          default:20
        },
        cornerHeight:{
          type:Number,
          default:20
        },
        borderWidth:{
          type:Number,
          default:3
        }
    },
    computed:{
      style(){
        return {
          width:`${this.$props.width}px`,
          height:`${this.$props.height}px`
        }
      },
      style1(){
        return {
          width: `${this.$props.titleWidth}px`,
          borderTop: `${this.$props.titleHeight}px solid #2A6DC6`,
          borderLeft: `${this.$props.titleHeight}px solid transparent`,
          borderRight: `${this.$props.titleHeight}px solid transparent`,
        }
      },
      style2(){
        return{
          width: `${this.$props.cornerWidth}px`,
          height: `${this.$props.cornerHeight}px`,
          borderWidth: `${this.$props.borderWidth}px`
        }
      }
    }
}
</script>
<style lang="scss">
.zw-card{
    position: relative;
    .corner{
      position: absolute;
      z-index: 10;
      border-color: #3995FE;
    }
    .left-top-corner{
      border-left-style: solid;
      border-top-style: solid;
      top: 0;
      left: 0;
    }
    .right-top-corner{
      border-right-style: solid;
      border-top-style: solid;
      top: 0;
      right: 0;
    }
    .right-bottom-corner{
      border-right-style: solid;
      border-bottom-style: solid;
      bottom: 0;
      right: 0;
    }
    .left-bottom-corner{
      border-left-style: solid;
      border-bottom-style: solid;
      bottom: 0;
      left: 0;
    }
    .title{
      height: 34px;
      position: relative;
      top: 2px;
      z-index: 2;
      .bg{
        height: 0;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
        margin: 0 auto;
      }
      span{
        position: relative;
        z-index: 10;
        font-size:20px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(158,229,243,1);
        line-height:32px;
      }
    }
}

</style>
