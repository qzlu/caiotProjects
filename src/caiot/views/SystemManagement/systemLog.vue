<template>
    <div class="report inspection-item system-type">
        <ul class="report-header clearfix">
           <!--  <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li> -->
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div class="zw-table">
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
                 :width="item.width"
                 :label="item.label"
                 :sortable="item.sortble"
                 :formatter="item.formatter"
                 show-overflow-tooltip
                >
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import {system} from '@/caiot/request/api.js';
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
                    prop:'FContacts',
                    label:'用户名'
                },
                {
                    prop:'FUserName',
                    label:'账号'
                },
                {
                    prop: 'TerminalType',
                    label: '终端名称',
                },
                {
                    prop: 'FClientIP',
                    label: '登录IP地址',
                },
                {
                    prop: 'FModuleName',
                    label: '模块名称',
                },
                {
                    prop: 'FOperationRecords',
                    label: '操作记录',
                },
                {
                    prop: 'FCreateTime',
                    label: '操作时间',
                },
            ],
    
        }
    },
    computed:{
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
         * 320.标准配置-分页查询协议明细
         */
        queryData(){
            system({
                FAction:'QueryPageLog',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            })
            .catch((err) => {
                
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
         * exportFile 导出
         */
        exportFile(){
            project({
                FAction:'QueryExportULdas',
                SearchKey:this.filterText,
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
