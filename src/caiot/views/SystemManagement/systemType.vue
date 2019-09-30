<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="系统分类名称" prop="ParamName" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.ParamName">
                        <el-option label="建筑类型" value="建筑类型"></el-option>
                        <el-option label="区域分类" value="区域分类"></el-option>
                        <el-option label="设备分类" value="设备分类"></el-option>
                        <el-option label="行业分类" value="行业分类"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统参数值" prop="Value" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Value">
                    </el-input>
                </el-form-item>
                <el-form-item label="扩展采纳数值" prop="Extend" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Extend">
                    </el-input>
                </el-form-item>
                <el-form-item label="图标" prop="IconName">
                  <el-select v-model="addInfo.IconName" filterable placeholder="请选择">
                    <el-option v-for="(item,i) in iconList"  :key="i" :value="item.name">
                        <i :class="['iconfont',item.name]" style="font-size:24px;"></i>
                        <span>{{item.name}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
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
                 label="图标">
                 <template slot-scope="scoped">
                     <div>
                         <i :class="['iconfont',scoped.row.IconName]"></i>
                     </div>
                 </template>
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
import iconJson from '../../static/css_font/iconfont.json'
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
                    prop:'Value',
                    label:'系统名称'
                },
                {
                    prop: 'ParamID',
                    label: '系统参数编号',
                },
                {
                    prop: 'Extend',
                    label: '扩展参数值',
                }
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                ParamID:0,
                ParamName:null,
                Value:null,
                Extend:null,
                IconName:''
            },
            addInfo:{ //新增或修改项目参数
                ParamID:0,
                ParamName:null,
                Value:null,
                Extend:null,
                IconName:''
            },
            title:'新增',
            show:false,
            iconList:[]
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
        this.iconList = iconJson.map(item => JSON.parse(item))
    },
    methods:{
        /**
         * 269.分页查询系统分类
         */
        queryData(){
            system({
                FAction:'QueryPageSSystemParam',
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
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改系统分类
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 265.新增/修改系统分类
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
                FAction:'AddOrUpdateSSystemParam',
                mSSystemParam:this.addInfo
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
         * 268.删除系统分类
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除系统分类'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            system({
                FAction:'DeleteSSystemParam',
                ID:row.ParamID
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
