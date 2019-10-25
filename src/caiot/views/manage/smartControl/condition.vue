<template>
    <div class="report inspection-item ">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="100px">
                <el-form-item label="条件名称" prop="Detail"  :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Detail">
                    </el-input>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择" @change="selectLdas">
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="条件表达式" >
                    <ul class="express">
                        <li v-for="(item,i) in expressionList" :key="i">
                            <el-select class="condition" v-model="item.condition" value-key="MapTabID" filterable placeholder="请选择">
                              <el-option v-for="item in meterMapList" :key="item.MapTabID" :label="item.VarName"  :value="item.VarName"></el-option>
                            </el-select>
                            <el-select class="expression" v-model="item.express">
                                <el-option label=">" value=">"></el-option>
                                <el-option label=">=" value=">="></el-option>
                                <el-option label="=" value="="></el-option>
                                <el-option label="<=" value="<="></el-option>
                                <el-option label="<" value="<"></el-option>
                            </el-select>
                            <el-input class="value" type="number" v-model="item.value">
                            </el-input>
                            <el-select class="expression" v-model="item.connectExpress">
                                <el-option label="并且" value="&&"></el-option>
                                <el-option label="或" value="||"></el-option>
                            </el-select>
                        </li>
                        <li class="add">
                           <i class="el-icon-minus" v-if="expressionList.length>1" @click="removeExpress()"></i>
                           <i class="el-icon-plus" @click="addExpress()"></i>
                        </li>
                    </ul>
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
import {Control,system,Device} from '@/caiot/request/api.js';
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
                    prop:'Detail',
                    label:'条件名称'
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'Express',
                    label: '条件表达式',
                }
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                ConditionID:0,
                LDasID:null,
                Express:null,
                Detail:''
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            meterMapList:[], //所有仪表关系
            deviceList:[], //设备列表
            WriteMapTab:null,
            ReadMapTab:null,
            expressionList:[
                {
                    condition:'',
                    express:'',
                    value:'',
                    connectExpress:''
                }
            ]

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
    },
    methods:{
        /**
         * 18.管理后台--策略设定--查询分页条件设定
         */
        queryData(){
            Control({
                FAction:'QueryPageUCondition',
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
         * 33.管理后台—根据网关查询所有寄存器仪表关系映射数据
         */
        queryUMapTabByLDasID(id){
            Control({
                FAction:'QueryUMapTabByLDasID',
                LDasID:id
            })
            .then((result) => {
                this.meterMapList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 网关选择发生改变
         */
        selectLdas(id){
            this.meterMapList = []
            this.queryUMapTabByLDasID(id)
        },
        addExpress(){
            this.expressionList.push({
                    condition:'',
                    express:'',
                    value:'',
                    connectExpress:''
            })
        },
        removeExpress(){
            this.expressionList.pop()
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.expressionList = [
                {
                    condition:'',
                    express:'',
                    value:'',
                    connectExpress:''
                }
            ]
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            this.expressionList = []
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            // 解析表达式
            let reg = /(\w|[\u4e00-\u9fa5]*)\s*([><]=*)\s*(\d+)([\&\|]*)/ig,
            reg1 = /(\w|[\u4e00-\u9fa5]*)\s*([><]=*)\s*(\d+)([\&\|]*)/,
            express = row.Express.replace(/[\(\)]/ig,''),
            expressionList = express.match(reg)
            console.log(express,expressionList);
            if(expressionList&&Array.isArray(expressionList)){
                this.expressionList = expressionList.map(item => {
                    let match = item.match(reg1)
                    return {
                        condition:match[1],
                        express:match[2],
                        value:match[3],
                        connectExpress:match[4]
                    }
                })
            }
            this.queryUMapTabByLDasID(row.LDasID)
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
            let list = this.expressionList.map((item,i) => {
                if(i<this.expressionList.length-1){
                    return '(' + item.condition + item.express + item.value+')' + item.connectExpress
                }else{
                    return '(' + item.condition + item.express + item.value + ')'
                }
            })
            this.addInfo.Express = list.join('')
            this.show = false
            Control({
                FAction:'AddOrUpdateUCondition',
                mUCondition:this.addInfo
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
                FAction:'DeleteUCondition',
                ID:row.ConditionID
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
.zw-dialog{
    .el-dialog{
        ul.express{
            width: 400px;
            padding-left: 100px;
            li{
                text-align: center;
                .el-select.condition{
                    .el-input{
                        width: 120px;
                    }
                }
                .el-select.expression,{
                    .el-input{
                        width: 100px;
                    }
                }
                .value.el-input{
                    width: 80px;
                }
            }
            li+li{
                margin-top: 10px;
            }
            li.add{
                i{
                   font-size:30px;cursor:pointer 
                }
                i+i{
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
