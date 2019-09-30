<template>
    <div class="log">
        <div class="report-header">
            <li class="l">
                <el-radio-group v-model="timeType">
                  <el-radio-button label="date">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
            </li>
            <li class="l">
                <span class="label">时间　</span>
                <el-date-picker
                 v-model="time1"
                 :type="timeType"
                >
                </el-date-picker>
            </li>
<!--             <li class="l">
                <button class="zw-btn zw-btn-export">导出</button>
            </li> -->
        </div>
        <div class="header clearfix">
            <div class="l">
                <img src="static/image/nav_new/nav_icon_3.png" alt="">
                <span>{{timeText[timeType][0]}}使用率</span>
            </div>
            <div class="l" style="margin-left:27%">
                <img src="static/image/count/icon_3.png" alt="">
                <span>启停记录</span>
            </div>
        </div>
        <div class="log-content">
            <div class="l circle">
                <div class="chart">
                    <pie-chart :data="chartData" :color='["#00D294", "#89192E"]' :setting="{legend:{x:'230px'}}"></pie-chart>
                </div>
            </div>
            <div class="l table">
                <el-table
                   :data="tableData"
                   style="width: 100%"
                   :height="300"
                   header-row-class-name="el-table-header"
                   :row-class-name="tableRowClassName"
                   >
                   <el-table-column
                     v-for="item in tableLabel"
                     :key="item.prop"
                     :prop="item.prop"
                     :label="item.label"
                     :sortable="item.sortble"
                     show-overflow-tooltip
                    >
                   </el-table-column>
                   <el-table-column
                     prop=""
                     label="查看">
                     <template slot-scope="scoped">
                         <div class="role-operation">
                            <span class="pointer" @click="queryDetail(scoped.row)">记录</span>
                         </div>
                     </template>
                   </el-table-column>
                </el-table>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import queryRecord from '@/caiot/mixins/queryRecord.js'
import {pieChart} from '@/caiot/zw-components/index'
import {Device} from '@/caiot/request/api.js';
export default {
    mixins:[table,queryRecord],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop:'StartDateTime',
                    label:'启停时间'
                },
                {
                    prop: 'FStateName',
                    label: '启停状态',
                },
                {
                    prop: 'FLongTime',
                    label: '运行时长'
                },
                {
                    prop: 'EndOrderDateTime',
                    label: '备注'
                },
            ],
            timeType:'date',
            timeText:{
                date:['日','Day'],
                month:['月','Month'],
                year:['年','Year']
            },
            time1:new Date(),
            chartData:{
                columns:['运行','停止'],
                rows:[{name:'运行',value:10},{name:'停止',value:2}]
            }
        }
    },
    components:{
      pieChart
    },
    created(){
        this.queryDeviceRunngStopRecord()
    },
    methods:{
        /**
         * 237.查询设备启停日志
         */
        queryDeviceRunngStopRecord(){
            Device({
                FAction:'QueryDeviceRunngStopRecord',
                DeviceID:this.$props.deviceID,
                FType:this.timeText[this.timeType][1],
                FDateTime:this.time1.toLocaleDateString(),
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].Count : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang="scss">
    .log{
        .report-header{
            height: 100px;
            line-height: 100px;
            padding-left: 40px;
        }
        .header{
            height:55px;
            line-height: 55px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            text-align: left;
            padding-left: 50px;
            box-sizing: border-box;
            >div{
                height: 100%;
            }
            img{
                width:30px;
                height:25px;
                vertical-align: middle;
            }
            span{
                font-size:16px;
                font-family:MicrosoftYaHeiUI;
                font-weight:400;
                color:#18A1EC;
            }
        }
        .log-content{
            height: 330px;
            .circle{
                width: 27%;
                height: 100%;
                .chart{
                    width: 305px;
                    height: 183px;
                    margin: 50px auto;
                    position: relative;
                    background: url(../../static/image/index/leftbar_bg_circle.png) no-repeat 80px 20px;
                }
            }
            .table{
                width: 73%;
                height: 100%;
            }
        }
    }
</style>
