<template>
    <div class="monitor-data">
        <div class="monitor-data-item">
            <h5  @click="$router.push('/foreshow/')"><i class="iconfont icon-SZXFY-Earlywarning"></i> 实时告警 <i class="iconfont icon-Up"></i></h5>
            <div class="border">
            </div>
            <div class="icon">
            </div>
            <table class="table-header">
              <tr>
                <th v-for="(item,i) in alarmLabels" :key="i" :width='item.width' :style="{'text-align':item.align}">{{item.label}}</th>
              </tr>
            </table>
            <div class="table-body" v-if="alarmData.length>0">
                <el-scrollbar>
                    <table>
                      <tr v-for="(obj,i) in alarmData" :key="i" @click="rowClick(obj)">
                        <td v-for="(item,j) in alarmLabels" :key="j" :width='item["width"]' :style="{'text-align':item.align,'color':item.color}" :title="item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]">{{item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]}}</td>
                      </tr>
                    </table>
                </el-scrollbar>
            </div>
        </div>
        <div class="monitor-data-item">
            <h5 @click="$router.push('/TaskManagement/Worklist')"><i class="iconfont icon-Workingodd" ></i> 实时任务 <i class="iconfont icon-Up"></i></h5>
            <div class="border">
            </div>
            <div class="icon">
            </div>
            <table class="table-header">
              <tr>
                <th v-for="(item,i) in orderLabels" :key="i" :width='item.width' :style="{'text-align':item.align}">{{item.label}}</th>
              </tr>
            </table>
            <div class="table-body" v-if="orderData.length>0">
                <el-scrollbar v-loadmore="loadMore">
                    <table>
                      <tr v-for="(obj,i) in orderData" :key="i" @click="$router.push('/TaskManagement/Worklist')">
                        <td v-for="(item,j) in orderLabels" :key="j" :width='item["width"]' :style="{'text-align':item.align,'color':item.color}" :title="item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]">{{item.formatter?item.formatter.call(null,obj[item.prop]):obj[item.prop]}}</td>
                      </tr>
                    </table>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
const OrderState = ['','待完成', '已完成', '待接单', '待派单', '已逾期']
import {project,Orders} from '@/caiot/request/api.js'
import Card from './card.vue'
export default {
    data(){
        return{
            alarmLabels:[
                {
                    prop: 'AlarmTime',
                    label: '告警时间',
                    width: '25%'
                },
                {
                    prop: 'AlarmText',
                    label: '告警内容',
                    width: '25%'
                },
                {
                    prop: 'AlarmData',
                    label: '当前值',
                    width: '25%'
                },
                {
                    prop: 'OrderState',
                    label: '任务状态',
                    width: '25%',
                    formatter:val => OrderState[val]
                },
            ],
            orderLabels:[
                {
                    prop: 'OrderTypeName',
                    label: '任务类型',
                    width: '25%'
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '计划时间',
                    width: '25%'
                },
                {
                    prop: 'OrderContent',
                    label: '任务内容',
                    width: '25%'
                },
                {
                    prop: 'OrderState',
                    label: '任务状态',
                    width: '25%',
                    formatter:val => OrderState[val]
                },
            ],
            alarmData:[],//实时告警数据
            orderData:[], //实时任务数据
            timer:null,
            pageIndex:1
        }
    },
    components:{
        Card
    },
    created(){
        this.queryData()
    },
    beforeDestroy(){
        this.timer&&clearTimeout(this.timer)
        this.timer = null
    },
    methods:{
        queryData(){
            this.pageIndex = 1
            this.getAlarmRealData()
            this.queryPageUOrdersByDate()
            this.timer = setTimeout(this.queryData,10000)
        },
        /**
         * 7.获取项目实时未恢复告警
         */
        getAlarmRealData(){
            project({
                FAction: 'GetAlarmRealData'
            })
            .then((result) => {
                this.alarmData = result.FObject||[]
                this.$emit('alarmChange',this.alarmData.length)
            }).catch((err) => {
                
            });
        },
        loadMore(){
            this.pageIndex++
            this.queryPageUOrdersByDate(true)
        },
        /**
         * 实时任务
         */
        queryPageUOrdersByDate(scroll = false){
            Orders({
                FAction: 'QueryPageUOrdersByDate',
                FState: -1,
                PageIndex:this.pageIndex,
                PageSize: 20
            })
            .then((result) => {
                if(scroll){
                    if(!result.FObject.length){
                      this.pageIndex1 --
                    }else{
                        this.orderData.push(...result.FObject)
                    }
                }else{
                    this.orderData = result.FObject
                }
                /* this.$emit('orderChange',this.orderData.length) */
            }).catch((err) => {
                
            });
        },
        rowClick(){
            this.$router.push('/foreshow/')
        }

    }
}
</script>
<style lang="scss">
.monitor-data{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    &-item{
        width: 590px;
        height: 100%;
        border-radius: 10px;
        background: rgba($color: #112D45, $alpha: 0.34);
        h5{
            padding-left: 30px;
            line-height: 38px;
            /* color: #18A1EC; */
            cursor: pointer;
            font-size: 16px;
            text-align: left;
            .iconfont:first-of-type{
                font-size: 20px;
                margin-right: 10px;
            }
            .icon-Up{
                margin-left: 10px;
                display: inline-block;
                transform: rotate(90deg);
            }
        }
        .border{
            height: 1px;
            margin: 0px 25px 0 13px;
            background: #07A6FF;
        }
        .icon{
            width: 100px;
            height: 6px;
            margin-left:13px;
            position: relative;
            background: #07A6FF;
        }
        .icon:after{
            display: block;
            width: 0px;
            height: 0px;
            position: absolute;
            right: -6px;
            border: 3px solid transparent;
            border-top-color: #07A6FF;
            border-left-color: #07A6FF;
            content: ""
        }
        .table-header{
            width: 100%;
            tr{
                th{
                    font-size: 16px;
                }
            }
        }
        tr{
            height: 38px;
            line-height: 38px;
            th{
                font-size: 14px;
                text-align: center;
                color: #F1F1F2
            }
        }
        .table-body{
            height: 200px;
            table{
                width: 100%;
                tr{
                    line-height: 38px;
                    cursor: pointer;
                    text-align: center;
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
                    background:rgba(19,79,164,0.5);
                }
                tr:nth-of-type(2n){
                    background:rgba(5,48,119,0.5);
                }
              }
        }
    }
}
</style>