<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="寄存器名称" prop="VarName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.VarName">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择">
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.MeterID" filterable placeholder="请选择" @change="selectMeter">
                    <el-option v-for="item in meterList" :key="item.MeterID" :label="item.MeterName"  :value="item.MeterID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DataItemID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in dataItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="初始值" prop="InitValue">
                    <el-input type="number" v-model="addInfo.InitValue"></el-input>
                </el-form-item>
                <el-form-item label="读取模式" prop="ReadMode">
                    <el-input type="number" v-model="addInfo.ReadMode"></el-input>
                </el-form-item>
                <el-form-item label="关系寄存器" prop="RelatedReg">
                    <el-input type="number" v-model="addInfo.RelatedReg"></el-input>
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
import {Control,system} from '@/caiot/request/api.js';
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
                    prop:'VarName',
                    label:'仪表关系名称'
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'MeterName',
                    label: '仪表名称',
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'InitValue',
                    label: '初始值',
                },
                {
                    prop: 'ReadMode',
                    label: '读取模式',
                },
                {
                    prop: 'RelatedReg',
                    label: '关系寄存器',
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                MapTabID:0,
                LDasID:null,
                MeterID:null,
                DataItemID:'',
                VarName:'',
                InitValue:'',
                ReadMode:'',
                RelatedReg:'',
                Detail:''
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            meterList:[], //所有仪表
            dataItemList:[], //仪表所对应的数据标识
            conditionList:[]
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
        this.defaultAddInfo = JSON.parse(JSON.stringify(this.addInfo))
        this.queryData()
        this.queryLDasByProjectID()
        this.queryUMeter()
    },
    methods:{
        /**
         * 18.管理后台—分页查询寄存器仪表关系映射
         */
        queryData(){
            Control({
                FAction:'QueryPageUMapTab',
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
         * 274.分页查询仪表信息
         */
        queryUMeter(){
            system({
                FAction:'QueryUMeter',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:1000
            })
            .then((data) => {
                this.meterList =data.FObject.Table1 || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 15.管理后台--根据仪表ID查询数据标识
         */
        queryDataItemByMeterID(id){
            Control({
                FAction:'QueryDataItemByMeterID',
                MeterID:id
            })
            .then((result) => {
                this.dataItemList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        selectMeter(id){
            this.addInfo.DataItemID = ''
            this.dataItemList = []
            this.queryDataItemByMeterID(id)
        },
        /**
         * 10.管理后台—查询项目指令（条件指令 时间指令）列表
         */
        queryConditionCmdOrTimeCmdList(type){
            Control({
                FAction:'QueryConditionCmdOrTimeCmdList',
                FType:type
            })
            .then((result) => {
                this.cmdList = result.FObject
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
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            console.log(this.addInfo);
            this.queryDataItemByMeterID(row.MeterID)
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
                FAction:'AddUpdateUMapTab',
                mUMapTab:this.addInfo
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
                FAction:'DeleteUMapTabByMapTabID',
                ID:row.MapTabID
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
