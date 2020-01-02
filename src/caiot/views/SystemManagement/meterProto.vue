<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.MeterModelID">
                        <el-option v-for="(item,i) in systemModelList" :key="i" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仪表协议名称" prop="MeterModelName" :rules="[{ required: true, message: '请输入'}]"> 
                    <el-input v-model="addInfo.MeterModelName"></el-input>
                </el-form-item>
                <el-form-item label="指令功能码" prop="FunctionCode">
                    <el-input  v-model="addInfo.FunctionCode"></el-input>
                </el-form-item>
                <el-form-item label="开始读取地址" prop="Beginaddr">
                    <el-input  v-model="addInfo.Beginaddr"></el-input>
                </el-form-item>
                <el-form-item label="读取个数" prop="ReadCount">
                    <el-input v-model="addInfo.ReadCount"></el-input>
                </el-form-item>
                <el-form-item label="是否优先读" prop="PrioRead">
                    <el-select v-model="addInfo.PrioRead">
                        <el-option label="否" :value="false"></el-option>
                        <el-option label="是" :value="true"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdate">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
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
import table from '@/caiot/mixins/table' //表格混入数据
import {project,system} from '@/caiot/request/api.js';
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
                    prop:'ProtocolID',
                    label:'仪表协议ID'
                },
                {
                    prop:'MeterModelName',
                    label:'仪表协议名称'
                },
                {
                    prop: 'FunctionCode',
                    label: '指令功能码',
                },
                {
                    prop: 'Beginaddr',
                    label: '开始读取地址',
                },
                {
                    prop: 'ReadCount',
                    label: '读取个数',
                },
                {
                    prop: 'PrioRead',
                    label: '是否只读',
                    formatter:row => row.PrioRead == 1 ?'是':'否'
                }
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                ProtocolID:0,
                FunctionCode:null,
                Beginaddr:null,
                ReadCount:null,
                MeterModelID:null,
                MeterModelName:null,
                PrioRead:0
            },
            addInfo:{ //新增或修改项目参数
                ProtocolID:0,
                FunctionCode:null,
                Beginaddr:null,
                ReadCount:null,
                MeterModelID:null,
                MeterModelName:null,
                PrioRead:0
            },
            title:'新增',
            show:false,
            systemModelList:[]
    
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
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 316.标准配置-分页查询仪表协议
         */
        queryData(){
            system({
                FAction:'QueryPageSprotocol',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
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
         * 340.标准配置-分页查询仪表型号
         */
        queryPageSMeterModel(){
            system({
                FAction:'QueryPageSMeterModel',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.systemModelList = data.FObject.Table1 ? data.FObject.Table1 : []
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
         * 317.标准配置-新增/修改仪表协议
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
            system({
                FAction:'AddOrUpdateSprotocol',
                FType:this.type,
                mSprotocol:this.addInfo
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
         * 319.标准配置-删除仪表协议
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除仪表协议'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            system({
                FAction:'DeleteSprotocol',
                ID:row.ProtocolID
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
.system-type.inspection-item {
    .el-form-item {
        .el-form-item__label{
            width: 120px
        }
    }
    
}
</style>
