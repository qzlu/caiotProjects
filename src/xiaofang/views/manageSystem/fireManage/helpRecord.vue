<template>
    <div class="report">
        <ul class="operation clearfix">
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
            <li class="r">
                <span class="label">时间</span>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  range-separator="至"
                  @change="queryData"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
            </li>
            <li class="r">
                <span class="label">求助方式</span>
                <el-select v-model="state" @change="queryData">
                    <el-option :value="0" label="全部"></el-option>
                    <el-option :value="1" label="SOS求助"></el-option>
                    <el-option :value="2" label="一般求助"></el-option>
                </el-select>
            </li>
        </ul>
        <el-dialog :visible.sync="show" class="zw-dialog record" width="695px" append-to-body title="反馈记录">
            <ul class="recod-list clearfix">
                <li class="l"><span class="label">求助类型</span>{{record.HelpLevel == 1?'SOS求助':'一般求助'}}</li>
                <li class="l" :title="record.HelpAddress"><span class="label">求助位置</span>{{record.HelpAddress}}</li>
                <li class="l"><span class="label">求助人</span>{{record.FCreatorUser}}</li>
                <li class="l"><span class="label">联系方式</span>{{record.FTelephone}}</li>
                <li class="l"><span class="label">处理人</span>{{record.LeaderUser}}</li>
                 <li class="l"><span class="label">求助时间</span>{{record.FCreateTime}}</li>
                <li class="l"><span class="label">确认时间</span>{{record.ProcessingDateTime}}</li>
                <li class="l"><span class="label">解救时间</span>{{record.LiftedDateTime}}</li>
                <li class="l descripe"><span class="label l">求助描述</span><p>{{record.HelpLevel == 1?'SOS求助':record.HelpContent}}</p></li>
                <li class="l descripe"><span class="label l">处理描述</span><p>{{record.ProcessingContent}}</p></li>
            </ul>
        </el-dialog>                               
        <div class="zw-table">
            <el-table
             :data='tableData'
             :row-class-name="tableRowClassName"
            >
                <el-table-column
                  v-for="item in tableLabel"
                  show-overflow-tooltip
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="item.formatter"
                 >
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scoped">
                        <div>
                            <span v-if="scoped.row.AlarmType == 2">--</span>
                            <span v-else @click="record = scoped.row;show =true;" title="记录"><i class="el-icon-document"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
import {Alarm} from '@/xiaofang/request/api.js';
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
                    prop: 'HelpLevel',
                    label: '求助方式',
                    width:260,
                    formatter:(row) => row.HelpLevel == 1?'SOS求助':'一般求助'
                },
                {
                    prop: 'HelpAddress',
                    label: '求助位置',
                    width:260,
                },
                {
                    prop: 'FCreatorUser',
                    label: '求助人'
                },
                {
                    prop: 'FTelephone',
                    label: '联系电话'
                },
                {
                    prop: 'LeaderUser',
                    label: '处理人',
                    width:160,
                },
                {
                    prop: 'FCreateTime',
                    label: '求助时间',
                    width:160,
                    formatter:(row) => row.FCreateTime != null?row.FCreateTime.replace(/T/ig,' '):''
                },
                {
                    prop: 'ProcessingDateTime',
                    label: '确认时间',
                    width:160,
                    formatter:(row) => row.ProcessingDateTime != null?row.ProcessingDateTime.replace(/T/ig,' '):''
                },
                {
                    prop: 'LiftedDateTime',
                    label: '解救时间',
                    width:160,
                    formatter:(row) => row.LiftedDateTime != null?row.LiftedDateTime.replace(/T/ig,' '):''
                },
            ],
            time:[new Date(),new Date()],
            state:0,
            record:{}
        }
    },
    created(){

    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    mounted(){
        this.queryData()
    },
    methods:{
        /**
         * 分页查询设备
         */
        queryData(){
            Alarm({
                FRouteName:'Alarm',
                FAction:'QueryPageUHelpRecordpc',
                SearchKey:this.filterText,
                State:this.state,
                StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time[1].toLocaleDateString()+ ' 23:59',
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                console.log(data);
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            }).catch((err) => {
                
            });
        },
    }
}
</script>
<style lang="scss">

</style>