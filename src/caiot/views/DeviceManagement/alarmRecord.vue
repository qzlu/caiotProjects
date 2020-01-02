<template>
    <div class="clearfix" style="height:100%">
        <ul class="report-header clearfix" style="margin-top:15px;">
            <li class="l">
                <span class="label">告警级别　</span>
                <el-select v-model="level">
                    <el-option v-for=" item in alarmLevel" :key="item.value" :value="item.value" :label="item.name"></el-option>
                </el-select>
            </li>
            <li class="l">
                <span class="label" style="font-size:14px;">时间　</span>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  @change="queryData()"
                  placeholder="选择日期"
                ></el-date-picker>
            </li>
            <li class="l" @change="queryData()"><button class="zw-btn"><i class="el-icon-search"></i>查询</button></li>

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
               :height="350"
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
                 :formatter="item.formatter"
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
        <!-- 报事记录 -->
        <el-dialog class="report-dialog"  :visible.sync="show">
            <div class="export-container"><button class="zw-btn export " @click="exportRecord"><i class="iconfont icon-Export"></i>导出</button></div>
            <div id='record' style="width: 1150px;margin-left: -50px;padding: 0 50px;">
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
import { Orders, HandlingEvents ,Device} from '@/caiot/request/api.js';
import table from '@/caiot/mixins/table' //表格混入数据
import queryRecord from '@/caiot/mixins/queryRecord.js'
import '../TaskManagement/record.scss';
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
                    prop:'DeviceName',
                    label:'设备名称'
                },
                {
                    prop: 'AlarmLevel',
                    label: '告警等级',
                },
                {
                    prop: 'OrderContent',
                    label: '告警内容'
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '告警时间'
                },
                {
                    prop: 'EndOrderDateTime',
                    label: '完成时间'
                },
                {
                    prop: 'FContacts',
                    label: '处理人'
                },
                {
                    prop: 'OrderState',
                    label: '当前状态',
                    formatter:(row, column, cellValue, index) => OrderState[row.OrderState]
                },
            ],
            show:false,
            recordsInfo:[],
            alarmLevel:[
                {
                    value:0,
                    name:'全部'
                },
                {
                    value:1,
                    name:'提示'
                },
                {
                    value:2,
                    name:'一般'
                },
                {
                    value:3,
                    name:'严重'
                }
            ],
            type:5
        }
    },
    created(){
    },
    methods:{
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
    }
}
</script>
<style lang="scss">
</style>
