<template>
    <div class="report" >
        <!-- 保养记录月报 -->
        <el-dialog class="report-dialog" id="month-report" title="保养月报" :visible.sync="showMonthReport">
            <div class="export-container" style="position:relative"><button class="zw-btn export " @click="exportMonthReport"><i class="iconfont icon-Export"></i>导出</button></div>
            <div class="clearfix project-name"><p class="l">项目名称: {{projectName}}</p><p class="r">月份:{{time.getFullYear() + '-' + (time.getMonth()+1)}}</p></div>
            <ul class="clearfix report-info">
                <li class="l">保养次数<span v-if="monthReport.Table">{{monthReport.Table[0].MaintenanceCount}}</span></li>
                <li class="l">一级保养<span v-if="monthReport.Table">{{monthReport.Table[0].LevelFirstCount}}</span></li>
                <li class="l">二级保养<span v-if="monthReport.Table">{{monthReport.Table[0].LevelSecondCount}}</span></li>
                <li class="l">三级保养<span v-if="monthReport.Table">{{monthReport.Table[0].LevelThirdCount}}</span></li>
            </ul>
            <div class="zw-table">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr class="table-header">
                    <td width="12.5%">设备类型</td>
                    <td width="12.5%">保养次数</td>
                    <td width="12.5%">一级保养</td>
                    <td width="12.5%">二级保养</td>
                    <td width="12.5%">三级保养</td>
                    <td width="12.5%">耗材数量</td>
                    <td width="12.5%">耗材成本（元）</td>
                  </tr>
                  <tr v-for="(item,key) in monthReport.Table1" :class="{'odd-row':key%2==0}" :key="key">
                    <td >{{item.DeviceTypeName}}</td>
                    <td>{{item.LevelFirstCount+item.LevelSecondCount+item.LevelThirdCount}}</td>
                    <td>{{item.LevelFirstCount}}</td>
                    <td >{{item.LevelSecondCount}} </td>
                    <td>{{item.LevelThirdCount}} </td>
                    <td>{{item.SuppliesCount}} </td>
                    <td>{{item.SuppliesCost}}</td>
                  </tr>
                  <tr v-if="monthReport.Table1&&monthReport.Table1.length > 0" :class="{'odd-row':monthReport.Table1.length%2==0}">
                    <td>合计</td>
                    <td class="none-border"></td>
                    <td class="none-border"></td>
                    <td class="none-border"></td>
                    <td class="none-border"></td>
                    <td ></td>
                    <td>{{monthReport.Table2&&monthReport.Table2[0].AllSuppliesCost}}</td>
                  </tr>
                  <!-- <tr v-if="!monthReport.Table1||monthReport.Table1.length ===0 ">暂无数据</tr> -->
                </table>
            </div>
        </el-dialog>
        <!-- 保养记录 -->
        <el-dialog class="report-dialog"  title="" :visible.sync="showRecords">
            <div class="export-container"><button class="zw-btn export " @click="exportRecord"><i class="iconfont icon-Export"></i>导出</button></div>
            <div id='record'>
                <h4>保养记录</h4>
                <div class="clearfix project-name"><p class="l">项目名称: {{projectName}}</p><p class="r">月份:{{time.getFullYear() + '-' + (time.getMonth()+1)}}</p></div>
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
        <ul class="report-header clearfix">
            <li class="l">
              <span class="label">月份　</span>
              <el-date-picker
                class="month-picker"
                v-model="time"
                type="month"
                @change="selectTime"
                placeholder="选择日期"
              ></el-date-picker>
            </li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="queryExport">导出</button></li>
            <li class="l"><button class="zw-btn zw-btn-report" @click="readMonthReport()">保养月报</button></li>
        </ul>
        <div class="zw-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              header-row-class-name="el-table-header"
              :row-class-name="tableRowClassName"
              @sort-change='sortChange'
            >
                <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                 :sortable="item.sortble"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="查看">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="queryUMaintenancePlanRecordDetailByID(scoped.row)">记录</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
         <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import * as comm from "@/caiot/assets/js/pro_common";
import table from '@/caiot/mixins/table' //表格混入数据
import {Maintenance} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import '../record.scss'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop: 'MaintenancePlanDateTime',
                    label: '计划时间',
                    // sortble:'custom'
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                    sortble:'custom'
                },
                {
                    prop: 'MaintenanceLevelName',
                    label: '保养等级',
                    sortble:'custom'
                },
                {
                    prop: 'MaintenanceDateTime',
                    label: '保养时间',
                    sortble:'custom'
                },
                {
                    prop: 'FContacts',
                    label: '保养人',
                    sortble:'custom'
                },
            ],
            projectName:localStorage.getItem('projectname'),
            time:new Date(),
            showMonthReport:false,
            showRecords:false,
            monthReport:{},
            recordsInfo:{},
            orderProp:'',
            order:''
        }
    },
    watch:{

    },
    created(){
        this.queryData()
    },
    mounted(){

    },
    methods:{
        /**
         * 查询保养记录（203.分页查询保养记录）
         */
        queryData(){
            Maintenance({
                FAction:'QueryPageUMaintenancePlanRecord',
                FName:'',
                FDateTime:this.time.toLocaleDateString(),
                Field:this.orderProp,
                FOrder:this.order,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table?data.FObject.Table[0].FTotalCount:0
                this.tableData = data.FObject.Table1?data.FObject.Table1:[]
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
         * 201.查询保养记录详情
         */
        queryUMaintenancePlanRecordDetailByID(row){
            Maintenance({
                FAction:'QueryUMaintenancePlanRecordDetailByID',
                ID:row.ID
            })
            .then(data => {
                this.showRecords = true
                this.recordsInfo = data.FObject
            })
            .catch(err => {

            })
        },
        selectTime(val){
            this.queryData()
        },
        /**
         * 查看保养月报
         */
        async readMonthReport(){
            this.showMonthReport = true
            await new Promise(resolve => {
                Maintenance({
                    FAction:'QueryUMaintenanceCountByMonth',
                    FDateTime:this.time.toLocaleDateString().replace(/\//ig,'-')
                })
                .then(data => {
                    this.monthReport = data.FObject
                    resolve()
                })
                .catch(err => {

                })
            })
            if(this.monthReport.Table1.length ===0) return
            let fileName = localStorage.getItem("projectname") + '保养月报' +  this.time.getFullYear() + comm.formatNumber(this.time.getMonth()+1)
            this.fileUpload('#month-report',fileName)
        },
        sortChange(column){
            if(column.prop === 'MaintenanceLevelName'){
                this.orderProp = 'MaintenanceLevel'
            }else{
                this.orderProp = column.prop
            }           
            this.order = column.order
            this.queryData()
        },
        /**
         * 导出月报
         */
        exportMonthReport(){
            let fileName = localStorage.getItem("projectname") + '保养月报' +  this.time.getFullYear() + comm.formatNumber(this.time.getMonth()+1)
            this.getPdf('#month-report',fileName);
        },
        /**
         * 导出记录详情
         */
        exportRecord(){
            let fileName = this.recordsInfo.Table[0].DeviceName + '保养记录'
            this.getPdf('#record',fileName);
        },
        /**
         * 导出保养记录
         */
        queryExport(){
          Maintenance({
            FAction:'ExportUMaintenancePlanRecord',
            FDateTime:this.time.toLocaleDateString().replace(/\//ig,'-'),
            Field:this.orderProp,
            FOrder:this.order
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

</style>
