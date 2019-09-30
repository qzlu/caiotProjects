<template>
    <div class="clearfix" style="height:100%">
        <ul class="report-header clearfix" style="margin-top:15px;">
            <li class="l">
                <span class="label">保养等级　</span>
                <el-select v-model="level">
                    <el-option v-for=" item in maintenLevel" :key="item.value" :value="item.value" :label="item.name"></el-option>
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
            <li class="l" @click="queryData()"><button class="zw-btn"><i class="el-icon-search"></i>查询</button></li>
<!--             <li class="l">
                <button class="zw-btn zw-btn-export">导出</button>
            </li> -->
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
            <div id='record'>
                <h4>保养记录</h4>
                <div class="clearfix project-name"><p class="l">项目名称: {{projectName}}</p><p class="r">时间:{{time[0].toLocaleDateString() + '至' + time[1].toLocaleDateString()}}</p></div>
                <ul class="clearfix report-info" >
                    <li class="l">设备名称<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].DeviceName}}</span></li>
                    <li class="l">计划时间<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].MaintenanceDateTime}}</span></li>
                    <li class="l">保养等级<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].MaintenanceLevel}}</span></li>
                    <li class="l">保养时间<span v-if="recordsInfo.Table">{{recordsInfo.Table[0].MaintenanceDateTime}}</span></li>
                </ul>
                <div class="zw-table">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr class="table-header">
                        <td width="20%">序号</td>
                        <td width="80%">保养内容</td>
                      </tr>
                      <tr v-for="(item,key) in recordsInfo.Table1">
                        <td>{{key+1}}</td>
                        <td>{{item.MaintenanceDetail}}</td>
                      </tr>
                    </table>
                    <div class="descripe">
                        异常描述：{{recordsInfo.Table&&recordsInfo.Table[0].FDescription}}
                    </div>
                </div>
                <div class="use-info">
                    <h5>实际耗材</h5>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr class="table-header">
                        <td width="12.5%">序号</td>
                        <td width="12.5%">耗材名称</td>
                        <td width="12.5%">型号</td>
                        <td width="12.5%">单价（元）</td>
                        <td width="12.5%">单位</td>
                        <td width="12.5%">数量</td>
                        <td width="12.5%">耗材成本（元）</td>
                      </tr>
                      <tr v-for="(item,key) in recordsInfo.Table2" :class="{'odd-row':key%2==0}" :key="key">
                        <td>{{key+1}}</td>
                        <td>{{item.SuppliesName}}</td>
                        <td>{{item.SuppliesTypeName}}</td>
                        <td >{{item.SuppliesPrice}}</td>
                        <td>{{item.SuppliesUnit}}</td>
                        <td>{{item.SuppliesCount}}</td>
                        <td>{{item.SuppliesCost}}</td>
                      </tr>
                    </table>
                </div>
                <div class="maintenance-img" v-if="recordsInfo.Table3">
                    <h5>保养前</h5>
                    <ul class="clearfix">
                        <li class="l" v-for="img in recordsInfo.Table3">
                            <img :src="'http://www.szqianren.com/'+img.MaintenanceBeforeImg" alt="">
                        </li>
                    </ul>
                </div>
                <div class="maintenance-img" v-if="recordsInfo.Table4">
                    <h5>保养后</h5>
                    <ul class="clearfix">
                        <li class="l" v-for="img in recordsInfo.Table4">
                            <img :src="'http://www.szqianren.com/'+img.MaintenanceAfterImg" alt="">
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { Orders, HandlingEvents ,Device} from '@/caiot/request/api.js';
import table from '@/caiot/mixins/table' //表格混入数据
import queryRecord from '@/caiot/mixins/queryRecord.js'
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
                    prop: 'MaintenanceLevel',
                    label: '保养等级',
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '保养时间'
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
                    formatter: (row, column, cellValue, index) => OrderState[row.OrderState]
                },
            ],
            show:false,
            recordsInfo:[],
            maintenLevel:[
                {
                    value:0,
                    name:'全部'
                },
                {
                    value:1,
                    name:'一级保养'
                },
                {
                    value:2,
                    name:'二级保养'
                },
                {
                    value:3,
                    name:'三级保养'
                }
            ],
            type:2
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
            let fileName = this.recordsInfo.Table[0].ReportMatterObjectName + '报事记录'
            this.getPdf('#record',fileName);
        },
    }
}
</script>
<style lang="scss">
@import '../TaskManagement/record.scss';
</style>
