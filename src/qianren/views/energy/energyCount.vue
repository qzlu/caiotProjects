<template>
    <div>
        <count title="能源统计" titleIcon="icon-Energymanagement" @nodeClick='handleClick' @typeChange='selectDateType' @timeChange ='slectTime'>
            <div class="total-count">
                <div class="total-count-left count-box-bg">
                    <h5>总能耗（kwh）</h5>
                    <div class="content">
                        <div class="current">
                            <p class="label">{{typeList[type].current}}</p>
                            <p class="value" :title="count.EnergyValue&&count.EnergyValue.toFixed(0)">{{count.EnergyValue&&count.EnergyValue.toFixed(0)}}</p>
                        </div>
                        <div class="pre">
                            <p class="label">{{typeList[type].pre}}</p>
                            <p class="value">{{count.UpperEnergyValue&&count.UpperEnergyValue.toFixed(0)}}</p>
                        </div>
                    </div>
                </div>
                <div class="total-count-right count-box-bg">
                    <h5 class="l">能耗统计</h5>
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
                <h5 class="l">分项能耗统计<p>(kwh)</p></h5>
                <div class="bar-chart">
                    <bar-chart 
                    :data='itemDataCount' 
                    lableRotate='0'
                    :grid = 'grid'>
                    </bar-chart>
                </div>
            </div>
            <div class="count-ranking count-box-bg">
                <h5 class="l">
                    能耗总量项目排名
                    <p>TOP10</p>
                </h5>
                <div class="bar-chart">
                    <bar-chart 
                    :data='energyTop10' 
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
                    pre:'昨日',
                    current:'今日',
                    sliceIndex:10,
                    func:() => formatDate(this.time,'YYYY-MM-DD')
                },
                {
                    pre:'上月',
                    current:'本月',
                    sliceIndex:8,
                    func:() => formatDate(this.time,'YYYY-MM')
                },
                {
                    pre:'上年',
                    current:'今年',
                    sliceIndex:0,
                    func:() => formatDate(this.time,'YYYY')
                }
            ],
            count:{},
            systemTypeCount:{

            },
            itemDataCount:{

            },
            energyTop10:{

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
    created(){
    },
    methods:{
        /**
         * 查询能耗统计
         */
        queryData(){
            let time = this.typeList[this.type].func()
            let parm = {
                IDStr:this.currentNode?this.currentNode.ProjectStr:'',
                FDateTime:time
            }
            this.queryProjectEnergyData(parm)
            this.queryProjectEnergyItemData(parm)
            this.queryProjectEnergyDataInfo(parm)
        },
        queryProjectEnergyData(parm){
            this.$post('/QueryProjectEnergyData',parm)
            .then((result) => {
                console.log(result);
                this.count = result.FObject
                let type = this.typeList[this.type]
                if(!this.count.EnergyValueList){
                    this.systemTypeCount = {
                        columns:[],
                        rows:[]
                    }
                    return
                }
                let columns = this.count.EnergyValueList.length>this.count.UpperEnergyValueList?this.count.EnergyValueList:this.count.UpperEnergyValueList
                this.systemTypeCount = {
                    columns:columns.map(item => item.CollectTime.slice(type.sliceIndex)),
                    rows:[
                        {
                            name:type.current,
                            type:'line',
                            barWidth:32,
                            data:this.count.EnergyValueList.map(item => item.EnergyValue),
                        },{
                            name:type.pre,
                            type:'line',
                            barWidth:32,
                            data:this.count.UpperEnergyValueList.map(item => item.EnergyValue)
                        }
                    ],
                    colorsArr:["#18DE94","#2A91FC"]
                }
                console.log(this.systemTypeCount);
            }).catch((err) => {
                console.log(err);
            });
        },
        queryProjectEnergyItemData(parm){
            this.$post('/QueryProjectEnergyItemData',parm)
            .then((result) => {
                let data = result.FObject
                let type = this.typeList[this.type] 
                this.itemDataCount = {
                    columns:data.map(item => item.CountName),
                    rows:[
                        {
                            name:type.current,
                            type:'bar',
                            barWidth:32,
                            data:data.map(item => item.EnergyValue),
                        },{
                            name:type.pre,
                            type:'bar',
                            barWidth:32,
                            data:data.map(item => item.UpperEnergyValue),
                        }
                    ],
                    colorsArr:["#18DE94","#2A91FC"]
                }
            }).catch((err) => {
                
            });
        },
        queryProjectEnergyDataInfo(parm){
            this.$post('/QueryProjectEnergyDataInfo',parm)
            .then((result) => {
                let data = result.FObject||[]
                this.energyTop10 = {
                    columns:data.map(item => item.ProjectName),
                    rows:[{
                        type:'bar',
                        barWidth:32,
                        data:data.map(item => item.EnergyValue)
                    }]
                }
            }).catch((err) => {
                
            });
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