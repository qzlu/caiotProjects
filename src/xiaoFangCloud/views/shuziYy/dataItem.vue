<template>
    <div class="data-item">
        <div class="data-item-name">{{name}}</div>
        <div class='corner'>
            <div class="data-item-value">
                {{value}}
            </div>
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
        name:{
            type:String
        },
        value:{}
    }
}
</script>
<style lang='scss'>
.data-item{
    &-name{
        width:81px;
        height:24px;
        background:linear-gradient(0deg,rgba(40,117,204,1),rgba(41,118,204,1),rgba(15,79,128,1),rgba(14,79,128,1));
        border:1px solid rgba(57, 150, 255, 1);
        border-radius:4px 4px 0px 0px;
    }
    .corner {
        background: linear-gradient(to left, #3996FF, #3996FF) left top no-repeat, linear-gradient(to bottom, #3996FF, #3996FF) left top no-repeat, linear-gradient(to left, #3996FF, #3996FF) right top no-repeat, linear-gradient(to bottom, #3996FF, #3996FF) right top no-repeat, linear-gradient(to left, #3996FF, #3996FF) left bottom no-repeat, linear-gradient(to bottom, #3996FF, #3996FF) left bottom no-repeat, linear-gradient(to left, #3996FF, #3996FF) right bottom no-repeat, linear-gradient(to left, #3996FF, #3996FF) right bottom no-repeat;
        background-size: 3px 10px, 10px 3px, 3px 10px, 10px 3px;
    }
    &-value{
        width:119px;
        height:51px;
        line-height:51px;
        background:rgba(9,40,63,0.59);
        font-size:26px;
        color:#AEE4F0
    }
}
</style>