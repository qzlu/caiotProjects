<template>
    <div class="report inspection-item protocol">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.MeterModelID">
                        <el-option v-for="(item,i) in systemModelList" :key="i" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据顺序" prop="DataSort">
                    <el-input type="number" v-model="addInfo.DataSort"></el-input>
                </el-form-item>
                <el-form-item label="寄存地址" prop="Regaddr">
                    <el-input  v-model="addInfo.Regaddr"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="DataType">
                    <el-select v-model="addInfo.DataType">
                        <el-option v-for="(item,i) in dataTypeList" :key="i" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计算类型" prop="CalType">
                    <el-select v-model="addInfo.CalType">
                        <el-option v-for="(item,i) in calTypeList" :key="i" :label="item" :value="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系数" prop="Factor">
                    <el-input v-model="addInfo.Factor"></el-input>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID">
                   <el-select v-model="addInfo.DataItemID">
                       <el-option v-for="(item,i) in dataItemList" :key="i" :label="item.DataItemName" :value="item.DataItemID"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="是否采集" prop="IsCapture">
                    <el-select v-model="addInfo.IsCapture">
                        <el-option  label="是" :value="1"></el-option>
                        <el-option  label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变化范围" prop="UpDateScale" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number"  v-model="addInfo.UpDateScale"></el-input>
                </el-form-item>
                <el-form-item label="报警最小值" prop="AlarmMax" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addInfo.AlarmMax"></el-input>
                </el-form-item>
                <el-form-item label="报警最大值" prop="AlarmMin" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addInfo.AlarmMin"></el-input>
                </el-form-item>
                <el-form-item label="是否可写" prop="WFlag">
                    <el-select v-model="addInfo.WFlag">
                        <el-option  label="是" :value="true"></el-option>
                        <el-option  label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
           <!--  <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li> -->
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
                    prop:'MeterModelID',
                    label:'仪表型号ID'
                },
                {
                    prop:'MeterModelName',
                    label:'仪表型号名称',
                    width:'150'
                },
                {
                    prop: 'DataSort',
                    label: '数据顺序',
                },
                {
                    prop: 'Regaddr',
                    label: '寄存地址',
                },
                {
                    prop: 'DataType',
                    label: '数据类型',
                },
                {
                    prop: 'CalType',
                    label: '计算类型',
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'IsCapture',
                    label: '是否采集',
                    formatter:row => row.IsCapture?'是':'否'
                },
                {
                    prop: 'UpDateScale',
                    label: '变化范围',
                },
                {
                    prop: 'AlarmMax',
                    label: '报警最大值',
                },
                {
                    prop: 'AlarmMin',
                    label: '报警最小值',
                },
                {
                    prop: '',
                    label: '是否可写',
                    formatter:row => row.WFlag?'是':'否'
                },
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                ProtocolDetailID:0,
                DataSort:null,
                Regaddr:null,
                DataType:null,
                CalType:null,
                Factor:null,
                MeterModelID:null,
                DataItemID:null,
                DataItemName:'',
                IsCapture:1,
                UpDateScale:'',
                AlarmMax:'',
                AlarmMin:'',
                WFlag:''
            },
            addInfo:{ //新增或修改项目参数
                ProtocolDetailID:0,
                DataSort:null,
                Regaddr:null,
                DataType:null,
                CalType:null,
                Factor:null,
                MeterModelID:null,
                DataItemID:null,
                DataItemName:'',
                IsCapture:1,
                UpDateScale:'',
                AlarmMax:'',
                AlarmMin:'',
                WFlag:''
            },
            calTypeList:['无','+','-','*','/','x²','LN(x)','log(x)','位取'],//计算类型
            dataTypeList:[
                {value:0,name:'bit'},
                {value:1,name:'unsigned short'},
                {value:2,name:'short'},
                {value:3,name:'int'},
                {value:4,name:'uint'},
                {value:5,name:'float'},
                {value:6,name:'double'},
                {value:7,name:'long'},
                {value:8,name:'vint'},
                {value:9,name:'vfloat'},
                {value:93,name:'oint'},
                {value:94,name:'ouint'},
                {value:98,name:'ovint'}],
            title:'新增',
            show:false,
            systemModelList:[],
            dataItemList:[]
    
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
        this.queryPageSDataItem()
    },
    methods:{
        /**
         * 320.标准配置-分页查询协议明细
         */
        queryData(){
            system({
                FAction:'QueryPageSProtocolDetail',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
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
         * 335.标准配置-分页查询数据标识
         */
        queryPageSDataItem(){
            system({
                FAction:'QueryPageSDataItem',
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.dataItemList = data.FObject.Table1 ? data.FObject.Table1 : []
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
         * 321.标准配置-新增/修改仪表协议明细
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
                FAction:'AddOrUpdateSProtocolDetail',
                FType:this.type,
                mSProtocolDetail:this.addInfo
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
         * 322.标准配置-删除协议明细
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除协议解析'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            system({
                FAction:'DeleteSProtocolDetail',
                ID:row.ProtocolDetailID
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
.inspection-item.protocol{
    .zw-dialog{
        .el-dialog{
            .el-form{
                &-item{
                    .range.el-input{
                        width: 82px;
                    }
                }
            }
        }
    }
}
</style>
