<template>
    <div class="zw-table" :style="style">
        <div class="title" v-if="icon">
          <i :class="['iconfont',icon]"></i>
          {{title}}
          <span v-if="showMore" @click="show()">
              more <i class="iconfont icon-Up"></i>
          </span>
        </div>
        <slot v-else name="title"></slot>
        <table class="table-header">
          <tr>
            <th v-for="(item,i) in labels" :key="i" :width='item.width' :style="{'text-align':item.align}">{{item.label}}</th>
            <th v-if="showOperation">操作</th>
          </tr>
        </table>
        <div class="table-body" v-if="data.length>0" :style="style1">
            <el-scrollbar>
                <table>
                  <tr v-for="(obj,i) in data" :key="i" @click="rowClick(obj)">
                    <td v-for="(item,j) in labels" :key="j" :width='item["width"]' :style="{'text-align':item.align,'color':item.color}" :title="item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]">{{item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]}}</td>
                    <td v-if="showOperation" style="color:#60e5f7"><span @click="misreport(obj)">误报</span> <span style="margin-left:20px">派单</span></td>
                  </tr>
                </table>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
import uuidv1 from 'uuid/v1'
export default {
    data(){
        return{
            id:'',
        }
    },
    components:{
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
        showMore:{
            type:Boolean,
            default:false
        },
        width:Number,
        bodyHeight:Number,
        showOperation:{
            type:Boolean,
            default:false
        },
        pageSize:{
            default:4,
            type:Number
        } // 显示数量
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
        },
        swiperOption(){
            return {
                init:false,
/*                 autoplay: {
                    disableOnInteraction: false,
                }, */
                direction : 'vertical',
                speed:300,
                loop:true,
                slidesPerView: this.$props.pageSize,
                slidesPerGroup : this.$props.pageSize,
               /*  loopedSlides: 6 */
            }
        }
    },
    watch:{
/*         data(value){
            this.$nextTick(() =>{
                if(this.$props.data.length>0){
                    this.swiper.init()
                }
            })
        } */
    },
    updated(){
    },
    created(){
        this.id = uuidv1() //获取随机id
    },
    beforeDestroy(){
        /* this.swiper.destroy() */
    },
    methods:{
        show(){
            this.$emit('click')
        },
        enter(){
            this.swiper.autoplay.stop()
        },
        leave(){
            this.swiper.autoplay.start()
        },
        /**
         * 
         */
        rowClick(row){
            this.$emit('rowClick',row)
        },
        /**
         * 误报
         */
        misreport(row){
            this.$emit('misreport',row)
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
        span{
            cursor: pointer;
            line-height: 30px;
            margin-left: 20px;
            font-size: 16px;
            opacity: 0.64;
            .icon-Up{
                display: inline-block;
                vertical-align: middle;
                font-size: 22px;
                transform: rotate(90deg)
            }
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
            text-align: left;
        }
    }
/*     .table-body{
        .tr{
            width: 100%;
            line-height: 42px;
            .td{
                height: 100%;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .tr:nth-of-type(2n+1){
            background:rgba(158,229,243,0.2);
        }
        .tr:nth-of-type(2n){
            background:rgba(7,148,207,0.14);
        }
    } */
    .table-body{
          table{
              width: 100%;
              tr{
                line-height: 42px;
                cursor: pointer;
                text-align: left;
                td{
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                td.warning{
                    color: #E0E213
                }
              }
              tr:nth-of-type(2n+1){
                  background:rgba(158,229,243,0.2);
              }
              tr:nth-of-type(2n){
                  background:rgba(7,148,207,0.14);
              }
          }
    }

}
</style>
