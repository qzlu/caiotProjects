<template>
    <div>
        <left-nav>
            <ul class="nav-left">
                <li><router-link to="/system/fireManage" ><span>火警记录</span></router-link></li>
                <li><router-link to="/system/fireManage/helpRecord" ><span>求助记录</span></router-link></li>
            </ul>
        </left-nav>
    </div>
</template>
<script>
import leftNav from '../leftNav.vue'
export default {
    data(){
        return{
        }
    },
    components:{
        leftNav
    },
    mounted() {
    },
}
</script>
<style lang="scss">
    .record{
        .el-dialog{
            .recod-list{
                li.l{
                    width: 50%;
                    box-sizing: border-box;
                }
                li{
                    margin-top: 40px;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    span.label{
                        display: inline-block;
                        width: 100px;
                        margin-right: 20px;
                        color: #9EE5F3;
                        text-align: right;
                    }
                }
                li.l.descripe{
                    width: 100%;
                    p{
                        width: 500px;
                        margin-left: 120px;
                        white-space: wrap;
                    }
                }
            }
        }
    }
</style>
