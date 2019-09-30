<template>
    <div class="report">
        <ul class="report-header clearfix">
            <li class="l">
                <span class="label" style="font-size:14px;">时间　</span>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  @change="queryData()"
                  placeholder="选择日期"
                ></el-date-picker>
            </li>
            <li class="l">
                <button class="zw-btn zw-btn-export" @click="exportFile">导出</button>
            </li>
            <li class="l">
               <!--  <button class="zw-btn zw-btn-report">报事月报</button> -->
            </li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div>
            <el-table
               :data="tableData"
               style="width: 100%"
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
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
        <!-- 告警记录 -->
        <el-dialog class="report-dialog"  :visible.sync="show">
            <div class="export-container"><button class="zw-btn export " @click="exportRecord"><i class="iconfont icon-Export"></i>导出</button></div>
            <div id='record'>
                <h4>告警记录</h4>
                <div class="clearfix project-name"><p class="l">项目名称: {{projectName}}</p><p class="r">时间:{{time[0].toLocaleDateString() + '至' + time[1].toLocaleDateString()}}</p></div>
                <ul class="clearfix report-info" >
                    <li class="l">告警设备<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].DeviceName}}</span></li>
                    <li class="l">告警时间<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].AlarmTime}}</span></li>
                    <li class="l">告警等级<span v-if="recordsInfo.Table">{{alarmLevel[recordsInfo.Table[0].AlarmLevel]}}</span></li>
                    <li class="l">处理时间<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].RunningOrderDateTime}}</span></li>
                    <li class="l">告警名称<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].RunningOrderDateTime}}</span></li>
                </ul>
                <div class="maintenance-img" v-if="recordsInfo.Table&&recordsInfo.Table[0].HandlingEventsBeforeImg">
                    <h5>处理前</h5>
                    <ul class="clearfix">
                        <li class="l" v-for="img in recordsInfo.Table[0].HandlingEventsBeforeImg.split(',')">
                            <img :src="'http://www.szqianren.com/'+img" alt="">
                        </li>
                    </ul>
                </div>
                <div class="maintenance-img" v-if="recordsInfo.Table&&recordsInfo.Table[0].HandlingEventsAfterImg">
                    <h5>处理后</h5>
                    <ul class="clearfix">
                        <li class="l" v-for="img in recordsInfo.Table[0].HandlingEventsAfterImg.split(',')">
                            <img :src="'http://www.szqianren.com/'+img" alt="">
                        </li>
                    </ul>
                </div>
                <div class="maintenance-img" v-if="recordsInfo.Table">
                    <h5>处理结果</h5>
                    <p style="text-align:left;padding-left:20px">{{recordsInfo.Table[0].HandlingEventsAfterDescription}}</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import { Orders, HandlingEvents } from '@/caiot/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop:'OrderContent',
                    label:'告警名称'
                },
                {
                    prop: 'OrderCreateDateTime',
                    label: '告警时间',
                    sortble:'custom'
                },
                {
                    prop: 'DeviceName',
                    label: '告警设备'
                },
                {
                    prop: 'AlarmLevelText',
                    label: '告警等级'
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '处理时间'
                },
                {
                    prop: 'FContacts',
                    label: '处理人'
                },
            ],
            projectName:localStorage.getItem('projectname'),
            time:[new Date(),new Date()],
            show:false,
            recordsInfo:[],
            alarmLevel:['','提示','一般','严重']
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
    },
    methods:{
        /**
         * 查询告警记录
         */
        queryData(){
            Orders({
                FAction:'QueryAlarmOrders',
                StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time[1].toLocaleDateString() + ' 23:59',
                Field:this.orderProp,
                FOrder:this.order,
                PageIndex:this.pageIndex,
                PageSize:10,
                SearchKey:this.filterText
            })
            .then((data) => {
                this.total = data.FObject.Table?data.FObject.Table[0].Count:0
                this.tableData = data.FObject.Table1?data.FObject.Table1:[]
                this.tableData.forEach(item => {
                    this.$set(item,'AlarmLevelText',this.alarmLevel[item.AlarmLevel])
                })  
            }).catch((err) => {
                
            });
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 查询告警记录详情
         * 
         */
        queryDetail(row){
            this.show = true
            HandlingEvents({
                FAction:'QueryUHandlingEventsRecordByOrdersID',
                ID:row.ID
            })
            .then(data => {
                this.recordsInfo = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 导出记录详情
         */
        exportRecord(){
            let fileName = this.recordsInfo.Table[0].DeviceName + '告警记录'
            this.getPdf('#record',fileName);
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Orders({
                FAction:'QueryExportAlarmOrders',
                StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time[1].toLocaleDateString() + ' 23:59',
                SearchKey:this.filterText
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '导出失败!请重试'
                });
            })
        },
    }
}
</script>
<style lang="scss">
@import 'record.scss';
</style>
