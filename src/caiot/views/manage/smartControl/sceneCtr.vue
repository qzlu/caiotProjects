<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="场景名称" prop="SceneName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.SceneName">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择" clearable>
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="控制策略" prop="FType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.FType"  placeholder="请选择">
                    <el-option label="条件策略"  value="1"></el-option>
                    <el-option label="时间策略"  value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="执行时间" prop="TimeID">
                  <el-select v-model="addInfo.TimeID" filterable placeholder="请选择">
                    <el-option v-for="item in timeList" :key="item.TimeID" :label="item.Detail"  :value="item.TimeID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="执行条件" prop="ConditionID" >
                  <el-select v-model="addInfo.ConditionID" filterable placeholder="请选择">
                    <el-option v-for="item in conditionList" :key="item.ConditionID" :label="item.Detail"  :value="item.ConditionID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否群控" prop="GroupFlag" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.GroupFlag"  placeholder="请选择" @change="addInfo.CmdID = ''">
                    <el-option label="否"  :value="false"></el-option>
                     <el-option label="是"  :value="true"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="控制指令" prop="CmdID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.CmdID" filterable placeholder="请选择">
                    <el-option v-for="item in cmdList" :key="item.id" :label="item.label"  :value="item.id"></el-option>
                  </el-select>
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
<!--                <el-table-column label="控制明细">
                   <template v-slot={row}> 
                        <el-button type="primary" round @click="queryUBaseCmdDetail(row)">查看</el-button>
                   </template>
               </el-table-column> -->
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
import table from '@/caiot/mixins/table' //表格混入数据
import {Control} from '@/caiot/request/api.js';
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
                    prop:'SceneName',
                    label:'场景名称'
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'FType',
                    label: '控制策略',
                    formatter:row => row.FType == 2 ? '时间策略' : '条件策略'
                },
                {
                    prop: 'TimeDetail',
                    label: '执行时间',
                },
                {
                    prop: 'ConditionName',
                    label: '执行条件',
                },
                {
                    prop:'GroupFlag',
                    label: '是否群控',
                    formatter:row => row.GroupFlag?'是':'否'
                },
                {
                    prop: 'CMDShortName',
                    label: '控制指令',
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                ConditionCMDID:0,
                LDasID:null,
                ConditionID:null,
                CmdID:'',
                TimeID:'',
                GroupFlag:false,
                Detail:'',
                FType:'',
                SceneName:''
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            conditionList:[], //条件列表
            timeList:[], //时间列表
            groupCmdList:[], //群控指令列表
            singleCmdList:[], //单控指令列表
        }
    },
    computed:{
        cmdList(){
            if(this.addInfo.GroupFlag == 0){
                return this.singleCmdList
            }else if(this.addInfo.GroupFlag == 1){
                return this.groupCmdList
            }else{
                return []
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
        this.queryUBaseCmdUGroupByLDasID()
        this.queryConditionList()
        this.queryUTimeList()
    },
    methods:{
        /**
         * 1.管理后台--查询分页场景控制
         */
        queryData(){
            Control({
                FAction:'QueryPageUConditionCmd',
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
        /**
         * 32.管理后台—根据网关查询所有单控和群控指令
         */
        queryUBaseCmdUGroupByLDasID(id = 0){
                Control({
                    FAction:'QueryUBaseCmdUGroupByLDasID',
                    LDasID:id,
                    ID:0
                })
                .then((result) => {
                    let data =  result.FObject
                    this.singleCmdList = data.Table.map(item => {
                        return {
                            label:item.CMDName,
                            id:item.CmdID,
                            ...item
                        }
                    })
                    this.groupCmdList = data.Table1.map(item => {
                        return {
                            label:item.GroupName,
                            id:item.GroupID,
                            ...item
                        }
                    })
                }).catch((err) => {
                });
        },
        /**
         * 11.管理后台--查询项目条件列表
         */
        queryConditionList(){
            Control({
                FAction:'QueryConditionList'
            })
            .then((result) => {
                this.conditionList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 12.管理后台--查询项目时间列表
         */
        queryUTimeList(){
            Control({
                FAction:'QueryUTimeList'
            })
            .then((result) => {
                this.timeList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 查看控制明细
         */
        queryUBaseCmdDetail(row){
            Control({
                FAction:'QueryUBaseCmdDetail',
                ID:row.ConditionCMDID
            })
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                
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
         * 修改告警类型
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.addInfo.FName = row.AlarmTypeName
        },
        /**
         * 新增/修改场景控制
         */
        async addOrUpdate(){
            this.show = false
            Control({
                FAction:'AddUpdateUConditionCmd',
                mUConditionCmd:this.addInfo
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
         * 268.删除场景控制
         */
        async deleteItem(row){
            console.log(row);
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除场景控制'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Control({
                FAction:'DeleteUConditionCmd',
                ID:row.ConditionCMDID,
                FType:row.FType
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
</style>
