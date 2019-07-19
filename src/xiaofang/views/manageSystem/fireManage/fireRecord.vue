<template>
    <div class="report">
        <h3>火警列表</h3>
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
                <span class="label">火警状态</span>
                <el-select v-model="alarmState" @change="queryData">
                    <el-option :value="-1" label="全部"></el-option>
                    <el-option :value="0" label="报警结束"></el-option>
                    <el-option :value="1" label="报警中"></el-option>
                </el-select>
            </li>
        </ul>
        <el-dialog :visible.sync="show" class="zw-dialog record" width="695px" append-to-body title="反馈记录">
            <ul class="recod-list clearfix">
                <li class="l" :title="record.DoorplateAddress"><span class="label">报警位置</span>{{record.DoorplateAddress}}</li>
                <li class="l"><span class="label">报警时间</span>{{record.AlarmDateTime}}</li>
                <li class="l"><span class="label">业主</span>{{record.Owners}}</li>
                <li class="l"><span class="label">确认时间</span>{{record.ConfirmDateTime}}</li>
                <li class="l"><span class="label">处理人</span>{{record.LeaderUser}}</li>
                <li class="l"><span class="label">解除时间</span>{{record.LiftedDateTime}}</li>
                <li class="l descripe"><span class="label l">报警描述</span><p>{{record.AlarmContent}}</p></li>
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
                <el-table-column label = '确认结果'>
                    <template slot-scope="scoped">
                        <div>
                            <span v-if="scoped.row.AlarmType == 2">误报</span>
                            <span v-else style="color:red">火警</span>
                        </div>
                    </template>
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
                    prop: 'DeviceCode',
                    label: '设备编码',
                    width:260,
                },
                {
                    prop: 'DoorplateAddress',
                    label: '报警位置',
                    width:260,
                },
                {
                    prop: 'Owners',
                    label: '业主'
                },
                {
                    prop: 'LeaderUser',
                    label: '处理人'
                },
                {
                    prop: 'AlarmDateTime',
                    label: '报警时间',
                    width:160,
                    formatter:(row) => row.AlarmDateTime != null ? row.AlarmDateTime.replace(/T/ig,' '):''
                },
                {
                    prop: 'ConfirmDateTime',
                    label: '确认时间',
                    width:160,
                    formatter:(row) => row.ConfirmDateTime != null?row.ConfirmDateTime.replace(/T/ig,' '):''
                },
                {
                    prop: 'LiftedDateTime',
                    label: '解除时间',
                    width:160,
                    formatter:(row) => row.LiftedDateTime!=null?row.LiftedDateTime.replace(/T/ig,' '):''
                },
            ],
            time:[new Date(),new Date()],
            alarmState:-1,
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
         * 分页查询报警
         */
        queryData(){
            Alarm({
                FRouteName:'Alarm',
                FAction:'QueryPageUAlarm',
                SearchKey:this.filterText,
                AlarmState:this.alarmState,
                StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime:this.time[1].toLocaleDateString()+ ' 23:59',
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
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