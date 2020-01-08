<template>
    <div class="report">
       <ul class="operation">
           <li class="l" v-if="showAdd">
               <el-button :disabled="disabledAdd" @click="beforeAdd">
                   <i class="iconfont icon-Added"></i>新增
               </el-button>
           </li>
            <li class="l" v-if="exportData"><el-button :disabled="disabledExport"  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
            <li class="l"><el-button @click="queryData"><i class="iconfont icon-Refresh"></i>刷新</el-button></li>
            <li class="r">
                <el-input v-if="filter" class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
       </ul>
       <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" :width="dialogWidth" class="zw-dialog">
            <slot name="dialog">
            </slot>
            <div slot="footer">
                <el-button @click="show = false ">取消</el-button>
                <el-button @click="submit">确定</el-button>
            </div>
       </el-dialog>
       <div class="zw-table">
            <el-table
               :data="tableData"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column label="序号" width="80px">
                   <template slot-scope="scope">
                       <div>
                           {{(pageIndex-1)*10+scope.$index+1}}
                       </div>
                   </template>
               </el-table-column>
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
               <slot></slot>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer " title="编辑" @click="editItem(scoped.row)">编辑</span>
                        <span class="pointer" title="删除" v-if="deleteRow" @click="deleteItem(scoped.row)">删除</span>
                        <slot name="row-operation" v-bind:row="scoped.row"></slot>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
       </div>
       <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {zwPagination} from '@/components/index'
import axios from 'axios';
export default {
    data(){
        return{
            type:0,
            show:false,
            total:0,
            filterText:'',
            tableData:[],
            pageIndex:1,
            name:"xiaoming"

        }
    },
    props:{
        tableLabel:{ //表格字段
            require:true,
            type:Array
        },
        getData:{
            require:true,
            type:Function
        },
        'disabled-add':Boolean,
        filter:{ //是否显示搜索框
            default:true,
            type:Boolean
        },
        showAdd:{ //是否显示新增按钮
            default:true,
            type:Boolean
        },
        dialogWidth:{
            default:'695px',
            type:String
        }, //弹出框宽度
        beforeSubmit:Function,//提交之前处理的数据
        submitFun:Function, //新增或修改
        deleteRow:Function, //删除
        exportData:Function //导出
    },
    components:{
        zwPagination
    },
    computed:{
        disabledExport(){
            if(this.tableData.length > 0){
                return false
            }else{
                return true
            }
        }
    },
    watch: {
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
    },
    methods:{
        /**
         * 查询表格数据
         */
        queryData(){
            let param = {
                PageIndex:this.pageIndex,
                PageSize:10,
                SearchKey:this.filterText
            }
            let getData = this.getData(param)
            if(!getData){
                return
            }
            getData.then((result) => {
                this.total = result.FObject.FTotalCount || 0
                this.tableData = result.FObject.Data || []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            }).catch((err) => {
                
            });
        },
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.type = 0;
            this.show = true
            this.$emit('beforeAdd')
        },
        /**
         * 编辑
         */
        editItem(item){
            this.type = 1
            this.show = true
            this.$emit('editItem',item)
        },
        /**
         * 确定（弹出框）
         */
        async submit(){
            this.beforeSubmit&&this.beforeSubmit()
            await new Promise(resolve => {
                 this.$parent.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.submitFun()
            .then((result) => {
                this.show = false
                this.$message({
                    message:'操作成功',
                    type:'success',
                    duration:'500'
                })
                this.queryData()
            }).catch((err) => {
                this.$message({
                    message:'操作失败',
                    type:'error',
                    duration:'500'
                })
            });
            /* this.$emit('submit') */
        },
        beforeDelete(text = ''){
            return new Promise((resolve,reject) => {
                this.$confirm(`此操作将删除${text}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                      resolve()
                  }).catch(() => {
                      reject()
                  });
            })
        },
        /**
         * 删除
         */
        async deleteItem(item){
            await this.beforeDelete()
            this.deleteRow(item)
            .then((result) => {
                if(result.FObject>0){
                    this.queryData()
                    this.$message({
                        message:'删除成功',
                        type:'success',
                        duration:'500'
                    })
                }else{
                    this.$message({
                        message:'删除失败',
                        type:'error',
                        duration:'500'
                    })
                }
            }).catch((err) => {
                this.$message({
                    message:'删除失败',
                    type:'error',
                    duration:'500'
                })
            });
        },
        /**
         * 导出
         */
        exportFile(){
            if(this.tableData.length === 0){
                return
            }
            this.exportData(this)
            .then((result) => {
                window.location = axios.defaults.baseURL + result.FObject;
            }).catch((err) => {
                console.log(err)
            });
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
              return 'odd-row';
            } else if (rowIndex%2 === 0) {
              return 'even-row';
            }
        },
    }
}
</script>
<style lang="scss">
    
</style>