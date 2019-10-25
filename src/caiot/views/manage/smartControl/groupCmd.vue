<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="指令全称" prop="GroupName"  :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.GroupName">
                    </el-input>
                </el-form-item>
                <el-form-item label="指令简称" prop="GroupShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.GroupShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择">
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="指令等级" prop="GroupLevel" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.GroupLevel" filterable placeholder="请选择">
                    <el-option v-for="item in groupLevelList" :key="item.id" :label="item.label"  :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="指令模式" prop="GroupMode" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.GroupMode" filterable placeholder="请选择">
                    <el-option v-for="item in groupModeList" :key="item.id" :label="item.label"  :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
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
               <el-table-column label="控制明细">
                   <template v-slot={row}>
                        <el-button type="primary" round @click="queryGroupCmdDetail(row)">执行指令</el-button>
                   </template>
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
        <el-dialog title="控制明细" :visible.sync="show1" width="500px"  class="zw-dialog">
            <tree-transfer
            ref="treeTransfer" 
            :data='allCmd' 
            :data1='allCmd'
            leftTitle='全部指令'
            rightTitle='已做指令'
            nodeKey="id"
            :defaultChecked='defaultCheck'
            @check-change='checkChange'
            :filterNode="filterNode"
            >

            </tree-transfer>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="updateUGroupCMD()">确定</button>
            </div>
        </el-dialog>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import {Control,system} from '@/caiot/request/api.js';
import {treeTransfer} from '@/caiot/zw-components/index.js';
import { throttle } from 'throttle-debounce';
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
                    prop:'GroupName',
                    label:'指令全称'
                },
                {
                    prop: 'GroupShortName',
                    label: '指令简称',
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'GroupLevel',
                    label: '指令等级',
                },
                {
                    prop: 'GroupMode',
                    label: '指令模式',
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                GroupID:0,
                LDasID:null,
                GroupName:null,
                GroupShortName:'',
                GroupLevel:'',
                GroupMode:'',
            },
            title:'新增',
            show:false,
            groupLevelList:[{
                id:1,
                label:"一级"
            },{
                id:2,
                label:"二级"
            }],
            groupModeList:[{
                id:1,
                label:"指令"
            },{
                id:2,
                label:"指令集"
            },{
                id:3,
                label:"遥调"
            }], 
            LDasList:[], //网关列表
            show1:false,
            allCmd:[], //所有指令
            checkCmd:[],
            defaultCheck:[],
            activeCmd:null
        }
    },
    components:{
        treeTransfer
    },
    computed:{
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
         * 18.管理后台—分页查询寄存器仪表关系映射
         */
        queryData(){
            Control({
                FAction:'QueryPageUGroup',
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
         * 查询群控指令明细
         */
        async queryGroupCmdDetail(row){
            this.show1 = true
            this.activeCmd = row
            this.allCmd = []
            this.defaultCheck = []
            await this.queryUBaseCmdUGroupByLDasID(row)
            this.queryUGroupCMD(row)
        },
        /**
         * 27.管理后台—查询群控明细 
         */
        queryUGroupCMD(row){
            Control({
                FAction:'QueryUGroupCMD',
                ID:row.GroupID
            })
            .then((result) => {
                let data = result.FObject
                data.forEach(item => {
                    if(item.GroupFlag){
                        this.allCmd[1].children.forEach(obj => {
                            if(obj.id == item.Cmd_1){
                                obj.checked = true
                            }
                        })
                    }else{
                        this.allCmd[0].children.forEach(obj => {
                            if(obj.id == item.Cmd_1){
                                obj.checked = true
                            }
                        })
                    }
                })
                this.defaultCheck = data.map(item => item.Cmd_1)
                this.$nextTick(() => {
                    this.$refs.treeTransfer.$refs.tree1.filter()
                })
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 32.管理后台—根据网关查询所有单控和群控指令
         */
        queryUBaseCmdUGroupByLDasID(row){
            return new Promise((resolve,reject) => {
                Control({
                    FAction:'QueryUBaseCmdUGroupByLDasID',
                    LDasID:row.LDasID,
                    ID:row.GroupID
                })
                .then((result) => {
                    let data =  result.FObject
                    this.allCmd = [
                        {
                            label:'单控指令',
                            id:'0-0',
                            level:1,
                            checked:false,
                            children:data.Table.map(item => {
                                return {
                                    label:item.CMDName,
                                    id:item.CmdID,
                                    level:2,
                                    checked:false,
                                    ...item
                                }
                            })
                        },
                        {
                            label:'群控指令',
                            id:'0-1',
                            level:1,
                            checked:false,
                            children:data.Table1.map(item => {
                                return {
                                    label:item.GroupName,
                                    id:item.GroupID,
                                    level:2,
                                    checked:false,
                                    ...item
                                }
                            })
                        }
                    ]
                    resolve()
                }).catch((err) => {
                    reject()
                });
            })
        },
        checkChange(data,check){
            data.checked = check
            this.$refs.treeTransfer.$refs.tree1.filter()
        },
        /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.checked == true
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
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            console.log(this.addInfo);
        },
        /**
         * 新增/修改
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
            Control({
                FAction:'AddUpdateUGroup',
                mUGroup:this.addInfo
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
         * 28.管理后台--新增/修改群控明细 
         */
        updateUGroupCMD(){
            let cmds = [],checkCmd
            checkCmd = this.$refs.treeTransfer.$refs.tree.getCheckedNodes().filter(item => item.level == 2)
            checkCmd.forEach(item => {
                cmds.push({
                    GroupCMDID:0,
                    GroupID:this.activeCmd.GroupID,
                    LDasID:this.activeCmd.LDasID,
                    Cmd_1:item.CmdID?item.CmdID:item.GroupID,
                    Cmd_2:'',
                    GroupFlag:item.CmdID?false:true,
                    Detail:''
                })
            })
            this.show1 = false
            Control({
                FAction:'AddUpdateUGroupCMD',
                mUGroupCmds:cmds
            })
            .then((result) => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
            }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: '配置失败！'
                });
            });
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
                FAction:'DeleteUGroupAndUGroupCMD',
                ID:row.GroupID
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
