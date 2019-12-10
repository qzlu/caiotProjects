<template>
    <div>
        <count title="告警统计" titleIcon="icon-Numberofwarning" @nodeClick='handleClick' @typeChange='selectDateType' @timeChange ='slectTime'>
            <div class="total-count">
                <div class="total-count-left count-box-bg">
                    <h5>总告警（个）</h5>
                    <div class="content">
                        <pie-chart 
                         :data='totalCountData' 
                         :color='["#03cd82","#89192E"]'
                         :setting="{center:['212','72'],legend:{x:'300px'}}">
                        </pie-chart>
                        <div class="border-dashed">
                          <p class="title">总任务</p>
                          <p class="value">{{count.TotalCount}}</p>
                        </div>
                    </div>
                </div>
                <div class="total-count-right count-box-bg">
                    <h5 class="l">系统分类统计</h5>
                    <div class="bar-chart">
                        <bar-chart 
                        :data='systemTypeCount' 
                        lableRotate='0'
                        :grid = 'grid'
                        >

                        </bar-chart>
                    </div>
                </div>
            </div>
            <div class="count-item count-box-bg">
                <h5 class="l">告警类型统计</h5>
                <div class="bar-chart">
                    <bar-chart 
                    :data='alarmTypeCount' 
                    lableRotate='0'
                    :grid = 'grid'>
                    </bar-chart>
                </div>
            </div>
            <div class="count-ranking count-box-bg">
                <h5 class="l">
                    告警总数项目排名
                    <p>TOP10</p>
                </h5>
                <div class="bar-chart">
                    <bar-chart 
                    :data='alarmTop10' 
                    lableRotate='0'
                    :grid = 'grid'>
                    </bar-chart>
                </div>
            </div>
        </count>
    </div>
</template>
<script>
import count from '../component/count.vue'
import formatDate from '@/utils/formatDate.js'
import {pieChart,barChart} from '@/components/index.js'
export default {
    data(){
        return{
            currentNode:null,
            type:0,
            time:new Date(),
            grid:{
                top: "30",
                left: "10",
                right: "50",
                bottom: "10",
                containLabel: true
            },
            typeList:[
                {
                    func:() => formatDate(this.time,'YYYY-MM-DD')
                },
                {
                    func:() => formatDate(this.time,'YYYY-MM')
                },
                {
                    func:() => formatDate(this.time,'YYYY')
                }
            ],
            count:{},
            totalCountData:{
            },
            systemTypeCount:{

            },
            alarmTypeCount:{

            },
            alarmTop10:{

            }
        }
    },
    props:{
        projectList:Array,
    },
    components:{
        count,
        pieChart,
        barChart
    },
    beforeRouteEnter(to, from, next){
        console.log('进入前');
        next()
    },
    created(){
    },
    methods:{
        /**
         * 查询告警统计
         */
        queryData(){
            let time = this.typeList[this.type].func()
            this.$post('/QueryAlarmTotalCount',{
                IDStr:this.currentNode?this.currentNode.ProjectStr:'',
                FDateTime:time
            })
            .then((result) => {
                let {Table,Table1,Table2,Table3} = result.FObject
                if(Table&&Table[0]){
                    let count = Table[0]
                    this.count = count
                    this.totalCountData = {
                        columns:['已恢复','未恢复'],
                        rows:[
                            {
                                name:'已恢复',
                                value:count.AlreadyCount
                            },
                            {
                                name:'未恢复',
                                value:count.NotCount
                            }
                        ]
                    }
                }
                if(Table1){
                    this.systemTypeCount = this.formatBarData(Table1)
                }
                if(Table2){
                    this.alarmTypeCount = this.formatBarData(Table2,'AlarmTypeName')
                }
                if(Table3){
                    this.alarmTop10 = {
                        columns:Table3.map(item => item.ProjectName),
                        rows:[{
                            type:'bar',
                            barWidth:32,
                            data:Table3.map(item => item.ProjectAlarmCount)
                        }]
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        formatBarData(arr,name='SystemParamName'){
            return {
                columns:arr.map(item => item[name]),
                rows:[
                    {
                        name:"已恢复",
                        stack:'总数',
                        type:'bar',
                        barWidth:32,
                        data:arr.map(item => item.AlreadyCount),
                    },{
                        name:"未恢复",
                        stack:'总数',
                        type:'bar',
                        barWidth:32,
                        data:arr.map(item => item.NotCount),
                    }
                ],
                colorsArr:["#03cd82","#89192E"]
            }
        },
        selectDateType(type){
            this.type = type
        },
        slectTime(time){
            this.time = time
            this.queryData()
        },
        handleClick(node){
            this.currentNode = node
            this.queryData()
        }
    }
}
</script>