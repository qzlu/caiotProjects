<template>
    <div>
    <el-container>
        <el-aside width="300px">
            <left-side></left-side>
        </el-aside>
        <el-main>
          <h4 class="router-name">{{$route.meta.name}}</h4>
          <div class="main-content">
            <slot>
            </slot>
          </div>
        </el-main>
    </el-container>
    </div>
</template>
<script>
import leftSide from './leftSide.vue'
export default {
    data(){
        return{

        }
    },
    components:{
        leftSide
    },
}
</script>
<style lang="scss">
.el-container{
    height: 918px;
    .el-main{
        margin-left: 10px;
        box-shadow: inset 0 0 10px 4px rgba(48,104,209,.29);
        border-radius: 10px 6px 6px 10px;
        overflow: visible;
        h4{
            height: 46px;
            line-height:46px;
            text-align: left;
            font-size:20px;
            font-weight:400;
            color:rgba(42,145,252,1);
            border-bottom: 1px solid #3968AF;
        }
        .main-content{
            width: 100%;
            height: 830px;
            >div{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>