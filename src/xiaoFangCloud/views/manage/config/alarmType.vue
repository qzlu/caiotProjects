<template>
    <div class="report">
        <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="告警类型" prop="AlarmTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.AlarmTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="告警级别" prop="AlarmLevel">
                  <el-select v-model="addInfo.AlarmLevel" filterable placeholder="请选择">
                    <el-option label="提示"  :value="1"></el-option>
                    <el-option label="一般"  :value="2"></el-option>
                    <el-option label="严重"  :value="3"></el-option>
                  </el-select>                
                </el-form-item>
                <el-form-item label="告警种类" prop="AlarmKind">
                  <el-select v-model="addInfo.AlarmKind" filterable placeholder="请选择">
                    <el-option label="预警"  :value="1"></el-option>
                    <el-option label="火警"  :value="2"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit" slot="footer">
                <el-button  @click="addOrUpdate()">确定</el-button>
                <el-button @click="show = false">取消</el-button>
            </div>
        </el-dialog>    
        <ul class="operation clearfix">
            <li class="l"><el-button  @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
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
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
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
import table from '@/xiaoFangCloud/mixins/table' //表格混入数据
import {System} from '@/xiaoFangCloud/request/api.js';
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
                    prop:'AlarmTypeName',
                    label:'告警类型',
                },
                {
                    prop: 'AlarmLevel',
                    label: '告警级别',
                    formatter:row => this.alarmLevel[row.AlarmLevel]
                },
                {
                    prop: 'AlarmKind',
                    label: '告警种类',
                    formatter:row => row.AlarmKind==1?'预警':'火警'
                },
            ],
            alarmLevel: ['', '提示', '一般', '严重'],
            type:0,
            defaultAddInfo:{//新增参数默认数据
                AlarmTypeID:0,
                AlarmTypeName:null,
                AlarmLevel:null,
                AlarmKind:null,
            },
            addInfo:{ //新增或修改参数
                AlarmTypeID:0,
                AlarmTypeName:null,
                AlarmLevel:null,
                AlarmKind:null,
            },
            title:'新增',
    
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
         * 通用配置-分页查询告警类型
         */
        queryData(){
            System({
                FAction:'QueryPageSAlarmType',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
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
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 编辑
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 335 通用配置-新增/修改告警类型
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            System({
                FAction:'AddOrUpdateSAlarmType',
                sAlarmType:this.addInfo
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
         * 336.标准配置-删除数据标识
         */
        async deleteItem(row){
            await this.beforeDelete()
            System({
                FAction:'DeleteSAlarmType',
                ID:row.AlarmTypeID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            System({
                FAction:'ExportSAlarmType',
                SearchKey:this.filterText,
            })
            .then(data => {
                this.downloadFile(data)
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
