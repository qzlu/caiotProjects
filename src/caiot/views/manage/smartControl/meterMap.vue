<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="150px">
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请选择'}]" >
                  <el-select v-model="addInfo.MeterModelID"  filterable placeholder="请选择" @change="selectMeterModel">
                    <el-option v-for="item in meterModelList" :key="item.MeterModelID" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="寄存器仪表型号名称" prop="VarName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.VarName">
                    </el-input>
                </el-form-item>
                <el-form-item label="写入数据标识" prop="DataItemIDW" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DataItemIDW"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in dataItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="读取数据标识" prop="DataItemIDR" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DataItemIDR"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in dataItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="读取延迟" prop="CheckTime" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addInfo.CheckTime">
                        <i slot="suffix" class="unit">ms</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="初始值" prop="InitValue" >
                    <el-input type="number" v-model="addInfo.InitValue"></el-input>
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
                    prop:'MeterModelName',
                    label:'仪表型号'
                },
                {
                    prop: 'VarName',
                    label: '寄存器仪表型号名称',
                },
                {
                    prop: 'DataItemIDWName',
                    label: '写入数据标识',
                },
                {
                    prop: 'DataItemIDRName',
                    label: '读取数据标识',
                },
                {
                    prop: 'CheckTime',
                    label: '回读时长（ms）',
                },
                {
                    prop: 'InitValue',
                    label: '初始值',
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                RegMeterModelID:0,
                LDasID:null,
                MeterModelID:null,
                WriteReg:'',
                ReadReg:'',
                DataItemIDW:'',
                DataItemIDR:'',
                InitValue:'',
                CheckTime:0,
                Detail:'',
                VarName:''
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            meterList:[], //所有仪表
            dataItemList:[], //仪表所对应的数据标识
            conditionList:[],
            meterModelList:[] , //仪表型号
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
        this.queryUMeter()
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 42. 分页查询寄存器仪表型号
         */
        queryData(){
            Control({
                FAction:'QueryPageURegMeterModel',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
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
                PageIndex:1,
                PageSize:1000
            })
            .then((data) => {
                this.meterList =data.FObject.Table1 || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 49. 根据仪表型号ID查询数据标识
         */
        queryDataItemByMeterModelID(id){
            Control({
                FAction:'QueryDataItemByMeterModelID',
                ID:id
            })
            .then((result) => {
                this.dataItemList = result.FObject || []

            }).catch((err) => {
                
            });
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
                this.meterModelList = data.FObject.Table1 ? data.FObject.Table1 : []
            })
            .catch((err) => {
                
            });
        },
        selectMeterModel(id){
            this.addInfo.DataItemIDW = ''
            this.addInfo.DataItemIDR = ''
            this.queryDataItemByMeterModelID(id)
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
            this.queryDataItemByMeterModelID(row.MeterModelID)
        },
        /**
         * 41. 新增/修改寄存器仪表型号
         */
        async addOrUpdate(){
            this.show = false
            Control({
                FAction:'AddUpdateURegMeterModel',
                mURegMeterModel:this.addInfo
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
                FAction:'DeleteUMapTabByRegMeterModelID',
                ID:row.RegMeterModelID
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
