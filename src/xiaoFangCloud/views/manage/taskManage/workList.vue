<template>
    <div class="report">
        <el-dialog class="zw-dialog" :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="400px" >
            <el-form  inline ref="form">
                <el-form-item label="仪表类型">
                    <el-input v-model="FName">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button  @click="addOrUpdate()">确定</el-button>
                <el-button @click="show = false">取消</el-button>
            </div>
        </el-dialog>    
        <ul class="operation clearfix">
            <li class="l">
                <span class="label">工单状态</span>
                <el-select v-model="state" @change="queryData">
                    <el-option v-for="(item,i) in orderState" :key="i" :value="i" :label="item"></el-option>
                </el-select>
            </li>
            <li class="l">
                <span class="label">时间</span>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="queryData"
                ></el-date-picker>
            </li>
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
<!--                <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column> -->
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table' //表格混入数据
import {Orders,System} from '@/xiaoFangCloud/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowIndex',
                    label: '序号',
                    width:80
                },
                {
                    prop:'FormName',
                    label:'平台类型'
                },
                {
                    prop: 'OrderCreateDateTime',
                    label: '工单时间',
                },
                {
                    prop:'ID',
                    label:'工单编号'
                },
                {
                    prop:'OrderContent',
                    label:'工单名称'
                },
                {
                    prop:'OrderState',
                    label:'工单状态',
                    formatter:row => this.orderState[row.OrderState]
                }
            ],
            orderState:['全部','待完成', '已完成 ', '待接单', '待派单', '已逾期', '未完成', '误报', '转单'],
            type:0,
            ID:0,
            FName:null,
            title:'新增',
            state:0 , //查询的工单状态
            time:[new Date(), new Date()]
    
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
         * 任务管理-任务列表
         */
        queryData(){
            Orders({
                FAction:'QueryPageAlarmOrder',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10,
                StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time[1].toLocaleDateString() + " 23:59",
                FState:this.state
            })
            .then((data) => {
                this.total = data.FObject.FTotalCount || 0
                this.tableData = data.FObject.Data || []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch((err) => {
                
            });
        },
    }
}
</script>
<style lang="scss">
</style>
