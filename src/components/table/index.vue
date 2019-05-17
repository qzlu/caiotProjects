<template>
    <div class="zw-table" :style="style">
        <div class="title">
          <i :class="['iconfont',icon]"></i>
          {{title}}
        </div>
        <table class="table-header">
          <tr>
            <th v-for="(item,i) in labels" :key="i" :width='item.width'>{{item.label}}</th>
          </tr>
        </table>
        <div class="table-body" :style="style1">
            <el-scrollbar>
                <table>
                  <tr v-for="(obj,i) in data" :key="i">
                    <td v-for="(item,j) in labels" :key="j" :width='item["width"]'>{{obj[item.prop]}}</td>
                  </tr>
                </table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        data:{ //表格数据
            type:Array
        },
        labels:{ //表格项
            type:Array
        },
        title:String,
        icon:String,
        width:Number,
        bodyHeight:Number
    },
    computed:{
        style(){
            if(this.$props.width){
                return {width:this.$props.width+'px'}
            }else{
                return {width:'100%'}
            }
        },
        style1(){
            return {height:this.$props.bodyHeight+'px'}
        }
    }
}
</script>
<style lang="scss" scoped>
.zw-table{
    height: 100%;
    background: rgba($color: #0E1C43, $alpha: 0.62);
    border-radius: 6px;
    .title{
        text-align: left;
        padding:19px 0 10px 7px ;
        font-size: 18px;
        .iconfont{
            font-size: 24px;
        }
    }
    .table-header{
        width: 100%;
    }
    tr{
        height: 36px;
        line-height: 36px;
        th{
            font-size: 14px;
        }
    }
    .table-body{
          table{
              width: 100%;
              tr{
                  td.warning{
                      color: #E0E213
                  }
              }
              tr:nth-of-type(2n+1){
                  background:rgba(158,229,243,0.3);
              }
              tr:nth-of-type(2n){
                  background:rgba(7,148,207,0.3);
              }
          }
    }

}
</style>
