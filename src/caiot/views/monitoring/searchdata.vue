<template>
    <div class="report search-data">
        <div class='l device-tree'>
            <h3>设备列表</h3>
            <div class="device-container">
                <el-scrollbar>
                    <el-tree
                        :data='deviceData'
                        :props="defaultProps"
                        @node-click='handleClick'
                    >
                    <span slot-scope="{ node, data }">
                        <i class='icon iconfont' :class="data.IconName"></i>
                        <span style="font-size:18px">{{data.DeviceTypeName?data.DeviceTypeName:data.DeviceName}}</span>
                    </span>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-item-header">
                <span><img src="../../static/image/indexdetail/device-data.png"/>实时参数</span>
            </div>
            <div class="main-item">
                <el-table
                    :data='tableData'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                    @row-click = 'rowClick'
                >
                    <el-table-column
                      prop="title"
                      label="参数名称">
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      label="值">
                    </el-table-column>
                </el-table>
            </div>
            <div class="main-item-header">
                <span>时间</span>
                <el-date-picker
                  v-model="time"
                  type="date"
                  @change="changeTime"
                  placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="main-item">
                <div class="date-chart" id="date-chart">
                    <line-chart :data="chartData" :color='["#FF3600", "#00D1D9", "#FF7300"]'></line-chart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Monitor, system} from '@/caiot/request/api'
import table from '@/caiot/mixins/table' //表格混入数据
import {lineChart} from '@/caiot/zw-components/index';
export default {
    mixins:[table],
    data(){
        return{
            deviceData:[],//设备列表
            defaultProps:{
                children:'DeviceTypes'
            },
            deviceID:null,
            time:new Date(),
            rowItem:null,
            chartData:{}
        }
    },
    components:{
        lineChart
    },
    created(){
        this.queryCaiotDeviceToTree()
    },
    mounted(){
        
    },
    methods:{
        /**
         * 169.获取所有设备
         */
        queryCaiotDeviceToTree(){
            system({
                FAction:'QueryCaiotDeviceToTree'
            })
            .then((data) => {
                this.deviceData = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 获取重点监测设备
         */
        queryMonitorDataByDeviceID(id){
            Monitor({
                FAction:'QueryMonitorDataByDeviceID',
                DeviceID:id
            })
            .then((data) => {
                let obj = data.FObject
                this.tableData = obj.DataDetail.map(item => {
                    item.SDataValue = item.SDataValue.map( element => element.DValue)
                    return {
                        DeviceID:obj.DeviceID,
                        title:item.SDataTitle + ' (' + item.SDataUnit + ')',
                        value:item.SDataValue.join('/'),
                        SDataID:item.SDataID
                    }
                })
                this.rowItem = this.tableData[0]
                this.queryDataItemChartDataByDeviceID(this.tableData[0].SDataID)
            })
            .catch((err) => {
                console.log(err);
            });
        },
        /**
         * 171.获取单个设备指定日期5分钟曲线数据
         */
        queryDataItemChartDataByDeviceID(pid){
            Monitor({
                FAction:'QueryDataItemChartDataByDeviceID',
                DeviceID:this.deviceID,
                PossionID:pid,
                FDateTime:this.time.toLocaleDateString().replace(/\//ig,'-')
            })
            .then(data => {
                let chartData = {
                    name:[],
                    columns:[],
                    rows:{}
                },
                arr = data.FObject
                chartData.name = arr.map(item => item.DataItemName)
                chartData.columns = arr[0].ProjectChartLineDatas.map(item => item.X)
                chartData.rows = arr.map(item => {
                    let yAxis = item.ProjectChartLineDatas.map(obj => obj.Y)
                    return {
                      type: "line",
                      name: item.DataItemName,
                      data: yAxis
                    };
                })
                this.chartData = chartData
            })
            .catch(err => {
                console.log(err);
            })
        },
        handleClick(node){
            if(node.DeviceID){
                this.deviceID = node.DeviceID
                this.queryMonitorDataByDeviceID(node.DeviceID)
            }
        },
        rowClick(row){
            this.rowItem = row
            this.queryDataItemChartDataByDeviceID(row.SDataID)

        },
        changeTime(val){
            this.queryDataItemChartDataByDeviceID(this.rowItem.SDataID)
        },
    }
}
</script>
<style lang="scss">
$img-url:'../../static/image/';
.report.search-data{
    padding: 34px 20px;
    color: #F1F1F2;
    .device-tree{
        width:333px;
        height:850px;
        border:2px solid #134FA4;
        border-radius:10px 6px 6px 10px;
        h3{
            margin-top: 42px;
            padding-left:30px;
            text-align: left;
            font-size: 20px;
            color: #18A1EC
        }
        .device-container{
            margin-top: 36px;
            .el-scrollbar{
                 height: 746px;
                 .el-scrollbar__wrap{
                    overflow-x: hidden
                 }
            }
            .el-tree{
                background: none;
                color: #18A1EC;
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                    }
                }
                &-node__content{
                    height: 66px;
                    line-height: 66px;
                    .iconfont{
                        vertical-align: middle;
                        font-size: 24px
                    }
                }
                &-node__content:hover {
                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                }
                .el-tree-node__label{
                    font-size: 18px;
                }
                .el-tree-node__expand-icon{
                    font-size: 20px;
                }
            }
            .el-tree.checked {
                color: #a0a0a3;
            }
        }
    }
    .main{
        margin-left: 337px;
        height: 100%;
        &-item-header{
            height: 55px;
            line-height: 55px;
            text-align: left;
            padding-left: 51px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            span{
                color: #18A1EC;
                font-size: 16px;
                img{
                    vertical-align: middle;
                    margin-right: 10px;
                }
                margin-right: 30px;
            }
            .import{
                width: 148px;
                padding-left: 30px;
                background: url(#{$img-url}task/import.png)
            }
            .import:hover,.import:active{
                background: url(#{$img-url}task/import-1.png)
            }
            .el-date-editor.el-input{
                height: 46px;
                .el-input__inner{
                    background: #042E74;
                    border:1px solid rgba(12,55,110,1);
                }
            }
        }
        &-item{
            padding: 0 30px;
            .date-chart{
                width:1073px;
                height:301px;
                opacity:0.59;
                border:1px solid rgba(4,44,113,1);
                border-radius:10px 6px 6px 10px;
                margin: 28px auto;
            }
        }
    }

}
</style>
