<template>
    <div class="report inspection-item ">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="140px">
                <el-form-item label="时间名称" prop="Detail"  :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Detail">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择">
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="开始时间" prop="TimeStart" :rules="[{ required: true, message: '请选择'}]">
                    <el-time-picker
                      v-model="addInfo.TimeStart"
                      :picker-options="{
                        selectableRange: '00:00:00 - 23:59:00',
                      }"
                      placeholder="选择时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="TimeEnd">
                    <el-time-picker
                      v-model="addInfo.TimeEnd"
                      :picker-options="pickerOptions"
                      placeholder="选择时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="选择星期" prop="Week" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="checkWeek" multiple collapse-tags @change="checkChange">
                        <el-option v-for="item in weekList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否重复" prop="OneTime">
                     <el-switch v-model="addInfo.OneTime">

                     </el-switch>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdate">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
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
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedRow(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import {Control,system,Device} from '@/caiot/request/api.js';
import formatDate from '@/utils/formatDate.js';
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
                    prop: 'ProjectName',
                    label:'项目名称'
                },
                {
                    prop:'Detail',
                    label:'时间名称'
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'TimeStart',
                    label: '开始时间',
                    width:160
                },
                {
                    prop: 'TimeEnd',
                    label: '结束时间',
                    width:160
                },
                {
                    prop: 'Week',
                    label: '选择星期',
                },
                {
                    prop: 'OneTime',
                    label: '是否重复',
                    formatter:row => row.OneTime?'是':'否'
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                TimeID:0,
                LDasID:null,
                TimeStart:null,
                TimeEnd:0,
                Week:'',
                OneTime:false,
                Detail:'',
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            meterMapList:[], //所有仪表关系
            deviceList:[], //设备列表
            weekList:[{
              id:'1',
              label:'星期一'  
            },{
              id:'2',
              label:'星期二'  
            },{
              id:'3',
              label:'星期三'  
            },{
              id:'4',
              label:'星期四'  
            },{
              id:'5',
              label:'星期五'  
            },{
              id:'6',
              label:'星期六'  
            },{
              id:'7',
              label:'星期天'  
            }],
            checkWeek:[],
            ReadMapTab:null

        }
    },
    computed:{
        pickerOptions(){
            return {
                selectableRange: `${formatDate(this.addInfo.TimeStart,'HH:mm:ss')||'00:00:00'} - 23:59:00`,
            }
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.defaultAddInfo = JSON.parse(JSON.stringify(this.addInfo))
        this.queryData()
        this.queryLDasByProjectID()
    },
    methods:{
        /**
         * 31.管理后台—分页查询时间表
         */
        queryData(){
            Control({
                FAction:'QueryPageUTime',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 || []
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
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 13.管理后台--根据项目ID查询网关
         */
        queryLDasByProjectID(){
            Control({
                FAction:'QueryLDasByProjectID'
            })
            .then((result) => {
                this.LDasList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        checkChange(val){
            this.addInfo.Week = this.checkWeek.join(',')
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.checkWeek = []
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            let today = formatDate(new Date(),'YYYY-MM-DD')
            this.addInfo.TimeStart = today + ' ' + row.TimeStart
            if(row.TimeEnd){
                this.addInfo.TimeEnd = today + ' ' + row.TimeEnd
            }
            this.checkWeek = row.Week.split(',')
        },
        /**
         * 新增/修改
         */
        async addOrUpdate(){
            this.show = false
            this.addInfo.TimeStart = formatDate(this.addInfo.TimeStart,'HH:mm:ss')
            this.addInfo.TimeEnd = formatDate(this.addInfo.TimeEnd,'HH:mm:ss')
            Control({
                FAction:'AddUpdateUTime',
                mUTime:this.addInfo
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除?`])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Control({
                FAction:'DeleteUTime',
                ID:row.TimeID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        }
    }
}
</script>
<style lang="scss">
.el-time-spinner{
    display: flex
}
</style>
