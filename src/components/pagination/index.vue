<template>
    <div class="clearfix">
        <div class="zw-pagination">
            <el-pagination
             @current-change="handleCurrentChange"
             :page-size="pageSize"
             :pager-count="7"
             :current-page="pageIndex"
             layout="prev, pager, next"
             :total="total">
            </el-pagination>
            <span class="page-count">共{{Math.ceil(total/pageSize)}}页</span>
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
        pageIndex:{
            type:Number,
            default:1
        },
        pageSize:{
            default:10
        },
        total:{
            type:Number,
            required:true
        }
    },
    methods:{
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.$emit('pageIndexChange',val)
        }
    }
}
</script>
<style lang="scss">
@mixin style{
    color: #2A91FC;
    font-size: 18px;
    line-height: 30px;
}
.zw-pagination{
    text-align: left;
    position: absolute;
    bottom: 60px;
    .el-pagination{
        text-align: left;
        margin-top: 29px;
        background: none;
        float: left;
        button, button:disabled,.el-pager li{
            background: none
        }
        .el-pager li{
            @include style;
        }
        .el-pager li.active{
            color: #F1F1F2;
            font-size: 24px;
        }
    }
    .page-count{
        display: inline-block;
        margin-top: 29px;
        @include style;
    }
} 
</style>
